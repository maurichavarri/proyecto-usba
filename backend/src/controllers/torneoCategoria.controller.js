import { TorneoCategoria, Torneo, Categoria } from '../models/index.js';
import { Partido, Equipo, Inscripcion } from '../models/index.js';

import { getDetalleTorneoCategoria } from '../services/torneoCategoria.service.js';
import { generarFixture } from '../services/fixture.service.js';

export const crearTorneoCategoria = async (req, res, next) => {
    try {
        const { torneo_id, categoria_id, arancel } = req.body;

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
            arancel
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
                    attributes: ['id', 'nombre']
                },
                {
                    model: Categoria,
                    attributes: ['id', 'nombre']
                }
            ]
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

export const getFixture = async (req, res, next) => {
    try {
        const { id } = req.params;

        const partidos = await Partido.findAll({
            where: { torneo_categoria_id: id },
            include: [
                {
                    association: 'local',
                    include: [{ model: Equipo, attributes: ['nombre'] }]
                },
                {
                    association: 'visitante',
                    include: [{ model: Equipo, attributes: ['nombre'] }]
                }
            ],
            order: [['fecha', 'ASC']]
        });

        res.json(partidos);

    } catch (error) {
        next(error);
    }
};