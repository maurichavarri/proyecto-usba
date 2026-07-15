import { Inscripcion } from "../models/index.js";

export const plantelBloqueado = async (equipoId) => {

    const inscripcion = await Inscripcion.findOne({
        where: {
            equipo_id: equipoId,
            estado: "confirmado"
        }
    });

    return !!inscripcion;
};