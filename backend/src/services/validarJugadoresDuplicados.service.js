import { Op } from "sequelize";
import { Equipo, Inscripcion, Jugador } from "../models/index.js";

export const validarJugadoresDuplicados = async (equipoId, torneoCategoriaId, inscripcionExcluir = null) => {

    // Jugadores activos del equipo que se quiere inscribir
    const jugadoresEquipo = await Jugador.findAll({
        where: {
            equipo_id: equipoId,
            estado: "activo"
        }
    });

    if (jugadoresEquipo.length === 0) {
        return {
            valido: true,
            jugadores: []
        };
    }

    const dnis = jugadoresEquipo.map(j => j.dni);

    // Buscar equipos YA CONFIRMADOS
    const whereInscripcion = {
        torneo_categoria_id: torneoCategoriaId,
        estado: "confirmado"
    };

    if (inscripcionExcluir) {
        whereInscripcion.id = {
            [Op.ne]: inscripcionExcluir
        };
    }

    const inscripciones = await Inscripcion.findAll({
        where: whereInscripcion
    });

    if (inscripciones.length === 0) {
        return {
            valido: true,
            jugadores: []
        };
    }

    const conflictos = [];

    for (const inscripcion of inscripciones) {
        const jugadores = await Jugador.findAll({
            where: {
                equipo_id: inscripcion.equipo_id,
                estado: "activo"
            },
            include: [
                {
                    model: Equipo,
                    as: "equipo",
                    attributes: ["nombre"]
                }
            ]
        });

        jugadores.forEach(jugador => {
            if (dnis.includes(jugador.dni)) {
                conflictos.push({
                    nombre: `${jugador.nombre} ${jugador.apellido}`,
                    dorsal: jugador.dorsal,
                    equipo: jugador.equipo.nombre
                });
            }
        });
    }

    return {
        valido: conflictos.length === 0,
        jugadores: conflictos
    };
};