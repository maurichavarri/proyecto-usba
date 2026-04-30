import { Inscripcion, Partido } from '../models/index.js';

export const generarFixture = async (torneoCategoriaId) => {

    // Verificamos si el fixture ya fue generado
    const yaExiste = await Partido.count({
        where: { torneo_categoria_id: torneoCategoriaId }
    });

    if (yaExiste > 0) {
        throw new Error('El fixture ya fue generado');
    }

    // 1. Obtener equipos confirmados
    const inscripciones = await Inscripcion.findAll({
        where: {
            torneo_categoria_id: torneoCategoriaId,
            estado: 'confirmado'
        }
    });

    let equipos = inscripciones.map(i => i.id);

    if (equipos.length < 2) {
        throw new Error('No hay suficientes equipos');
    }

    // 2. Si es impar → BYE
    if (equipos.length % 2 !== 0) {
        equipos.push(null);
    }

    const n = equipos.length;
    const rondas = n - 1;
    const mitad = n / 2;

    let partidos = [];

    for (let r = 0; r < rondas; r++) {

        for (let i = 0; i < mitad; i++) {
            const local = equipos[i];
            const visitante = equipos[n - 1 - i];

            if (local && visitante) {
                partidos.push({
                    torneo_categoria_id: torneoCategoriaId,
                    inscripcion_local_id: local,
                    inscripcion_visitante_id: visitante,
                    estado: 'pendiente'
                });
            }
        }

        // rotación
        const ultimo = equipos.pop();
        equipos.splice(1, 0, ultimo);
    }

    // 3. Crear en DB
    await Partido.bulkCreate(partidos);
};