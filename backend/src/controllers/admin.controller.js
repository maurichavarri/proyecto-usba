import sequelize from "../config/db.js";

import Inscripcion from "../models/inscripcion.model.js";
import Equipo from "../models/equipo.model.js";
import TorneoCategoria from "../models/torneoCategoria.model.js";
import Torneo from "../models/torneo.model.js";
import Categoria from "../models/categoria.model.js";
import Partido from "../models/partido.model.js";
import Sede from "../models/sede.model.js";
import Arbitro from "../models/arbitro.model.js";
import InscripcionJugador from "../models/inscripcionJugador.model.js";

import { obtenerFechaActualArgentina } from "../utils/fecha.utils.js";
import { crearSnapshotPlantel } from "../services/inscripcionJugador.service.js";
import { validarPlantelInscripcion } from "../services/validarPlantelInscripcion.service.js";
//import { validarJugadoresDuplicados } from "../services/validarJugadoresDuplicados.service.js";

export const obtenerInscripcionesAdmin = async (req, res, next) => {
  try {
    const inscripciones = await Inscripcion.findAll({
      include: [
        {
          model: Equipo,
          attributes: ["id", "nombre"],
        },
        {
          model: TorneoCategoria,
          as: "torneoCategoria",
          include: [
            {
              model: Torneo,
              as: "torneo",
              attributes: ["id", "nombre"],
            },
            {
              model: Categoria,
              as: "categoria",
              attributes: ["id", "nombre"],
            },
          ],
        },
      ],

      order: [["fecha", "DESC"]],
    });

    res.json(inscripciones);
  } catch (error) {
    next(error);
  }
};

export const actualizarEstadoInscripcion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado, motivo_rechazo } = req.body;

    // =====================================================
    // ESTADO VÁLIDO
    // =====================================================

    if (estado !== "confirmado" && estado !== "rechazado") {
      return res.status(400).json({
        code: "ESTADO_INVALIDO",
        message: "Estado inválido.",
      });
    }

    // =====================================================
    // BUSCAR INSCRIPCIÓN
    // =====================================================

    const inscripcion = await Inscripcion.findByPk(id);

    if (!inscripcion) {
      return res.status(404).json({
        message: "Inscripción no encontrada.",
      });
    }

    // =====================================================
    // SOLO INSCRIPCIONES PENDIENTES
    // =====================================================

    if (inscripcion.estado !== "pendiente") {
      return res.status(400).json({
        code: "INSCRIPCION_YA_RESUELTA",
        message: `La inscripción ya fue ${inscripcion.estado}.`,
      });
    }

    // =====================================================
    // RECHAZAR
    // =====================================================
    //
    // IMPORTANTE:
    // El rechazo sigue permitido aunque el fixture
    // ya haya sido generado.
    //
    // Esto permite desbloquear el equipo que quedó
    // fuera de la competencia.
    // =====================================================

    if (estado === "rechazado") {
      // =========================
      // MOTIVO OBLIGATORIO
      // =========================

      if (!motivo_rechazo || !motivo_rechazo.trim()) {
        return res.status(400).json({
          code: "MOTIVO_REQUERIDO",
          message: "Debe indicar el motivo del rechazo.",
        });
      }

      const motivo = motivo_rechazo.trim();

      if (motivo.length < 5) {
        return res.status(400).json({
          code: "MOTIVO_INVALIDO",
          message: "El motivo del rechazo debe ser más descriptivo.",
        });
      }

      if (motivo.length > 500) {
        return res.status(400).json({
          code: "MOTIVO_INVALIDO",
          message: "El motivo del rechazo no puede superar los 500 caracteres.",
        });
      }

      // =========================
      // TRANSACCIÓN DE RECHAZO
      // =========================

      await sequelize.transaction(async (transaction) => {
        // Volvemos a leerla bloqueando la fila
        const inscripcionBloqueada = await Inscripcion.findByPk(id, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        if (!inscripcionBloqueada) {
          const error = new Error("Inscripción no encontrada.");
          error.code = "INSCRIPCION_NO_ENCONTRADA";
          throw error;
        }

        // Evita dos administradores
        // resolviendo simultáneamente

        if (inscripcionBloqueada.estado !== "pendiente") {
          const error = new Error("La inscripción ya fue resuelta.");
          error.code = "INSCRIPCION_YA_RESUELTA";
          throw error;
        }

        // RECHAZAR

        await inscripcionBloqueada.update(
          {
            estado: "rechazado",
            motivo_rechazo: motivo,
          },
          {
            transaction,
          },
        );
      });

      return res.json({
        message: "Inscripción rechazada correctamente.",
        inscripcion: {
          id: inscripcion.id,
          estado: "rechazado",
          motivo_rechazo: motivo,
        },
      });
    }

    // =====================================================
    // CONFIRMAR
    // =====================================================

    // =====================================================
    // BUSCAR COMPETENCIA
    // =====================================================

    const torneoCategoria = await TorneoCategoria.findByPk(
      inscripcion.torneo_categoria_id,
    );

    if (!torneoCategoria) {
      return res.status(404).json({
        message: "Torneo-categoría no encontrado.",
      });
    }

    // =====================================================
    // IMPEDIR CONFIRMACIÓN SI YA EXISTE FIXTURE
    // =====================================================

    const partidosExistentes = await Partido.count({
      where: {
        torneo_categoria_id: inscripcion.torneo_categoria_id,
      },
    });

    if (torneoCategoria.fixture_generado || partidosExistentes > 0) {
      return res.status(409).json({
        code: "FIXTURE_YA_GENERADO",
        message:
          "No es posible confirmar esta inscripción porque el fixture de la competencia ya fue generado.",
      });
    }

    // =====================================================
    // REVALIDAR PLANTEL
    // =====================================================

    const validacion = await validarPlantelInscripcion(
      inscripcion.equipo_id,
      inscripcion.torneo_categoria_id,
      inscripcion.id,
    );

    if (!validacion.valido) {
      return res.status(400).json({
        code: validacion.code,
        message: `No es posible confirmar la inscripción. ${validacion.message}`,
        requisitos: validacion.requisitos,
        jugadores: validacion.jugadores,
      });
    }

    // =====================================================
    // TRANSACCIÓN
    // =====================================================
    //
    // Bloqueamos:
    //
    // 1. La inscripción
    // 2. La competencia
    //
    // Y volvemos a verificar que el fixture no haya
    // sido generado mientras se procesaba la solicitud.
    // =====================================================

    await sequelize.transaction(async (transaction) => {
      // =================================================
      // BLOQUEAR INSCRIPCIÓN
      // =================================================

      const inscripcionBloqueada = await Inscripcion.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!inscripcionBloqueada) {
        const error = new Error("Inscripción no encontrada.");
        error.code = "INSCRIPCION_NO_ENCONTRADA";
        throw error;
      }

      if (inscripcionBloqueada.estado !== "pendiente") {
        const error = new Error("La inscripción ya fue resuelta.");
        error.code = "INSCRIPCION_YA_RESUELTA";
        throw error;
      }

      // =================================================
      // BLOQUEAR COMPETENCIA
      // =================================================

      const competenciaBloqueada = await TorneoCategoria.findByPk(
        inscripcionBloqueada.torneo_categoria_id,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        },
      );

      if (!competenciaBloqueada) {
        const error = new Error("Torneo-categoría no encontrado.");
        error.code = "COMPETENCIA_NO_ENCONTRADA";
        throw error;
      }

      // =================================================
      // VOLVER A COMPROBAR FIXTURE
      // =================================================

      const cantidadPartidos = await Partido.count({
        where: {
          torneo_categoria_id: competenciaBloqueada.id,
        },
        transaction,
      });

      if (competenciaBloqueada.fixture_generado || cantidadPartidos > 0) {
        const error = new Error(
          "No es posible confirmar esta inscripción porque el fixture de la competencia ya fue generado.",
        );
        error.code = "FIXTURE_YA_GENERADO";
        throw error;
      }

      // =================================================
      // CREAR SNAPSHOT HISTÓRICO
      // =================================================

      await crearSnapshotPlantel(
        inscripcionBloqueada.id,
        inscripcionBloqueada.equipo_id,
        transaction,
      );

      // =================================================
      // CONFIRMAR
      // =================================================

      await inscripcionBloqueada.update(
        {
          estado: "confirmado",
          motivo_rechazo: null,
        },
        {
          transaction,
        },
      );
    });

    // =====================================================
    // RESPUESTA
    // =====================================================

    return res.json({
      message: "Inscripción confirmada correctamente.",
    });
  } catch (error) {
    // =====================================================
    // INSCRIPCIÓN YA RESUELTA
    // =====================================================

    if (error.code === "INSCRIPCION_YA_RESUELTA") {
      return res.status(400).json({
        code: error.code,
        message: error.message,
      });
    }

    // =====================================================
    // FIXTURE YA GENERADO
    // =====================================================

    if (error.code === "FIXTURE_YA_GENERADO") {
      return res.status(409).json({
        code: error.code,
        message: error.message,
      });
    }

    // =====================================================
    // INSCRIPCIÓN NO ENCONTRADA
    // =====================================================

    if (error.code === "INSCRIPCION_NO_ENCONTRADA") {
      return res.status(404).json({
        code: error.code,
        message: error.message,
      });
    }

    // =====================================================
    // COMPETENCIA NO ENCONTRADA
    // =====================================================

    if (error.code === "COMPETENCIA_NO_ENCONTRADA") {
      return res.status(404).json({
        code: error.code,
        message: error.message,
      });
    }

    next(error);
  }
};

export const obtenerPartidosPorTorneoCategoria = async (req, res, next) => {
  try {
    const { torneoCategoriaId } = req.params;

    const partidos = await Partido.findAll({
      where: {
        torneo_categoria_id: torneoCategoriaId,
      },
      include: [
        {
          model: Inscripcion,
          as: "local",
          include: [Equipo],
        },
        {
          model: Inscripcion,
          as: "visitante",
          include: [Equipo],
        },
        {
          model: Sede,
        },
        {
          model: Arbitro,
        },
      ],
      order: [["fecha", "ASC"]],
    });

    res.json(partidos);
  } catch (error) {
    next(error);
  }
};

export const actualizarPartido = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      fecha,
      sede_id,
      arbitro_id,
      puntaje_local,
      puntaje_visitante,
      estado,
    } = req.body;

    const partido = await Partido.findByPk(id);

    if (!partido) {
      return res.status(404).json({
        message: "Partido no encontrado",
      });
    }

    await partido.update({
      fecha,
      sede_id,
      arbitro_id,
      puntaje_local,
      puntaje_visitante,
      estado,
    });

    res.json({
      message: "Partido actualizado",
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerPlantelInscripcion = async (req, res, next) => {
  try {
    const { id } = req.params;

    // =========================
    // BUSCAR INSCRIPCIÓN
    // =========================

    const inscripcion = await Inscripcion.findByPk(id, {
      attributes: ["id", "fecha", "estado"],

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
    });

    // =========================
    // INSCRIPCIÓN NO ENCONTRADA
    // =========================

    if (!inscripcion) {
      return res.status(404).json({
        message: "Inscripción no encontrada.",
      });
    }

    // =========================
    // SOLO CONFIRMADAS
    // =========================

    if (inscripcion.estado !== "confirmado") {
      return res.status(400).json({
        code: "PLANTEL_HISTORICO_NO_DISPONIBLE",

        message:
          "El plantel histórico solamente está disponible para inscripciones confirmadas.",
      });
    }

    // =========================
    // CONVERTIR
    // =========================

    const datos = inscripcion.toJSON();

    // =========================
    // ORDENAR POR DORSAL
    // =========================

    datos.jugadores = (datos.jugadores || []).sort(
      (a, b) => Number(a.dorsal) - Number(b.dorsal),
    );

    // =========================
    // SNAPSHOT INEXISTENTE
    // =========================

    if (datos.jugadores.length === 0) {
      return res.status(404).json({
        code: "SNAPSHOT_NO_ENCONTRADO",

        message: "No se encontró el plantel histórico de esta inscripción.",
      });
    }

    // =========================
    // RESPUESTA
    // =========================

    return res.json({
      inscripcion: datos,
    });
  } catch (error) {
    next(error);
  }
};
