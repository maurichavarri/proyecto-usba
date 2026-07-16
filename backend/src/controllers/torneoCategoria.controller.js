import { TorneoCategoria, Torneo, Categoria, Partido, Equipo, Inscripcion, Sede, Arbitro } from '../models/index.js';

import { getDetalleTorneoCategoria } from '../services/torneoCategoria.service.js';
import { generarFixture } from '../services/fixture.service.js';
import { calcularTablaPosiciones } from '../services/tabla.service.js';
import { generarPlayoffs } from '../services/playoff.service.js';

import { Sequelize } from 'sequelize';

export const crearTorneoCategoria = async (req, res, next) => {
    try {
        const { torneo_id, categoria_id, arancel, formato_competencia } = req.body;

        // Validaciones básicas
        if (!torneo_id || !categoria_id || !arancel) {
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });
        }

        // Verificar existencia
        const torneo = await Torneo.findByPk(torneo_id);
        const categoria = await Categoria.findByPk(categoria_id);

        if (!torneo || !categoria) {
            return res.status(404).json({
                message: 'Torneo o categoría no existen'
            });
        }

        // Evitar duplicados
        const existe = await TorneoCategoria.findOne({
            where: { torneo_id, categoria_id }
        });

        if (existe) {
            return res.status(400).json({
                message: 'La categoría ya está asociada a este torneo'
            });
        }

        // Crear relación
        const torneoCategoria = await TorneoCategoria.create({
            torneo_id,
            categoria_id,
            arancel,
            formato_competencia
        });

        res.status(201).json(torneoCategoria);

    } catch (error) {
        next(error);
    }
};

export const getTorneoCategorias = async (req, res, next) => {
    try {

        const data = await TorneoCategoria.findAll({
            include: [
                {
                    model: Torneo,
                    as: 'torneo',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Categoria,
                    as: 'categoria',
                    attributes: ['id', 'nombre']
                }
            ],

            attributes: {
                include: [
                    [
                        Sequelize.literal(`
                            (
                                SELECT COUNT(*)
                                FROM inscripcion
                                WHERE inscripcion.torneo_categoria_id = TorneoCategoria.id
                            )
                        `),
                        'equipos_inscriptos'
                    ]
                ]
            }
        });

        res.json(data);

    } catch (error) {
        next(error);
    }
};

export const getDetalle = async (req, res, next) => {
    try {
        const data = await getDetalleTorneoCategoria(req.params.id);

        res.json(data);

    } catch (error) {
        next(error);
    }
};

export const generarFixtureController = async (req, res, next) => {
    try {
        const { id } = req.params;

        await generarFixture(id);

        res.json({
            message: 'Fixture generado correctamente'
        });

    } catch (error) {
        next(error);
    }
};

export const generarPlayoffsController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const resultado = await generarPlayoffs(id);
        res.json(resultado);
    } catch (error) {
        next(error);
    }
};

export const getFixture = async (req, res, next) => {
    try {
        const { id } = req.params;
        const partidos = await Partido.findAll({
            where: {
                torneo_categoria_id: id
            },
            include: [
                {
                    association: 'local',
                    include: [
                        {
                            model: Equipo,
                            attributes: ['nombre']
                        }
                    ]
                },
                {
                    association: 'visitante',
                    include: [
                        {
                            model: Equipo,
                            attributes: ['nombre']
                        }
                    ]
                },
                {
                    model: Sede,
                    as: 'sede',
                    attributes: [
                        'id',
                        'nombre'
                    ]
                },
                {
                    model: Arbitro,
                    as: 'arbitro',
                    attributes: [
                        'id',
                        'nombre',
                        'apellido'
                    ]
                }
            ],
            order: [
                ['jornada', 'ASC'],
                ['fecha', 'ASC']
            ]
        });
        res.json(partidos);
    } catch (error) {
        next(error);
    }
};

export const getTablaPosiciones = async (req, res, next) => {
    try {
        const tabla = await calcularTablaPosiciones(req.params.id);
        res.json(tabla);
    } catch (error) {
        next(error);
    }
};

export const getResumenTorneoCategoria = async (req, res, next) => {
    try {
        const { id } = req.params;
        const torneoCategoria = await TorneoCategoria.findByPk(
            id,
            {
                include: [
                    {
                        model: Torneo,
                        as: "torneo"
                    },
                    {
                        model: Categoria,
                        as: "categoria"
                    }
                ]
            }
        );

        if (!torneoCategoria) {
            return res.status(404).json({
                message: "Torneo categoría no encontrado"
            });
        }

        const equipos = await Inscripcion.count({
            where: {
                torneo_categoria_id: id,
                estado: "confirmado"
            }
        });

        const partidos = await Partido.count({
            where: {
                torneo_categoria_id: id
            }
        });

        const partidosJugados = await Partido.count({
            where: {
                torneo_categoria_id: id,
                estado: "jugado"
            }
        });

        const partidosPendientes = await Partido.count({
            where: {
                torneo_categoria_id: id,
                estado: "pendiente"
            }
        });

        res.json({
            torneo: torneoCategoria.torneo?.nombre,
            categoria: torneoCategoria.categoria?.nombre,
            formatoCompetencia: torneoCategoria.formato_competencia,
            equipos,
            partidos,
            partidosJugados,
            partidosPendientes
        });

    } catch (error) {
        next(error);
    }
};

export const finalizarCompetencia = async (req, res, next) => {
    try {
        const { id } = req.params;
        const torneoCategoria = await TorneoCategoria.findByPk(id);

        if (!torneoCategoria) {
            return res.status(404).json({
                message: 'Competencia no encontrada'
            });
        }

        const pendientes = await Partido.count({
            where: {
                torneo_categoria_id: id,
                estado: 'pendiente'
            }
        });

        if (pendientes > 0) {
            return res.status(400).json({
                message: 'Todavía existen partidos pendientes'
            });
        }

        await torneoCategoria.update({
            estado_competencia: 'finalizado'
        });

        res.json({
            message: 'Competencia finalizada correctamente'
        });

    } catch (error) {
        next(error);
    }
};