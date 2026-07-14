import { Inscripcion, Partido, TorneoCategoria, Torneo } from "../models/index.js";

export const generarFixture = async (torneoCategoriaId) => {

    // Verificar que exista la relación
    const torneoCategoria = await TorneoCategoria.findByPk(
        torneoCategoriaId,
        {
            include: [
                {
                    model: Torneo,
                    as: "torneo"
                }
            ]
        }
    );

    if (!torneoCategoria) {
        throw new Error(
            'La categoría del torneo no existe'
        );
    }

    // NUEVA VALIDACIÓN
    const hoy = new Date();

    const fechaCierre = new Date(torneoCategoria.torneo.fecha_cierre_inscripcion);

    if (hoy <= fechaCierre) {
        throw new Error("Todavía no finalizó el período de inscripción.");
    }

    // Verificar si ya fue generado
    if (torneoCategoria.fixture_generado) {
        throw new Error(
            'El fixture ya fue generado'
        );
    }

    // Seguridad extra:
    // verificar si existen partidos
    const yaExiste = await Partido.count({
        where: {
            torneo_categoria_id: torneoCategoriaId
        }
    });

    if (yaExiste > 0) {
        throw new Error(
            'Ya existen partidos para este torneo'
        );
    }

    // Obtener inscripciones confirmadas
    const inscripciones = await Inscripcion.findAll({
        where: {
            torneo_categoria_id: torneoCategoriaId,
            estado: 'confirmado'
        }
    });

    let equipos = inscripciones.map(i => i.id);

    // Mínimo de equipos
    if (equipos.length < 4) {
        throw new Error(
            'Se necesitan al menos 4 equipos confirmados para generar el fixture'
        );
    }

    // Si es impar agregamos BYE
    if (equipos.length % 2 !== 0) {
        equipos.push(null);
    }

    const n = equipos.length;
    const rondas = n - 1;
    const mitad = n / 2;

    const partidos = [];

    // Algoritmo Round Robin
    for (let jornada = 0; jornada < rondas; jornada++) {
        for (let i = 0; i < mitad; i++) {
            const local = equipos[i];
            const visitante = equipos[n - 1 - i];

            // Ignorar BYE
            if (local && visitante) {
                const esPar = jornada % 2 === 0;
                partidos.push({
                    torneo_categoria_id: torneoCategoriaId,
                    inscripcion_local_id: esPar ? local : visitante,
                    inscripcion_visitante_id: esPar ? visitante : local,
                    jornada: jornada + 1,
                    fecha: new Date(),
                    estado: 'pendiente',
                    fase: 'regular'
                });
            }
        }

        // Rotación Round Robin
        const ultimo = equipos.pop();
        equipos.splice(1, 0, ultimo);
    }

    // Generar partidos de vuelta

    const partidosVuelta = partidos.map(partido => ({
        torneo_categoria_id: partido.torneo_categoria_id,
        inscripcion_local_id: partido.inscripcion_visitante_id,
        inscripcion_visitante_id: partido.inscripcion_local_id,
        jornada: partido.jornada + rondas,
        fecha: partido.fecha,
        estado: "pendiente",
        fase: partido.fase
    }));

    partidos.push(...partidosVuelta);

    // Crear partidos
    const partidosCreados = await Partido.bulkCreate(partidos);

    // Marcar fixture generado y campeonato en curso
    await torneoCategoria.update(
        {
            fixture_generado: true,
            estado_competencia: 'en_curso'
        },
        {
            where: {
                id: torneoCategoriaId
            }
        }
    );

    return partidosCreados;
};