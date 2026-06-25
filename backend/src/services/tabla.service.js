import { Partido, Inscripcion, Equipo } from '../models/index.js';

export const calcularTablaPosiciones = async (torneoCategoriaId) => {

    const tabla = {};

    // Inscripciones
    const inscripciones = await Inscripcion.findAll({
        where: {
            torneo_categoria_id: torneoCategoriaId,
            estado: 'confirmado'
        },
        include: [
            {
                model: Equipo
            }
        ]
    });

    inscripciones.forEach((inscripcion) => {
        tabla[inscripcion.Equipo.id] = {
            equipo_id: inscripcion.Equipo.id,

            // NUEVO
            inscripcion_id: inscripcion.id,

            nombre: inscripcion.Equipo.nombre,

            pj: 0,
            pg: 0,
            pe: 0,
            pp: 0,

            gf: 0,
            gc: 0,

            dg: 0,
            pts: 0
        };
    });

    // Partidos jugados
    const partidos = await Partido.findAll({
        where: {
            torneo_categoria_id: torneoCategoriaId,
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

    partidos.forEach((partido) => {

        const local = partido.local;
        const visitante = partido.visitante;
        const localTabla = tabla[local.Equipo.id];
        const visitanteTabla = tabla[visitante.Equipo.id];
        const golesLocal = partido.puntaje_local;
        const golesVisitante = partido.puntaje_visitante;

        localTabla.pj++;
        visitanteTabla.pj++;

        localTabla.gf += golesLocal;
        localTabla.gc += golesVisitante;

        visitanteTabla.gf += golesVisitante;
        visitanteTabla.gc += golesLocal;

        if (golesLocal > golesVisitante) {

            localTabla.pg++;
            localTabla.pts += 3;

            visitanteTabla.pp++;

        } else if (golesLocal < golesVisitante) {

            visitanteTabla.pg++;
            visitanteTabla.pts += 3;

            localTabla.pp++;

        } else {

            localTabla.pe++;
            visitanteTabla.pe++;

            localTabla.pts++;
            visitanteTabla.pts++;
        }

    });

    Object.values(tabla).forEach((equipo) => {
        equipo.dg = equipo.gf - equipo.gc;
    });

    return Object
        .values(tabla)
        .sort((a, b) => {

            if (b.pts !== a.pts)
                return b.pts - a.pts;

            if (b.dg !== a.dg)
                return b.dg - a.dg;

            return b.gf - a.gf;
        });
};