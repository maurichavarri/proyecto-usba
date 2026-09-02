import { Op } from "sequelize";
import Jugador from "../models/jugador.model.js";
import Equipo from "../models/equipo.model.js";
import Sancion from "../models/sancion.model.js";
import Inscripcion from "../models/inscripcion.model.js";
import { plantelBloqueado } from "../services/plantelBloqueado.service.js";

export const crearJugador = async (req, res, next) => {
  try {
    const { nombre, apellido, dni, dorsal, fecha_nacimiento, sexo, equipo_id } =
      req.body;
    const usuarioId = req.usuario.id;

    // =========================
    // CAMPOS OBLIGATORIOS
    // =========================

    if (
      !nombre ||
      !apellido ||
      !dni ||
      dorsal === undefined ||
      !fecha_nacimiento ||
      !sexo ||
      !equipo_id
    ) {
      return res.status(400).json({
        message: "Todos los campos del jugador son obligatorios.",
      });
    }

    // =========================
    // VALIDAR DNI
    // =========================

    if (!/^\d{7,8}$/.test(dni)) {
      return res.status(400).json({
        message: "El DNI debe contener únicamente 7 u 8 números.",
      });
    }

    // =========================
    // VALIDAR DORSAL
    // =========================

    if (!Number.isInteger(Number(dorsal))) {
      return res.status(400).json({
        message: "El dorsal debe ser numérico.",
      });
    }

    const dorsalNumero = Number(dorsal);

    if (dorsalNumero < 0 || dorsalNumero > 99) {
      return res.status(400).json({
        message: "El dorsal debe estar entre 0 y 99.",
      });
    }

    // =========================
    // VALIDAR SEXO
    // =========================

    if (sexo !== "masculino" && sexo !== "femenino") {
      return res.status(400).json({
        message: "El sexo del jugador no es válido.",
      });
    }

    // =========================
    // VALIDAR FECHA NACIMIENTO
    // =========================

    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_nacimiento)) {
      return res.status(400).json({
        message: "La fecha de nacimiento no es válida.",
      });
    }

    const [anio, mes, dia] = fecha_nacimiento.split("-").map(Number);

    const fechaValidacion = new Date(anio, mes - 1, dia);

    if (
      fechaValidacion.getFullYear() !== anio ||
      fechaValidacion.getMonth() !== mes - 1 ||
      fechaValidacion.getDate() !== dia
    ) {
      return res.status(400).json({
        message: "La fecha de nacimiento no es válida.",
      });
    }

    // Evitar fechas futuras
    const hoy = new Date();

    const hoySinHora = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
    );

    if (fechaValidacion > hoySinHora) {
      return res.status(400).json({
        message: "La fecha de nacimiento no puede ser futura.",
      });
    }

    // =========================
    // BUSCAR EQUIPO
    // =========================

    const equipo = await Equipo.findByPk(equipo_id);

    if (!equipo) {
      return res.status(404).json({
        message: "Equipo no encontrado",
      });
    }

    // =========================
    // OWNERSHIP
    // =========================

    if (equipo.id_usuario_creador !== usuarioId) {
      return res.status(403).json({
        message: "No autorizado",
      });
    }

    // =========================
    // PLANTEL BLOQUEADO
    // =========================

    const bloqueado = await plantelBloqueado(equipo_id);

    if (bloqueado) {
      return res.status(400).json({
        code: "PLANTEL_BLOQUEADO",
        message:
          "No es posible agregar jugadores porque el equipo ya realizó una inscripción.",
      });
    }

    // =========================
    // MÁXIMO 12 JUGADORES
    // =========================

    const cantidadJugadores = await Jugador.count({
      where: {
        equipo_id,
      },
    });

    if (cantidadJugadores >= 12) {
      return res.status(400).json({
        message: "El equipo ya alcanzó el máximo permitido de 12 jugadores.",
      });
    }

    // =========================
    // DNI REPETIDO EN EL EQUIPO
    // =========================

    const existeJugador = await Jugador.findOne({
      where: {
        dni,
        equipo_id,
      },
    });

    if (existeJugador) {
      return res.status(400).json({
        message: "Ya existe un jugador con ese DNI en el equipo",
      });
    }

    // =========================
    // DORSAL REPETIDO
    // =========================

    const existeDorsal = await Jugador.findOne({
      where: {
        dorsal: dorsalNumero,
        equipo_id,
      },
    });

    if (existeDorsal) {
      return res.status(400).json({
        message: "Ya existe un jugador con ese dorsal en el equipo",
      });
    }

    // =========================
    // CREAR JUGADOR
    // =========================

    const jugador = await Jugador.create({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      dni,
      dorsal: dorsalNumero,
      fecha_nacimiento,
      sexo,
      equipo_id,
    });

    res.status(201).json(jugador);
  } catch (error) {
    next(error);
  }
};

export const obtenerJugadoresPorEquipo = async (req, res, next) => {
  try {
    const { equipoId } = req.params;
    const usuarioId = req.usuario.id;
    const equipo = await Equipo.findByPk(equipoId);

    if (!equipo) {
      return res.status(404).json({
        message: "Equipo no encontrado",
      });
    }

    // Ownership
    if (equipo.id_usuario_creador !== usuarioId) {
      return res.status(403).json({
        message: "No autorizado",
      });
    }

    const jugadores = await Jugador.findAll({
      where: {
        equipo_id: equipoId,
      },
      include: [
        {
          model: Sancion,
          as: "sanciones",
          where: {
            estado: "activa",
          },
          required: false,
          attributes: [
            "id",
            "falta",
            "tipo",
            "descripcion",
            "fecha",
            "fechas_suspension",
            "fechas_cumplidas",
            "estado",
          ],
        },
      ],
      order: [["dorsal", "ASC"]],
    });

    res.json(jugadores);
  } catch (error) {
    next(error);
  }
};

export const obtenerJugador = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;
    const jugador = await Jugador.findByPk(id);

    if (!jugador) {
      return res.status(404).json({
        message: "Jugador no encontrado",
      });
    }

    const equipo = await Equipo.findByPk(jugador.equipo_id);

    if (!equipo || equipo.id_usuario_creador !== usuarioId) {
      return res.status(403).json({
        message: "No autorizado",
      });
    }

    res.json(jugador);
  } catch (error) {
    next(error);
  }
};

export const editarJugador = async (req, res, next) => {
  try {
    // =========================
    // BUSCAR JUGADOR
    // =========================

    const jugador = await Jugador.findByPk(req.params.id);

    if (!jugador) {
      return res.status(404).json({
        message: "Jugador no encontrado",
      });
    }

    // =========================
    // VALIDAR PROPIETARIO
    // =========================

    const usuarioId = req.usuario.id;

    const equipo = await Equipo.findByPk(jugador.equipo_id);

    if (!equipo || equipo.id_usuario_creador !== usuarioId) {
      return res.status(403).json({
        message: "No autorizado",
      });
    }

    // =========================
    // VALIDAR PLANTEL BLOQUEADO
    // =========================

    const bloqueado = await plantelBloqueado(jugador.equipo_id);

    if (bloqueado) {
      return res.status(400).json({
        code: "PLANTEL_BLOQUEADO",
        message:
          "No es posible editar el jugador porque el equipo ya realizó una inscripción.",
      });
    }

    // =========================
    // DATOS
    // =========================

    const { nombre, apellido, dni, dorsal, fecha_nacimiento, sexo } = req.body;

    // =========================
    // CAMPOS OBLIGATORIOS
    // =========================

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        message: "Debe ingresar un nombre.",
      });
    }

    if (!apellido || !apellido.trim()) {
      return res.status(400).json({
        message: "Debe ingresar un apellido.",
      });
    }

    if (!dni) {
      return res.status(400).json({
        message: "Debe ingresar un DNI.",
      });
    }

    if (dorsal === undefined || dorsal === null || dorsal === "") {
      return res.status(400).json({
        message: "Debe ingresar un dorsal.",
      });
    }

    if (!fecha_nacimiento) {
      return res.status(400).json({
        message: "Debe ingresar la fecha de nacimiento.",
      });
    }

    if (!sexo) {
      return res.status(400).json({
        message: "Debe seleccionar el sexo del jugador.",
      });
    }

    // =========================
    // VALIDAR DNI
    // =========================

    if (!/^\d{7,8}$/.test(dni)) {
      return res.status(400).json({
        message: "El DNI debe contener 7 u 8 números.",
      });
    }

    // =========================
    // VALIDAR DORSAL
    // =========================

    const dorsalNumero = Number(dorsal);

    if (!Number.isInteger(dorsalNumero)) {
      return res.status(400).json({
        message: "El dorsal debe ser un número entero.",
      });
    }

    if (dorsalNumero < 0 || dorsalNumero > 99) {
      return res.status(400).json({
        message: "El dorsal debe estar entre 0 y 99.",
      });
    }

    // =========================
    // VALIDAR SEXO
    // =========================

    if (sexo !== "masculino" && sexo !== "femenino") {
      return res.status(400).json({
        message: "El sexo del jugador no es válido.",
      });
    }

    // =========================
    // VALIDAR FECHA NACIMIENTO
    // =========================

    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_nacimiento)) {
      return res.status(400).json({
        message: "La fecha de nacimiento no es válida.",
      });
    }

    const [anio, mes, dia] = fecha_nacimiento.split("-").map(Number);

    const fechaNacimiento = new Date(anio, mes - 1, dia);

    // Detecta fechas imposibles como 31/02
    if (
      fechaNacimiento.getFullYear() !== anio ||
      fechaNacimiento.getMonth() !== mes - 1 ||
      fechaNacimiento.getDate() !== dia
    ) {
      return res.status(400).json({
        message: "La fecha de nacimiento no es válida.",
      });
    }

    // No permitir fecha futura
    const hoy = new Date();

    const hoySinHora = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
    );

    if (fechaNacimiento > hoySinHora) {
      return res.status(400).json({
        message: "La fecha de nacimiento no puede ser futura.",
      });
    }

    // =========================
    // DNI REPETIDO EN EL EQUIPO
    // =========================

    const existeDni = await Jugador.findOne({
      where: {
        dni,
        equipo_id: jugador.equipo_id,
        id: {
          [Op.ne]: jugador.id,
        },
      },
    });

    if (existeDni) {
      return res.status(400).json({
        message: "Ya existe otro jugador con ese DNI en el equipo.",
      });
    }

    // =========================
    // DORSAL REPETIDO
    // =========================

    const existeDorsal = await Jugador.findOne({
      where: {
        dorsal: dorsalNumero,
        equipo_id: jugador.equipo_id,
        id: {
          [Op.ne]: jugador.id,
        },
      },
    });

    if (existeDorsal) {
      return res.status(400).json({
        message: "Ya existe otro jugador con ese dorsal.",
      });
    }

    // =========================
    // ACTUALIZAR
    // =========================

    await jugador.update({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      dni,
      dorsal: dorsalNumero,
      fecha_nacimiento,
      sexo,
    });

    res.json({
      message: "Jugador actualizado correctamente",
      jugador,
    });
  } catch (error) {
    next(error);
  }
};

export const cambiarEstadoJugador = async (req, res, next) => {
  try {
    const jugador = await Jugador.findByPk(req.params.id);

    const bloqueado = await plantelBloqueado(jugador.equipo_id);

    if (bloqueado) {
      return res.status(400).json({
        message:
          "No es posible activar o desactivar jugadores porque el equipo ya posee una inscripción confirmada.",
      });
    }

    if (!jugador) {
      return res.status(404).json({
        message: "Jugador no encontrado",
      });
    }

    await jugador.update({
      estado: jugador.estado === "activo" ? "inactivo" : "activo",
    });

    res.json({
      message: "Estado actualizado correctamente",
    });
  } catch (error) {
    next(error);
  }
};