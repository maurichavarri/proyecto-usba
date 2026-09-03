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

    // =========================
    // ESTADO VÁLIDO
    // =========================

    if (estado !== "confirmado" && estado !== "rechazado") {
      return res.status(400).json({
        message: "Estado inválido.",
      });
    }

    // =========================
    // BUSCAR INSCRIPCIÓN
    // =========================

    const inscripcion = await Inscripcion.findByPk(id);

    if (!inscripcion) {
      return res.status(404).json({
        message: "Inscripción no encontrada.",
      });
    }

    // =========================
    // SOLO SE RESUELVEN
    // INSCRIPCIONES PENDIENTES
    // =========================

    if (inscripcion.estado !== "pendiente") {
      return res.status(400).json({
        code: "INSCRIPCION_YA_RESUELTA",
        message: `La inscripción ya fue ${inscripcion.estado}.`,
      });
    }

    // =====================================================
    // RECHAZAR
    // =====================================================

    if (estado === "rechazado") {
      // -------------------------
      // MOTIVO OBLIGATORIO
      // -------------------------

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

      // -------------------------
      // ACTUALIZAR
      // -------------------------

      await inscripcion.update({
        estado: "rechazado",
        motivo_rechazo: motivo,
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

    // =========================
    // TORNEO / FECHA CIERRE
    // =========================

    const torneoCategoria = await TorneoCategoria.findByPk(
      inscripcion.torneo_categoria_id,
      {
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
      return res.status(404).json({
        message: "Torneo-categoría no encontrado.",
      });
    }

    const hoy = obtenerFechaActualArgentina();
    const fechaCierre = torneoCategoria.torneo.fecha_cierre_inscripcion;

    if (hoy > fechaCierre) {
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
      return res.status(400).json({
        code: validacion.code,
        message: `No es posible confirmar la inscripción. ${validacion.message}`,
        requisitos: validacion.requisitos,
        jugadores: validacion.jugadores,
      });
    }

    // =========================
    // TRANSACCIÓN:
    // SNAPSHOT + CONFIRMACIÓN
    // =========================

    await sequelize.transaction(async (transaction) => {
      // -------------------------
      // VOLVER A LEER Y BLOQUEAR
      // INSCRIPCIÓN
      // -------------------------

      const inscripcionBloqueada = await Inscripcion.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!inscripcionBloqueada) {
        throw new Error("Inscripción no encontrada.");
      }

      // Evita doble click o dos
      // administradores resolviendo
      // al mismo tiempo
      if (inscripcionBloqueada.estado !== "pendiente") {
        const error = new Error("La inscripción ya fue resuelta.");
        error.code = "INSCRIPCION_YA_RESUELTA";
        throw error;
      }

      // -------------------------
      // CREAR SNAPSHOT HISTÓRICO
      // -------------------------

      await crearSnapshotPlantel(
        inscripcionBloqueada.id,
        inscripcionBloqueada.equipo_id,
        transaction,
      );

      // -------------------------
      // CONFIRMAR
      // -------------------------

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

    // =========================
    // RESPUESTA
    // =========================

    res.json({
      message: "Inscripción confirmada correctamente.",
    });
  } catch (error) {
    if (error.code === "INSCRIPCION_YA_RESUELTA") {
      return res.status(400).json({
        code: error.code,
        message: error.message,
      });
    }

    next(error);
  }
};

export const generarFixture = async (req, res, next) => {
  try {
    const { torneoCategoriaId } = req.params;

    // Obtener inscripciones confirmadas
    const inscripciones = await Inscripcion.findAll({
      where: {
        torneo_categoria_id: torneoCategoriaId,
        estado: "confirmado",
      },
    });

    // Validar cantidad
    if (inscripciones.length < 2) {
      return res.status(400).json({
        message: "Se necesitan mínimo 2 equipos",
      });
    }

    // Evitar generar duplicados
    const partidosExistentes = await Partido.count({
      where: {
        torneo_categoria_id: torneoCategoriaId,
      },
    });

    if (partidosExistentes > 0) {
      return res.status(400).json({
        message: "El fixture ya fue generado",
      });
    }

    const partidos = [];

    // Generar ida/vuelta
    for (let i = 0; i < inscripciones.length; i++) {
      for (let j = i + 1; j < inscripciones.length; j++) {
        const local = inscripciones[i];

        const visitante = inscripciones[j];

        // Ida
        partidos.push({
          torneo_categoria_id: torneoCategoriaId,

          inscripcion_local_id: local.id,

          inscripcion_visitante_id: visitante.id,

          estado: "pendiente",
        });

        // Vuelta
        partidos.push({
          torneo_categoria_id: torneoCategoriaId,

          inscripcion_local_id: visitante.id,

          inscripcion_visitante_id: local.id,

          estado: "pendiente",
        });
      }
    }

    // Insert masivo
    await Partido.bulkCreate(partidos);

    res.json({
      message: "Fixture generado correctamente",
      partidos_generados: partidos.length,
    });
  } catch (error) {
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