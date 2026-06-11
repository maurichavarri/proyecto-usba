import { Categoria } from '../models/index.js';

export const getTodasLasCategorias = async (req, res, next) => {
    try {
        const categorias = await Categoria.findAll({
            order: [['id', 'DESC']]
        });
        res.json(categorias);
    } catch (error) {
        next(error);
    }
};

export const getCategorias = async (req, res, next) => {
    try {
        const categorias = await Categoria.findAll({
            where: { estado: 'activo' }
        });
        res.json(categorias);
    } catch (error) {
        next(error);
    }
};

export const getCategoria = async (req, res, next) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id);
        res.json(categoria);
    } catch (error) {
        next(error);
    }
};

export const crearCategoria = async (req, res, next) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre || !descripcion) {
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });
        }
        const existe = await Categoria.findOne({
            where: { nombre }
        });

        if (existe) {
            return res.status(400).json({
                message: 'La categoría ya existe'
            });
        }

        const categoria = await Categoria.create({ nombre, descripcion });
        res.status(201).json(categoria);

    } catch (error) {
        next(error);
    }
};

export const actualizarCategoria =
    async (req, res, next) => {

        try {

            const { id } = req.params;

            const {
                nombre,
                descripcion
            } = req.body;

            const categoria =
                await Categoria.findByPk(id);

            if (!categoria) {

                return res.status(404).json({
                    message:
                        'Categoría no encontrada'
                });
            }

            // Verificar nombre duplicado
            const existe =
                await Categoria.findOne({
                    where: {
                        nombre
                    }
                });

            // Si existe Y no es la misma categoría
            if (
                existe &&
                existe.id !== categoria.id
            ) {

                return res.status(400).json({
                    message:
                        'Ya existe una categoría con ese nombre'
                });
            }

            await categoria.update({
                nombre,
                descripcion
            });

            res.json({
                message:
                    'Categoría actualizada'
            });

        } catch (error) {

            next(error);
        }
    };

export const estadoCategoria = async (req, res, next) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id);

        if (!categoria) {
            return res.status(404).json({
                message: 'Categoría no encontrada'
            });
        }

        const nuevoEstado = categoria.estado === 'activo' ? 'inactivo' : 'activo';
        await categoria.update({ estado: nuevoEstado });
        res.json({ message: `Categoría ${nuevoEstado}` });

    } catch (error) {
        next(error);
    }
};