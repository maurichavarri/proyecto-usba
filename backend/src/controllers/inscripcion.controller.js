import { Op } from "sequelize";
import sequelize from "../config/db.js";

import {
  Equipo,
  Inscripcion,
  TorneoCategoria,
  Torneo,
  Categoria,
} from "../models/index.js";

import { plantelBloqueado } from "../services/plantelBloqueado.service.js";
import { validarPlantelInscripcion } from "../services/validarPlantelInscripcion.service.js";
import { crearSnapshotPlantel } from "../services/inscripcionJugador.service.js";
import { obtenerFechaActualArgentina } from "../utils/fecha.utils.js";

// ========================================================
// DELEGADO
// ========================================================

// ========================================================
// CREAR INSCRIPCIÓN
// ========================================================

export const crearInscripcion = async (req, res, next) => {
  try {
    const { equipo_id, torneo_categoria_id } = req.body;

    const usuarioId = req.usuario.id;

    // =========================
    // CAMPOS OBLIGATORIOS
    // =========================

    if (!equipo_id || !torneo_categoria_id) {
      return res.status(400).json({
        message: "Debe seleccionar un equipo y una competencia.",
      });
    }

    // =========================
    // BUSCAR EQUIPO
    // =========================

    const equipo = await Equipo.findByPk(equipo_id);

    if (!equipo) {
      return res.status(404).json({
        message: "Equipo no encontrado.",
      });
    }

    // =========================
    // VERIFICAR PROPIEDAD
    // =========================

    if (equipo.id_usuario_creador !== req.usuario.id) {
      return res.status(403).json({
        message: "No autorizado.",
      });
    }

    // =========================
    // TORNEO - CATEGORÍA
    // =========================

    const torneoCategoria = await TorneoCategoria.findByPk(
      torneo_categoria_id,
      {
        include: [
          {
            model: Torneo,
            as: "torneo",
          },
        ],
      },
    );

    if (!torneoCategoria) {
      return res.status(404).json({
        message: "Torneo-categoría no encontrado.",
      });
    }

    // =========================
    // FIXTURE GENERADO
    // =========================

    if (torneoCategoria.fixture_generado) {
      return res.status(400).json({
        code: "FIXTURE_GENERADO",

        message:
          "Las inscripciones están cerradas porque el fixture ya fue generado.",
      });
    }

    // =========================
    // VALIDAR FECHAS
    // =========================

    const torneo = torneoCategoria.torneo;

    const hoy = obtenerFechaActualArgentina();

    const fechaInicio = torneo.fecha_inicio;

    const fechaCierre = torneo.fecha_cierre_inscripcion;

    if (hoy >= fechaInicio) {
      return res.status(400).json({
        code: "TORNEO_INICIADO",

        message: "No es posible inscribirse porque el torneo ya comenzó.",
      });
    }

    if (hoy > fechaCierre) {
      return res.status(400).json({
        code: "INSCRIPCION_CERRADA",

        message: "El período de inscripción finalizó.",
      });
    }

    // =========================
    // VERIFICAR SI YA EXISTE
    // UNA INSCRIPCIÓN VIGENTE
    // PARA ESTA COMPETENCIA
    // =========================

    const inscripcionExistente = await Inscripcion.findOne({
      where: {
        equipo_id,

        torneo_categoria_id,

        estado: {
          [Op.in]: ["pendiente", "confirmado"],
        },
      },
    });

    if (inscripcionExistente) {
      return res.status(400).json({
        code: "INSCRIPCION_EXISTENTE",

        message:
          inscripcionExistente.estado === "pendiente"
            ? "El equipo ya posee una inscripción pendiente en esta competencia."
            : "El equipo ya se encuentra confirmado en esta competencia.",
      });
    }

    // =========================
    // VERIFICAR SI EL EQUIPO
    // YA ESTÁ COMPROMETIDO
    // EN OTRA COMPETENCIA
    // =========================

    const equipoComprometido = await plantelBloqueado(equipo_id);

    if (equipoComprometido) {
      return res.status(400).json({
        code: "EQUIPO_COMPROMETIDO",

        message:
          "El equipo ya posee una inscripción pendiente o participa actualmente en otra competencia.",
      });
    }

    // =========================
    // VALIDAR PLANTEL COMPLETO
    // =========================

    const validacion = await validarPlantelInscripcion(
      equipo_id,
      torneo_categoria_id,
    );

    if (!validacion.valido) {
      return res.status(400).json({
        code: validacion.code,

        message: validacion.message,

        requisitos: validacion.requisitos,

        jugadores: validacion.jugadores,

        puede_editar_plantel: true,
      });
    }

    // =========================
    // CREAR INSCRIPCIÓN
    // =========================

    const inscripcion = await Inscripcion.create({
      equipo_id,

      torneo_categoria_id,

      fecha: new Date(),

      estado: "pendiente",

      motivo_rechazo: null,
    });

    // =========================
    // RESPUESTA
    // =========================

    return res.status(201).json({
      code: "INSCRIPCION_CREADA",

      message:
        "Inscripción registrada correctamente y pendiente de aprobación.",

      inscripcion,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================================
// OBTENER MIS INSCRIPCIONES
// ========================================================

export const obtenerMisInscripciones = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;

    const inscripciones = await Inscripcion.findAll({
      include: [
        // =========================
        // EQUIPO
        // =========================

        {
          model: Equipo,

          where: {
            id_usuario_creador: usuarioId,
          },
        },

        // =========================
        // TORNEO - CATEGORÍA
        // =========================

        {
          model: TorneoCategoria,

          as: "torneoCategoria",

          include: [
            {
              model: Torneo,

              as: "torneo",
            },

            {
              model: Categoria,

              as: "categoria",
            },
          ],
        },
      ],

      order: [
        ["fecha", "DESC"],
        ["id", "DESC"],
      ],
    });

    return res.json(inscripciones);
  } catch (error) {
    next(error);
  }
};

// ========================================================
// ADMIN
// ========================================================

// ========================================================
// OBTENER TODAS LAS INSCRIPCIONES
// ========================================================

export const getInscripciones = async (req, res, next) => {
  try {
    const inscripciones = await Inscripcion.findAll({
      include: [
        // =========================
        // EQUIPO
        // =========================

        {
          model: Equipo,

          attributes: ["id", "nombre"],
        },

        // =========================
        // TORNEO - CATEGORÍA
        // =========================

        {
          model: TorneoCategoria,

          as: "torneoCategoria",

          include: [
            {
              model: Torneo,

              as: "torneo",

              attributes: [
                "id",
                "nombre",
                "fecha_inicio",
                "fecha_cierre_inscripcion",
              ],
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
      ],

      order: [
        ["fecha", "DESC"],
        ["id", "DESC"],
      ],
    });

    return res.json(inscripciones);
  } catch (error) {
    next(error);
  }
};

// ========================================================
// ADMIN - CONFIRMAR / RECHAZAR INSCRIPCIÓN
// ========================================================

export const cambiarEstadoInscripcion = async (req, res, next) => {
  // La transacción se declara afuera
  // para poder hacer rollback ante errores.
  let transaction;

  try {
    const { id } = req.params;

    const { estado, motivo_rechazo } = req.body;

    // =========================
    // VALIDAR ESTADO
    // =========================

    if (estado !== "confirmado" && estado !== "rechazado") {
      return res.status(400).json({
        code: "ESTADO_INVALIDO",

        message: "Estado de inscripción inválido.",
      });
    }

    // =========================
    // INICIAR TRANSACCIÓN
    // =========================

    transaction = await sequelize.transaction();

    // =========================
    // BUSCAR Y BLOQUEAR
    // LA INSCRIPCIÓN
    // =========================

    const inscripcion = await Inscripcion.findByPk(id, {
      transaction,

      lock: transaction.LOCK.UPDATE,
    });

    // =========================
    // EXISTENCIA
    // =========================

    if (!inscripcion) {
      await transaction.rollback();

      transaction = null;

      return res.status(404).json({
        message: "Inscripción no encontrada.",
      });
    }

    // =========================
    // SOLO SE PUEDE RESOLVER
    // UNA INSCRIPCIÓN PENDIENTE
    // =========================

    if (inscripcion.estado !== "pendiente") {
      await transaction.rollback();

      transaction = null;

      return res.status(400).json({
        code: "INSCRIPCION_YA_RESUELTA",

        message: `La inscripción ya fue ${inscripcion.estado}.`,
      });
    }

    // =====================================================
    // RECHAZAR INSCRIPCIÓN
    // =====================================================

    if (estado === "rechazado") {
      // =========================
      // MOTIVO OBLIGATORIO
      // =========================

      if (!motivo_rechazo || !motivo_rechazo.trim()) {
        await transaction.rollback();

        transaction = null;

        return res.status(400).json({
          code: "MOTIVO_REQUERIDO",

          message: "Debe indicar el motivo del rechazo.",
        });
      }

      const motivo = motivo_rechazo.trim();

      // =========================
      // LONGITUD MÍNIMA
      // =========================

      if (motivo.length < 5) {
        await transaction.rollback();

        transaction = null;

        return res.status(400).json({
          code: "MOTIVO_INVALIDO",

          message: "El motivo del rechazo debe ser más descriptivo.",
        });
      }

      // =========================
      // LONGITUD MÁXIMA
      // =========================

      if (motivo.length > 500) {
        await transaction.rollback();

        transaction = null;

        return res.status(400).json({
          code: "MOTIVO_DEMASIADO_LARGO",

          message: "El motivo del rechazo no puede superar los 500 caracteres.",
        });
      }

      // =========================
      // RECHAZAR
      // =========================

      await inscripcion.update(
        {
          estado: "rechazado",

          motivo_rechazo: motivo,
        },
        {
          transaction,
        },
      );

      // =========================
      // CONFIRMAR TRANSACCIÓN
      // =========================

      await transaction.commit();

      transaction = null;

      return res.json({
        code: "INSCRIPCION_RECHAZADA",

        message: "Inscripción rechazada correctamente.",

        inscripcion: {
          id: inscripcion.id,

          estado: "rechazado",

          motivo_rechazo: motivo,
        },
      });
    }

    // =====================================================
    // CONFIRMAR INSCRIPCIÓN
    // =====================================================

    // =========================
    // TORNEO - CATEGORÍA
    // =========================

    const torneoCategoria = await TorneoCategoria.findByPk(
      inscripcion.torneo_categoria_id,

      {
        transaction,

        include: [
          {
            model: Torneo,

            as: "torneo",

            attributes: ["fecha_inicio", "fecha_cierre_inscripcion"],
          },
        ],
      },
    );

    if (!torneoCategoria) {
      await transaction.rollback();

      transaction = null;

      return res.status(404).json({
        message: "Torneo-categoría no encontrado.",
      });
    }

    // =========================
    // FIXTURE GENERADO
    // =========================

    if (torneoCategoria.fixture_generado) {
      await transaction.rollback();

      transaction = null;

      return res.status(400).json({
        code: "FIXTURE_GENERADO",

        message:
          "No es posible aceptar la inscripción porque el fixture ya fue generado.",
      });
    }

    // =========================
    // VALIDAR FECHA CIERRE
    // =========================

    const hoy = obtenerFechaActualArgentina();

    const fechaCierre = torneoCategoria.torneo.fecha_cierre_inscripcion;

    if (hoy > fechaCierre) {
      await transaction.rollback();

      transaction = null;

      return res.status(400).json({
        code: "INSCRIPCION_CERRADA",

        message: "No es posible aceptar. El período de inscripción finalizó.",
      });
    }

    // =========================
    // REVALIDAR TODO EL PLANTEL
    // =========================

    const validacion = await validarPlantelInscripcion(
      inscripcion.equipo_id,

      inscripcion.torneo_categoria_id,

      inscripcion.id,
    );

    if (!validacion.valido) {
      await transaction.rollback();

      transaction = null;

      return res.status(400).json({
        code: validacion.code,

        message: `No es posible confirmar la inscripción. ${validacion.message}`,

        requisitos: validacion.requisitos,

        jugadores: validacion.jugadores,
      });
    }

    // =========================
    // CREAR SNAPSHOT HISTÓRICO
    // =========================

    await crearSnapshotPlantel(
      inscripcion.id,
      inscripcion.equipo_id,
      transaction,
    );

    // =========================
    // CONFIRMAR INSCRIPCIÓN
    // =========================

    await inscripcion.update(
      {
        estado: "confirmado",
        motivo_rechazo: null,
      },
      {
        transaction,
      },
    );

    // =========================
    // COMMIT
    // =========================

    await transaction.commit();
    transaction = null;

    // =========================
    // RESPUESTA
    // =========================

    return res.json({
      code: "INSCRIPCION_CONFIRMADA",
      message: "Inscripción confirmada correctamente.",
    });
  } catch (error) {
    // =========================
    // ROLLBACK
    // =========================

    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error("Error realizando rollback:", rollbackError);
      }
    }

    next(error);
  }
};
