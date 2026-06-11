import Arbitro from '../models/arbitro.model.js';

export const getArbitros = async (req, res, next) => {
    try {

        const arbitros =
            await Arbitro.findAll();

        res.json(arbitros);

    } catch (error) {

        next(error);
    }
};

export const getArbitroById = async (req, res, next) => {
    try {

        const arbitro =
            await Arbitro.findByPk(req.params.id);

        if (!arbitro) {
            return res.status(404).json({
                message: 'Árbitro no encontrado'
            });
        }

        res.json(arbitro);

    } catch (error) {

        next(error);
    }
};

export const createArbitro = async (req, res, next) => {
    try {

        const arbitro =
            await Arbitro.create(req.body);

        res.status(201).json(arbitro);

    } catch (error) {

        next(error);
    }
};

export const updateArbitro = async (req, res, next) => {
    try {

        const arbitro =
            await Arbitro.findByPk(req.params.id);

        if (!arbitro) {
            return res.status(404).json({
                message: 'Árbitro no encontrado'
            });
        }

        await arbitro.update(req.body);

        res.json(arbitro);

    } catch (error) {

        next(error);
    }
};

export const deleteArbitro = async (req, res, next) => {
    try {

        const arbitro =
            await Arbitro.findByPk(req.params.id);

        if (!arbitro) {
            return res.status(404).json({
                message: 'Árbitro no encontrado'
            });
        }

        await arbitro.destroy();

        res.json({
            message: 'Árbitro eliminado'
        });

    } catch (error) {

        next(error);
    }
};