import { Partido, Inscripcion, Jugador, Sancion } from '../models/index.js';

export const procesarSancionesPorPartido = async (partidoId) => {

    const partidoActual = await Partido.findByPk(partidoId);

    if (!partidoActual) {
        throw new Error('Partido no encontrado');
    }

    if (partidoActual.estado !== 'jugado') {
        return;
    }

    const inscripcionLocal = await Inscripcion.findByPk(partidoActual.inscripcion_local_id);
    const inscripcionVisitante = await Inscripcion.findByPk(partidoActual.inscripcion_visitante_id);

    if (!inscripcionLocal || !inscripcionVisitante) {
        return;
    }

    const equiposPartido = [
        inscripcionLocal.equipo_id,
        inscripcionVisitante.equipo_id
    ];

    const jugadores = await Jugador.findAll({
        where: {
            equipo_id: equiposPartido
        }
    });

    const ordenFases = {
        regular: 1,
        cuartos: 2,
        semifinal: 3,
        final: 4
    };

    for (const jugador of jugadores) {
        const sancionesActivas = await Sancion.findAll({
            where: {
                jugador_id: jugador.id,
                estado: 'activa'
            }
        });

        for (const jugador of jugadores) {
            const sancionesActivas = await Sancion.findAll({
                where: {
                    jugador_id: jugador.id,
                    estado: 'activa'
                }
            });

            for (const sancion of sancionesActivas) {
                if (sancion.partido_id === partidoActual.id) {
                    continue;
                }

                const partidoSancion = await Partido.findByPk(
                    sancion.partido_id
                );

                if (!partidoSancion) {
                    continue;
                }

                const faseActual = ordenFases[partidoActual.fase];
                const faseSancion = ordenFases[partidoSancion.fase];

                let esPosterior = false;

                if (faseActual > faseSancion) {
                    esPosterior = true;
                } else if (faseActual === faseSancion) {
                    esPosterior = partidoActual.jornada > partidoSancion.jornada;
                }

                if (!esPosterior) {
                    continue;
                }

                const nuevasFechasCumplidas = sancion.fechas_cumplidas + 1;

                if (nuevasFechasCumplidas >= sancion.fechas_suspension) {
                    await sancion.update({
                        fechas_cumplidas: sancion.fechas_suspension,
                        estado: 'cumplida'
                    });
                } else {
                    await sancion.update({
                        fechas_cumplidas: nuevasFechasCumplidas
                    });
                }
            }

            // Revisar el estado GENERAL del jugador
            const sancionesPendientes = await Sancion.count({
                where: {
                    jugador_id: jugador.id,
                    estado: 'activa'
                }
            });

            if (sancionesPendientes === 0) {
                await jugador.update({
                    estado: 'activo'
                });
            } else {
                await jugador.update({
                    estado: 'inactivo'
                });
            }
        }
    }
};