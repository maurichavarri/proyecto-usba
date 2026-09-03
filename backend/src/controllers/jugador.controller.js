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
      dorsal === null ||
      dorsal === "" ||
      !fecha_nacimiento ||
      !sexo ||
      !equipo_id
    ) {
      return res.status(400).json({
        message: "Todos los campos del jugador son obligatorios.",
      });
    }

    // =========================
    // DNI
    // =========================

    if (!/^\d{7,8}$/.test(dni)) {
      return res.status(400).json({
        message: "El DNI debe contener únicamente 7 u 8 números.",
      });
    }

    // =========================
    // DORSAL
    // =========================

    const dorsalNumero = Number(dorsal);

    if (!Number.isInteger(dorsalNumero)) {
      return res.status(400).json({
        message: "El dorsal debe ser numérico.",
      });
    }

    if (dorsalNumero < 0 || dorsalNumero > 99) {
      return res.status(400).json({
        message: "El dorsal debe estar entre 0 y 99.",
      });
    }

    // =========================
    // SEXO
    // =========================

    if (sexo !== "masculino" && sexo !== "femenino") {
      return res.status(400).json({
        message: "El sexo del jugador no es válido.",
      });
    }

    // =========================
    // FECHA DE NACIMIENTO
    // =========================

    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_nacimiento)) {
      return res.status(400).json({
        message: "La fecha de nacimiento no es válida.",
      });
    }

    const [anio, mes, dia] = fecha_nacimiento.split("-").map(Number);

    const fechaNacimiento = new Date(anio, mes - 1, dia);

    if (
      fechaNacimiento.getFullYear() !== anio ||
      fechaNacimiento.getMonth() !== mes - 1 ||
      fechaNacimiento.getDate() !== dia
    ) {
      return res.status(400).json({
        message: "La fecha de nacimiento no es válida.",
      });
    }

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
          "No es posible agregar jugadores mientras el equipo tenga una inscripción pendiente o participe en una competencia.",
      });
    }

    // =========================
    // MÁXIMO 12 EN PLANTEL ACTUAL
    // =========================

    const cantidadJugadores = await Jugador.count({
      where: {
        equipo_id,
        en_plantel: true,
      },
    });

    if (cantidadJugadores >= 12) {
      return res.status(400).json({
        message: "El equipo ya alcanzó el máximo permitido de 12 jugadores.",
      });
    }

    // =========================
    // DORSAL ACTUAL REPETIDO
    // =========================

    const existeDorsal = await Jugador.findOne({
      where: {
        dorsal: dorsalNumero,
        equipo_id,
        en_plantel: true,
      },
    });

    if (existeDorsal) {
      return res.status(400).json({
        message: "Ya existe un jugador con ese dorsal en el plantel.",
      });
    }

    // =========================
    // BUSCAR DNI HISTÓRICO
    // =========================

    const jugadorExistente = await Jugador.findOne({
      where: {
        dni,
        equipo_id,
      },
    });

    // =========================
    // YA ESTÁ EN EL PLANTEL
    // =========================

    if (jugadorExistente && jugadorExistente.en_plantel) {
      return res.status(400).json({
        code: "JUGADOR_YA_EN_PLANTEL",
        message: "El jugador ya pertenece actualmente a este plantel.",
      });
    }

    // =========================
    // JUGADOR HISTÓRICO:
    // REINCORPORAR
    // =========================

    if (jugadorExistente && !jugadorExistente.en_plantel) {

      // Verificar si todavía posee alguna sanción activa
      const sancionesActivas = await Sancion.count({
        where: {
          jugador_id: jugadorExistente.id,
          estado: "activa",
        },
      });

      await jugadorExistente.update({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        dorsal: dorsalNumero,
        fecha_nacimiento,
        sexo,
        en_plantel: true,
        estado: sancionesActivas > 0 ? "inactivo" : "activo",
      });
      return res.status(200).json({
        code: "JUGADOR_REINCORPORADO",
        message: "El jugador perteneció anteriormente al equipo y fue reincorporado al plantel.",
        jugador: jugadorExistente,
      });
    }

    // =========================
    // NUEVO JUGADOR
    // =========================

    const jugador = await Jugador.create({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      dni,
      dorsal: dorsalNumero,
      fecha_nacimiento,
      sexo,
      equipo_id,
      estado: "activo",
      en_plantel: true,
      es_delegado: false,
      usuario_id: null,
    });

    res.status(201).json({
      code: "JUGADOR_CREADO",
      message: "Jugador creado correctamente.",
      jugador,
    });
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
        en_plantel: true,
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
    // OWNERSHIP
    // =========================

    const usuarioId = req.usuario.id;
    const equipo = await Equipo.findByPk(jugador.equipo_id);

    if (!equipo || equipo.id_usuario_creador !== usuarioId) {
      return res.status(403).json({
        message: "No autorizado",
      });
    }

    // =========================
    // PLANTEL BLOQUEADO
    // =========================

    const bloqueado = await plantelBloqueado(jugador.equipo_id);

    if (bloqueado) {
      return res.status(400).json({
        code: "PLANTEL_BLOQUEADO",
        message:
          "No es posible editar el plantel mientras el equipo tenga una inscripción pendiente o participe en una competencia.",
      });
    }

    // =========================
    // JUGADOR DELEGADO
    // =========================

    if (jugador.es_delegado) {
      const { dorsal } = req.body;

      if (dorsal === undefined || dorsal === null || dorsal === "") {
        return res.status(400).json({
          message: "Debe ingresar un dorsal.",
        });
      }

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

      // Verificar que otro jugador
      // no tenga ese dorsal

      const existeDorsal = await Jugador.findOne({
        where: {
          dorsal: dorsalNumero,
          equipo_id: jugador.equipo_id,
          en_plantel: true,
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

      await jugador.update({
        dorsal: dorsalNumero,
      });

      return res.json({
        message: "Dorsal actualizado correctamente.",
        jugador,
      });
    }

    // =========================
    // JUGADOR NORMAL
    // =========================

    const { nombre, apellido, dni, dorsal, fecha_nacimiento, sexo } = req.body;

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

    // =========================
    // DNI
    // =========================

    if (!/^\d{7,8}$/.test(dni)) {
      return res.status(400).json({
        message: "El DNI debe contener 7 u 8 números.",
      });
    }

    // =========================
    // DORSAL
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
    // SEXO
    // =========================

    if (sexo !== "masculino" && sexo !== "femenino") {
      return res.status(400).json({
        message: "El sexo del jugador no es válido.",
      });
    }

    // =========================
    // FECHA NACIMIENTO
    // =========================

    if (!fecha_nacimiento || !/^\d{4}-\d{2}-\d{2}$/.test(fecha_nacimiento)) {
      return res.status(400).json({
        message: "La fecha de nacimiento no es válida.",
      });
    }

    const [anio, mes, dia] = fecha_nacimiento.split("-").map(Number);
    const fechaNacimiento = new Date(anio, mes - 1, dia);

    if (
      fechaNacimiento.getFullYear() !== anio ||
      fechaNacimiento.getMonth() !== mes - 1 ||
      fechaNacimiento.getDate() !== dia
    ) {
      return res.status(400).json({
        message: "La fecha de nacimiento no es válida.",
      });
    }

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
    // DNI REPETIDO EN PLANTEL
    // =========================

    const existeDni = await Jugador.findOne({
      where: {
        dni,
        equipo_id: jugador.equipo_id,
        en_plantel: true,
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
        en_plantel: true,
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
      message: "Jugador actualizado correctamente.",
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

export const quitarJugador = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    // =========================
    // BUSCAR JUGADOR
    // =========================

    const jugador = await Jugador.findByPk(id);

    if (!jugador) {
      return res.status(404).json({
        message: "Jugador no encontrado.",
      });
    }

    // =========================
    // BUSCAR EQUIPO / OWNERSHIP
    // =========================

    const equipo = await Equipo.findByPk(jugador.equipo_id);

    if (!equipo || equipo.id_usuario_creador !== usuarioId) {
      return res.status(403).json({
        message: "No autorizado.",
      });
    }

    // =========================
    // YA NO ESTÁ EN EL PLANTEL
    // =========================

    if (!jugador.en_plantel) {
      return res.status(400).json({
        message: "El jugador ya no pertenece al plantel.",
      });
    }

    // =========================
    // DELEGADO OBLIGATORIO
    // =========================

    if (jugador.es_delegado) {
      return res.status(400).json({
        code: "DELEGADO_OBLIGATORIO",

        message:
          "El delegado debe formar parte del equipo y no puede ser quitado del plantel.",
      });
    }

    // =========================
    // PLANTEL BLOQUEADO
    // =========================

    const bloqueado = await plantelBloqueado(jugador.equipo_id);

    if (bloqueado) {
      return res.status(400).json({
        code: "PLANTEL_BLOQUEADO",

        message:
          "No es posible quitar jugadores mientras el equipo tenga una inscripción pendiente o participe en una competencia.",
      });
    }

    // =========================
    // QUITAR DEL PLANTEL
    // =========================

    await jugador.update({
      en_plantel: false,
    });

    res.json({
      message: "Jugador quitado del plantel correctamente.",
    });
  } catch (error) {
    next(error);
  }
};
