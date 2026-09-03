import { Op } from "sequelize";
import Inscripcion from "../models/inscripcion.model.js";
import TorneoCategoria from "../models/torneoCategoria.model.js";

export const plantelBloqueado = async (equipoId) => {
  // =========================
  // INSCRIPCIONES QUE
  // COMPROMETEN AL PLANTEL
  // =========================

  const inscripciones = await Inscripcion.findAll({
    where: {
      equipo_id: equipoId,
      estado: {
        [Op.in]: ["pendiente", "confirmado"],
      },
    },
    attributes: ["torneo_categoria_id"],
  });

  // Si no hay inscripciones pendientes
  // ni confirmadas, el plantel es editable
  if (inscripciones.length === 0) {
    return false;
  }

  // =========================
  // OBTENER COMPETENCIAS
  // =========================

  const torneoCategoriaIds = inscripciones.map(
    (inscripcion) => inscripcion.torneo_categoria_id,
  );

  // =========================
  // BUSCAR ALGUNA COMPETENCIA
  // TODAVÍA NO FINALIZADA
  // =========================

  const competenciaVigente = await TorneoCategoria.findOne({
    where: {
      id: {
        [Op.in]: torneoCategoriaIds,
      },
      [Op.or]: [
        {
          estado_competencia: {
            [Op.ne]: "finalizada",
          },
        },
        {
          estado_competencia: null,
        },
      ],
    },
  });

  // Si existe al menos una competencia
  // vigente, el plantel está bloqueado
  return !!competenciaVigente;
};