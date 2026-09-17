import { Op } from "sequelize";
import { Inscripcion, TorneoCategoria } from "../models/index.js";

export const plantelBloqueado = async (equipoId) => {
  const inscripcionBloqueante = await Inscripcion.findOne({
    where: {
      equipo_id: equipoId,
      estado: {
        [Op.in]: ["pendiente", "confirmado"],
      },
    },

    include: [
      {
        model: TorneoCategoria,
        as: "torneoCategoria",
        required: true,
        where: {
          [Op.or]: [
            {
              estado_competencia: {
                [Op.in]: ["configuracion", "en_curso"],
              },
            },

            // Por seguridad, si existe un
            // registro viejo sin estado,
            // también consideramos bloqueado.
            {
              estado_competencia: null,
            },
          ],
        },
      },
    ],
  });

  return Boolean(inscripcionBloqueante);
};