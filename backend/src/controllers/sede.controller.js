import Sede from '../models/sede.model.js';

export const getSedes = async (req, res, next) => {
    try {

        const sedes =
            await Sede.findAll();

        res.json(sedes);

    } catch (error) {

        next(error);
    }
};

export const getSedeById = async (req, res, next) => {
    try {

        const sede =
            await Sede.findByPk(req.params.id);

        if (!sede) {
            return res.status(404).json({
                message: 'Sede no encontrada'
            });
        }

        res.json(sede);

    } catch (error) {

        next(error);
    }
};

export const createSede = async (req, res, next) => {
    try {

        const {
            nombre,
            direccion
        } = req.body;

        const sede =
            await Sede.create({
                nombre,
                direccion
            });

        res.status(201).json(sede);

    } catch (error) {

        next(error);
    }
};

export const updateSede = async (req, res, next) => {
    try {

        const sede =
            await Sede.findByPk(req.params.id);

        if (!sede) {
            return res.status(404).json({
                message: 'Sede no encontrada'
            });
        }

        await sede.update(req.body);

        res.json(sede);

    } catch (error) {

        next(error);
    }
};

export const deleteSede = async (req, res, next) => {
    try {

        const sede =
            await Sede.findByPk(req.params.id);

        if (!sede) {
            return res.status(404).json({
                message: 'Sede no encontrada'
            });
        }

        await sede.destroy();

        res.json({
            message: 'Sede eliminada'
        });

    } catch (error) {

        next(error);
    }
};