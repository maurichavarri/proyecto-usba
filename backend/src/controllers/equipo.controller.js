import { Sequelize } from "sequelize";
import sequelize from "../config/db.js";
import {
  Equipo,
  Inscripcion,
  TorneoCategoria,
  Torneo,
  Categoria,
  InscripcionJugador,
  Jugador,
  Delegado,
} from "../models/index.js";

export const crearEquipo = async (req, res, next) => {
  try {
    const { nombre, descripcion, dorsal_delegado } = req.body;
    const usuarioId = req.usuario.id;

    // =========================
    // VALIDAR NOMBRE
    // =========================

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        message: "El nombre del equipo es obligatorio.",
      });
    }

    const nombreNormalizado = nombre.trim();

    // =========================
    // VALIDAR DORSAL DELEGADO
    // =========================

    if (
      dorsal_delegado === undefined ||
      dorsal_delegado === null ||
      dorsal_delegado === ""
    ) {
      return res.status(400).json({
        message: "Debe indicar su dorsal para este equipo.",
      });
    }

    const dorsalDelegado = Number(dorsal_delegado);

    if (!Number.isInteger(dorsalDelegado)) {
      return res.status(400).json({
        message: "El dorsal debe ser un número entero.",
      });
    }

    if (dorsalDelegado < 0 || dorsalDelegado > 99) {
      return res.status(400).json({
        message: "El dorsal debe estar entre 0 y 99.",
      });
    }

    // =========================
    // BUSCAR PERFIL DELEGADO
    // =========================

    const delegado = await Delegado.findOne({
      where: {
        usuario_id: usuarioId,
      },
    });

    if (!delegado) {
      return res.status(400).json({
        message: "No se encontró el perfil del delegado.",
      });
    }

    // =========================
    // EQUIPO CON MISMO NOMBRE
    // =========================

    const equipoExistente = await Equipo.findOne({
      where: {
        nombre: nombreNormalizado,
        id_usuario_creador: usuarioId,
      },
    });

    if (equipoExistente) {
      return res.status(400).json({
        code: "EQUIPO_DUPLICADO",
        message: "Ya tenés un equipo registrado con ese nombre.",
      });
    }

    // =========================
    // TRANSACCIÓN
    // =========================

    const resultado = await sequelize.transaction(async (transaction) => {
      // -------------------------
      // CREAR EQUIPO
      // -------------------------

      const equipo = await Equipo.create(
        {
          nombre: nombreNormalizado,
          descripcion: descripcion?.trim() || "",
          creado_en: new Date().getFullYear(),
          id_usuario_creador: usuarioId,
        },
        {
          transaction,
        },
      );

      // -------------------------
      // CREAR AL DELEGADO
      // COMO PRIMER JUGADOR
      // -------------------------

      const jugadorDelegado = await Jugador.create(
        {
          nombre: delegado.nombre,
          apellido: delegado.apellido,
          dni: delegado.dni,
          dorsal: dorsalDelegado,
          fecha_nacimiento: delegado.fecha_nacimiento,
          sexo: delegado.sexo,
          estado: "activo",
          en_plantel: true,
          es_delegado: true,
          usuario_id: usuarioId,
          equipo_id: equipo.id,
        },
        {
          transaction,
        },
      );

      return {
        equipo,
        jugadorDelegado,
      };
    });

    // =========================
    // RESPUESTA
    // =========================

    res.status(201).json({
      message: "Equipo creado correctamente.",
      equipo: resultado.equipo,
      jugador_delegado: resultado.jugadorDelegado,
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerMisEquipos = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const equipos = await Equipo.findAll({
      where: {
        id_usuario_creador: usuarioId,
      },

      attributes: {
        include: [
          // =========================
          // JUGADORES DEL PLANTEL ACTUAL
          // =========================
          [
            Sequelize.literal(`
                            (
                                SELECT COUNT(*)
                                FROM jugador
                                WHERE jugador.equipo_id = Equipo.id
                                AND jugador.en_plantel = 1
                            )
                        `),
            "cantidad_jugadores",
          ],

          // =========================
          // PARTICIPACIONES HISTÓRICAS
          // =========================
          [
            Sequelize.literal(`
                            (
                                SELECT COUNT(*)
                                FROM inscripcion
                                WHERE inscripcion.equipo_id = Equipo.id
                                AND inscripcion.estado = 'confirmado'
                            )
                        `),
            "cantidad_competencias",
          ],
        ],
      },
      order: [["id", "DESC"]],
    });

    res.json(equipos);
  } catch (error) {
    next(error);
  }
};

export const obtenerHistorialEquipo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    // =========================
    // BUSCAR EQUIPO
    // Y VERIFICAR PROPIEDAD
    // =========================

    const equipo = await Equipo.findOne({
      where: {
        id,
        id_usuario_creador: usuarioId,
      },
      attributes: ["id", "nombre", "descripcion", "creado_en"],
    });

    if (!equipo) {
      return res.status(404).json({
        message: "Equipo no encontrado o no autorizado.",
      });
    }

    // =========================
    // BUSCAR PARTICIPACIONES
    // CONFIRMADAS
    // =========================

    const inscripciones = await Inscripcion.findAll({
      where: {
        equipo_id: id,
        estado: "confirmado",
      },
      attributes: ["id", "fecha", "estado"],
      include: [
        // =========================
        // COMPETENCIA
        // =========================

        {
          model: TorneoCategoria,
          as: "torneoCategoria",
          attributes: ["id", "estado_competencia"],
          include: [
            {
              model: Torneo,
              as: "torneo",
              attributes: ["id", "nombre", "fecha_inicio", "fecha_fin"],
            },

            {
              model: Categoria,
              as: "categoria",
              attributes: [
                "id",
                "nombre",
                "edad_minima",
                "edad_maxima",
                "sexo",
              ],
            },
          ],
        },

        // =========================
        // SNAPSHOT DEL PLANTEL
        // =========================

        {
          model: InscripcionJugador,
          as: "jugadores",
          attributes: [
            "id",
            "jugador_id",
            "nombre",
            "apellido",
            "dni",
            "dorsal",
            "fecha_nacimiento",
            "sexo",
            "es_delegado",
          ],
        },
      ],

      order: [
        ["fecha", "DESC"],
        ["id", "DESC"],
      ],
    });

    // =========================
    // ORDENAR JUGADORES
    // POR DORSAL
    // =========================

    const participaciones = inscripciones.map((inscripcion) => {
      const datos = inscripcion.toJSON();

      datos.jugadores = (datos.jugadores || []).sort(
        (a, b) => Number(a.dorsal) - Number(b.dorsal),
      );

      return datos;
    });

    // =========================
    // RESPUESTA
    // =========================

    return res.json({
      equipo,
      cantidad_participaciones: participaciones.length,
      participaciones,
    });
  } catch (error) {
    next(error);
  }
};