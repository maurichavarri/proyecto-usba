import Inscripcion from '../models/inscripcion.model.js';
import Equipo from '../models/equipo.model.js';
import TorneoCategoria from '../models/torneoCategoria.model.js';
import Torneo from '../models/torneo.model.js';
import Categoria from '../models/categoria.model.js';
import Partido from '../models/partido.model.js';
import Sede from '../models/sede.model.js';
import Arbitro from '../models/arbitro.model.js';

export const obtenerInscripcionesAdmin = async (req, res, next) => {
    try {
        const inscripciones =
            await Inscripcion.findAll({
                include: [
                    {
                        model: Equipo
                    },
                    {
                        model: TorneoCategoria,
                        include: [
                            {
                                model: Torneo
                            },
                            {
                                model: Categoria
                            }
                        ]
                    }
                ]
            });

        res.json(inscripciones);

    } catch (error) {
        next(error);
    }
};

export const actualizarEstadoInscripcion = async (req, res, next) => {
    try {

        const { id } = req.params;
        const { estado } = req.body;

        // Validación
        if (
            estado !== 'confirmado' &&
            estado !== 'rechazado'
        ) {
            return res.status(400).json({
                message: 'Estado inválido'
            });
        }

        const inscripcion =
            await Inscripcion.findByPk(id);

        if (!inscripcion) {
            return res.status(404).json({
                message:
                    'Inscripción no encontrada'
            });
        }

        await inscripcion.update({
            estado
        });

        res.json({
            message:
                `Inscripción ${estado}`
        });

    } catch (error) {
        next(error);
    }
};

export const generarFixture = async (req, res, next) => {

    try {
        const { torneoCategoriaId } = req.params;

        // Obtener inscripciones confirmadas
        const inscripciones =
            await Inscripcion.findAll({
                where: {
                    torneo_categoria_id:
                        torneoCategoriaId,
                    estado: 'confirmado'
                }
            });

        // Validar cantidad
        if (inscripciones.length < 2) {
            return res.status(400).json({
                message:
                    'Se necesitan mínimo 2 equipos'
            });
        }

        // Evitar generar duplicados
        const partidosExistentes =
            await Partido.count({
                where: {
                    torneo_categoria_id:
                        torneoCategoriaId
                }
            });

        if (partidosExistentes > 0) {
            return res.status(400).json({
                message:
                    'El fixture ya fue generado'
            });
        }

        const partidos = [];

        // Generar ida/vuelta
        for (
            let i = 0;
            i < inscripciones.length;
            i++
        ) {
            for (
                let j = i + 1;
                j < inscripciones.length;
                j++
            ) {
                const local =
                    inscripciones[i];

                const visitante =
                    inscripciones[j];

                // Ida
                partidos.push({
                    torneo_categoria_id:
                        torneoCategoriaId,

                    inscripcion_local_id:
                        local.id,

                    inscripcion_visitante_id:
                        visitante.id,

                    estado: 'pendiente'
                });

                // Vuelta
                partidos.push({
                    torneo_categoria_id:
                        torneoCategoriaId,

                    inscripcion_local_id:
                        visitante.id,

                    inscripcion_visitante_id:
                        local.id,

                    estado: 'pendiente'
                });

            }
        }

        // Insert masivo
        await Partido.bulkCreate(
            partidos
        );

        res.json({
            message:
                'Fixture generado correctamente',
            partidos_generados:
                partidos.length
        });

    } catch (error) {
        next(error);
    }
};

export const obtenerPartidosPorTorneoCategoria = async (req, res, next) => {
    try {
        const { torneoCategoriaId } =
            req.params;

        const partidos =
            await Partido.findAll({
                where: {
                    torneo_categoria_id:
                        torneoCategoriaId
                },
                include: [
                    {
                        model: Inscripcion,
                        as: 'Local',
                        include: [Equipo]
                    },
                    {
                        model: Inscripcion,
                        as: 'Visitante',
                        include: [Equipo]
                    },
                    {
                        model: Sede
                    },
                    {
                        model: Arbitro
                    }
                ],
                order: [
                    ['fecha', 'ASC']
                ]
            });

        res.json(partidos);

    } catch (error) {
        next(error);
    }
};

export const actualizarPartido = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {fecha, sede_id, arbitro_id} = req.body;
        const partido = await Partido.findByPk(id);

        if (!partido) {
            return res.status(404).json({
                message:
                    'Partido no encontrado'
            });
        }

        await partido.update({
            fecha,
            sede_id,
            arbitro_id
        });

        res.json({
            message: 'Partido actualizado'
        });

    } catch (error) {
        next(error);
    }
};