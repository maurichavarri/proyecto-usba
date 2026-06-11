import { Inscripcion, Partido } from '../models/index.js';

export const generarFixture = async (torneoCategoriaId) => {

    // Verificar si ya existe
    const yaExiste = await Partido.count({
        where: {
            torneo_categoria_id: torneoCategoriaId
        }
    });

    if (yaExiste > 0) {
        throw new Error('El fixture ya fue generado');
    }

    // Obtener inscripciones confirmadas
    const inscripciones = await Inscripcion.findAll({
        where: {
            torneo_categoria_id: torneoCategoriaId,
            estado: 'confirmado'
        }
    });

    let equipos = inscripciones.map(i => i.id);

    // Validación mínima
    if (equipos.length < 2) {
        throw new Error('No hay suficientes equipos');
    }

    // BYE
    if (equipos.length % 2 !== 0) {
        equipos.push(null);
    }

    const n = equipos.length;
    const rondas = n - 1;
    const mitad = n / 2;
    let partidos = [];

    // Round Robin
    for (let jornada = 0; jornada < rondas; jornada++) {
        for (let i = 0; i < mitad; i++) {
            const local = equipos[i];
            const visitante = equipos[n - 1 - i];

            // BYE
            if (local && visitante) {
                const esPar = jornada % 2 === 0;
                partidos.push({
                    torneo_categoria_id: torneoCategoriaId,
                    inscripcion_local_id: esPar? local : visitante,
                    inscripcion_visitante_id: esPar? visitante : local,
                    jornada: jornada + 1,
                    fecha: new Date(),
                    estado: 'pendiente'
                });
            }
        }

        // Rotación
        const ultimo = equipos.pop();
        equipos.splice(1,0,ultimo);
    }

    // Crear partidos
    const partidosCreados = await Partido.bulkCreate(partidos);

    return partidosCreados;
};