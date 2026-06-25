import { TorneoCategoria, Partido } from '../models/index.js';
import { calcularTablaPosiciones } from './tabla.service.js';

export const generarPlayoffs = async (torneoCategoriaId) => {
    const torneoCategoria = await TorneoCategoria.findByPk(torneoCategoriaId);

    if (!torneoCategoria) {
        throw new Error('Torneo categoría inexistente');
    }

    // Verificar que terminó la fase regular
    const pendientes = await Partido.count({
        where: {
            torneo_categoria_id: torneoCategoriaId,
            fase: 'regular',
            estado: 'pendiente'
        }
    });

    if (pendientes > 0) {
        throw new Error('Todavía existen partidos pendientes');
    }

    // Evitar generar playoffs dos veces
    const existentes = await Partido.count({
        where: {
            torneo_categoria_id: torneoCategoriaId,
            fase: [
                'cuartos',
                'semifinal',
                'final'
            ]
        }
    });

    if (existentes > 0) {
        throw new Error('Los playoffs ya fueron generados');
    }

    const tabla = await calcularTablaPosiciones(torneoCategoriaId);

    const partidos = [];

    // TOP 4
    if (torneoCategoria.formato_competencia === 'playoff_4') {
        if (tabla.length < 4) {
            throw new Error('Se requieren al menos 4 equipos');
        }

        partidos.push({
            torneo_categoria_id: torneoCategoriaId,
            inscripcion_local_id: tabla[0].inscripcion_id,
            inscripcion_visitante_id: tabla[3].inscripcion_id,
            jornada: 1,
            fecha: new Date(),
            estado: 'pendiente',
            fase: 'semifinal'
        });

        partidos.push({
            torneo_categoria_id: torneoCategoriaId,
            inscripcion_local_id: tabla[1].inscripcion_id,
            inscripcion_visitante_id: tabla[2].inscripcion_id,
            jornada: 1,
            fecha: new Date(),
            estado: 'pendiente',
            fase: 'semifinal'
        });
    }

    // TOP 8
    else if (torneoCategoria.formato_competencia === 'playoff_8') {
        if (tabla.length < 8) {
            throw new Error('Se requieren al menos 8 equipos');
        }

        partidos.push({
            torneo_categoria_id: torneoCategoriaId,
            inscripcion_local_id: tabla[0].inscripcion_id,
            inscripcion_visitante_id: tabla[7].inscripcion_id,
            jornada: 1,
            fecha: new Date(),
            estado: 'pendiente',
            fase: 'cuartos'
        });

        partidos.push({
            torneo_categoria_id: torneoCategoriaId,
            inscripcion_local_id: tabla[1].inscripcion_id,
            inscripcion_visitante_id: tabla[6].inscripcion_id,
            jornada: 1,
            fecha: new Date(),
            estado: 'pendiente',
            fase: 'cuartos'
        });

        partidos.push({
            torneo_categoria_id: torneoCategoriaId,
            inscripcion_local_id: tabla[2].inscripcion_id,
            inscripcion_visitante_id: tabla[5].inscripcion_id,
            jornada: 1,
            fecha: new Date(),
            estado: 'pendiente',
            fase: 'cuartos'
        });

        partidos.push({
            torneo_categoria_id: torneoCategoriaId,
            inscripcion_local_id: tabla[3].inscripcion_id,
            inscripcion_visitante_id: tabla[4].inscripcion_id,
            jornada: 1,
            fecha: new Date(),
            estado: 'pendiente',
            fase: 'cuartos'
        });
    }

    else {
        throw new Error('Este torneo no utiliza playoffs');
    }

    await Partido.bulkCreate(partidos);

    return {
        message: 'Playoffs generados correctamente'
    };
};

const generarSemifinales = async (torneoCategoriaId) => {

    const cuartos =
        await Partido.findAll({
            where: {
                torneo_categoria_id:
                    torneoCategoriaId,
                fase: 'cuartos'
            }
        });

    if (cuartos.length !== 4) return;

    const todosJugados =
        cuartos.every(
            partido =>
                partido.estado === 'jugado'
        );

    if (!todosJugados) return;

    const existen =
        await Partido.count({
            where: {
                torneo_categoria_id:
                    torneoCategoriaId,
                fase: 'semifinal'
            }
        });

    if (existen > 0) return;

    const ganador = (partido) =>
        partido.puntaje_local >
            partido.puntaje_visitante
            ? partido.inscripcion_local_id
            : partido.inscripcion_visitante_id;

    await Partido.bulkCreate([

        {
            torneo_categoria_id:
                torneoCategoriaId,
            inscripcion_local_id:
                ganador(cuartos[0]),
            inscripcion_visitante_id:
                ganador(cuartos[1]),
            jornada: 1,
            fase: 'semifinal',
            fecha: new Date(),
            estado: 'pendiente'
        },

        {
            torneo_categoria_id:
                torneoCategoriaId,
            inscripcion_local_id:
                ganador(cuartos[2]),
            inscripcion_visitante_id:
                ganador(cuartos[3]),
            jornada: 1,
            fase: 'semifinal',
            fecha: new Date(),
            estado: 'pendiente'
        }

    ]);
};

const generarFinal = async (
    torneoCategoriaId
) => {

    const semifinales =
        await Partido.findAll({
            where: {
                torneo_categoria_id:
                    torneoCategoriaId,
                fase: 'semifinal'
            }
        });

    if (semifinales.length !== 2) return;

    const todasJugadas =
        semifinales.every(
            partido =>
                partido.estado === 'jugado'
        );

    if (!todasJugadas) return;

    const existeFinal =
        await Partido.count({
            where: {
                torneo_categoria_id:
                    torneoCategoriaId,
                fase: 'final'
            }
        });

    if (existeFinal > 0) return;

    const ganador = (partido) =>
        partido.puntaje_local >
            partido.puntaje_visitante
            ? partido.inscripcion_local_id
            : partido.inscripcion_visitante_id;

    await Partido.create({

        torneo_categoria_id:
            torneoCategoriaId,

        inscripcion_local_id:
            ganador(semifinales[0]),

        inscripcion_visitante_id:
            ganador(semifinales[1]),

        jornada: 1,

        fase: 'final',

        fecha: new Date(),

        estado: 'pendiente'
    });
};

export const avanzarPlayoffsAutomaticamente = async (torneoCategoriaId) => {

    const torneoCategoria = await TorneoCategoria.findByPk(torneoCategoriaId);

    if (!torneoCategoria) return;

    const formato = torneoCategoria.formato_competencia;

    // PLAYOFF 8
    if (formato === 'playoff_8') {
        await generarSemifinales(torneoCategoriaId);
        await generarFinal(torneoCategoriaId);
    }

    // PLAYOFF 4
    if (formato === 'playoff_4') {
        await generarFinal(torneoCategoriaId);
    }
};

export const obtenerCampeon = async (torneoCategoriaId) => {
    const final = await Partido.findOne({
        where: {
            torneo_categoria_id: torneoCategoriaId,
            fase: 'final',
            estado: 'jugado'
        }
    });

    if (!final) return null;

    return final.puntaje_local > final.puntaje_visitante ? final.inscripcion_local_id : final.inscripcion_visitante_id;
};