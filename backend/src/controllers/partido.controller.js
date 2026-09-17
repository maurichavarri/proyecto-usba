import {
  Partido,
  Equipo,
  Inscripcion,
  Sede,
  Arbitro,
  TorneoCategoria,
  Torneo,
  Categoria,
} from "../models/index.js";
import { avanzarPlayoffsAutomaticamente } from "../services/playoff.service.js";
import { procesarSancionesPorPartido } from "../services/procesarSanciones.service.js";

export const getPartidoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const partido = await Partido.findByPk(id, {
      include: [
        {
          model: Inscripcion,
          as: "local",
          include: [
            {
              model: Equipo,
            },
          ],
        },
        {
          model: Inscripcion,
          as: "visitante",
          include: [
            {
              model: Equipo,
            },
          ],
        },
        {
          model: Sede,
          as: "sede",
        },
        {
          model: Arbitro,
          as: "arbitro",
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
    });

    if (!partido) {
      return res.status(404).json({
        message: "Partido no encontrado.",
      });
    }

    return res.json(partido);
  } catch (error) {
    next(error);
  }
};

export const updatePartido = async (req, res, next) => {
  try {
    const partido = await Partido.findByPk(req.params.id);

    if (!partido) {
      return res.status(404).json({
        message: "Partido no encontrado",
      });
    }

    // Partido cerrado
    if (partido.estado === "jugado") {
      return res.status(400).json({
        message: "El partido ya fue finalizado y no puede modificarse.",
      });
    }

    const {
      fecha,
      sede_id,
      arbitro_id,
      estado,
      puntaje_local,
      puntaje_visitante,
    } = req.body;

    const estadoAnterior = partido.estado;

    await partido.update({
      fecha,
      sede_id,
      arbitro_id,
      estado,
      puntaje_local,
      puntaje_visitante,
    });

    if (estadoAnterior !== "jugado" && estado === "jugado") {
      await procesarSancionesPorPartido(partido.id);
      await avanzarPlayoffsAutomaticamente(partido.torneo_categoria_id);
    }

    res.json({
      message: "Partido actualizado correctamente",
      partido,
    });
  } catch (error) {
    next(error);
  }
};
