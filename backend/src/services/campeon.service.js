import { Partido, Equipo } from '../models/index.js';
import { calcularTablaPosiciones } from './tabla.service.js';

export const obtenerCampeonYSubcampeon = async (torneoCategoriaId, formatoCompetencia) => {

    // Si existe playoff
    if (formatoCompetencia === 'playoff_4' || formatoCompetencia === 'playoff_8') {

        const final = await Partido.findOne({

            where: {
                torneo_categoria_id: torneoCategoriaId,
                fase: 'final',
                estado: 'jugado'
            },
            include: [
                {
                    association: 'local',
                    include: [Equipo]
                },
                {
                    association: 'visitante',
                    include: [Equipo]
                }
            ]
        });

        if (!final) {
            return null;
        }

        let campeon;
        let subcampeon;

        if (final.puntaje_local > final.puntaje_visitante) {
            campeon = {
                equipo_id: final.local.Equipo.id,
                nombre: final.local.Equipo.nombre
            };
            subcampeon = {
                equipo_id: final.visitante.Equipo.id,
                nombre: final.visitante.Equipo.nombre
            };
        } else {
            campeon = {
                equipo_id: final.visitante.Equipo.id,
                nombre: final.visitante.Equipo.nombre
            };
            subcampeon = {
                equipo_id: final.local.Equipo.id,
                nombre: final.local.Equipo.nombre
            };
        }

        return {
            campeon,
            subcampeon
        };
    }

    // Liga simple
    const tabla = await calcularTablaPosiciones(torneoCategoriaId);

    if (tabla.length < 2) {
        return null;
    }

    return {
        campeon: tabla[0],
        subcampeon: tabla[1]
    };
};