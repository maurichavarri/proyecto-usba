import Inscripcion from "../models/inscripcion.model.js";

export const plantelBloqueado = async (equipoId) => {
    const inscripcion = await Inscripcion.findOne({
        where: {
            equipo_id: equipoId
        }
    });

    return !!inscripcion;
};