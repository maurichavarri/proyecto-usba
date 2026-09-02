import { Categoria } from '../models/index.js';
import { Op } from 'sequelize';

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
            where: {
                estado: 'activo'
            }
        });

        res.json(categorias);

    } catch (error) {
        next(error);
    }
};


export const getCategoria = async (req, res, next) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id);

        if (!categoria) {
            return res.status(404).json({
                message: 'Categoría no encontrada'
            });
        }

        res.json(categoria);

    } catch (error) {
        next(error);
    }
};


export const crearCategoria = async (req, res, next) => {
    try {

        const {
            nombre,
            descripcion,
            edad_minima,
            edad_maxima,
            sexo
        } = req.body;


        // =========================
        // CAMPOS OBLIGATORIOS
        // =========================

        if (!nombre || !nombre.trim()) {
            return res.status(400).json({
                message: 'El nombre de la categoría es obligatorio.'
            });
        }

        if (!descripcion || !descripcion.trim()) {
            return res.status(400).json({
                message: 'La descripción es obligatoria.'
            });
        }

        if (
            edad_minima === undefined ||
            edad_minima === "" ||
            edad_maxima === undefined ||
            edad_maxima === ""
        ) {
            return res.status(400).json({
                message:
                    'La edad mínima y la edad máxima son obligatorias.'
            });
        }

        if (!sexo) {
            return res.status(400).json({
                message:
                    'El sexo de la categoría es obligatorio.'
            });
        }


        // =========================
        // VALIDAR EDADES
        // =========================

        const edadMinima = Number(edad_minima);
        const edadMaxima = Number(edad_maxima);

        if (
            !Number.isInteger(edadMinima) ||
            !Number.isInteger(edadMaxima)
        ) {
            return res.status(400).json({
                message:
                    'Las edades deben ser números enteros.'
            });
        }

        if (
            edadMinima < 0 ||
            edadMaxima < 0
        ) {
            return res.status(400).json({
                message:
                    'Las edades no pueden ser negativas.'
            });
        }

        if (edadMinima > edadMaxima) {
            return res.status(400).json({
                message:
                    'La edad mínima no puede ser mayor a la edad máxima.'
            });
        }


        // =========================
        // VALIDAR SEXO
        // =========================

        if (
            sexo !== 'masculino' &&
            sexo !== 'femenino'
        ) {
            return res.status(400).json({
                message:
                    'El sexo de la categoría no es válido.'
            });
        }


        // =========================
        // NOMBRE DUPLICADO
        // =========================

        const existe = await Categoria.findOne({
            where: {
                nombre: nombre.trim()
            }
        });

        if (existe) {
            return res.status(400).json({
                message:
                    'La categoría ya existe'
            });
        }


        // =========================
        // CREAR
        // =========================

        const categoria = await Categoria.create({
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            edad_minima: edadMinima,
            edad_maxima: edadMaxima,
            sexo
        });


        res.status(201).json(categoria);

    } catch (error) {
        next(error);
    }
};


export const actualizarCategoria = async (req, res, next) => {
    try {

        const { id } = req.params;

        const {
            nombre,
            descripcion,
            edad_minima,
            edad_maxima,
            sexo
        } = req.body;


        // =========================
        // BUSCAR CATEGORÍA
        // =========================

        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).json({
                message:
                    'Categoría no encontrada'
            });
        }


        // =========================
        // VALIDAR CAMPOS
        // =========================

        if (!nombre || !nombre.trim()) {
            return res.status(400).json({
                message:
                    'El nombre de la categoría es obligatorio.'
            });
        }

        if (!descripcion || !descripcion.trim()) {
            return res.status(400).json({
                message:
                    'La descripción es obligatoria.'
            });
        }

        if (
            edad_minima === undefined ||
            edad_minima === "" ||
            edad_maxima === undefined ||
            edad_maxima === ""
        ) {
            return res.status(400).json({
                message:
                    'La edad mínima y la edad máxima son obligatorias.'
            });
        }

        if (!sexo) {
            return res.status(400).json({
                message:
                    'El sexo de la categoría es obligatorio.'
            });
        }


        // =========================
        // VALIDAR EDADES
        // =========================

        const edadMinima = Number(edad_minima);
        const edadMaxima = Number(edad_maxima);

        if (
            !Number.isInteger(edadMinima) ||
            !Number.isInteger(edadMaxima)
        ) {
            return res.status(400).json({
                message:
                    'Las edades deben ser números enteros.'
            });
        }

        if (
            edadMinima < 0 ||
            edadMaxima < 0
        ) {
            return res.status(400).json({
                message:
                    'Las edades no pueden ser negativas.'
            });
        }

        if (edadMinima > edadMaxima) {
            return res.status(400).json({
                message:
                    'La edad mínima no puede ser mayor a la edad máxima.'
            });
        }


        // =========================
        // VALIDAR SEXO
        // =========================

        if (
            sexo !== 'masculino' &&
            sexo !== 'femenino'
        ) {
            return res.status(400).json({
                message:
                    'El sexo de la categoría no es válido.'
            });
        }


        // =========================
        // NOMBRE DUPLICADO
        // =========================

        const existe = await Categoria.findOne({
            where: {
                nombre: nombre.trim(),
                id: {
                    [Op.ne]: id
                }
            }
        });

        if (existe) {
            return res.status(400).json({
                message: 'Ya existe una categoría con ese nombre'
            });
        }

        // =========================
        // ACTUALIZAR
        // =========================

        await categoria.update({
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            edad_minima: edadMinima,
            edad_maxima: edadMaxima,
            sexo
        });


        res.json({
            message: 'Categoría actualizada correctamente',
            categoria
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

        await categoria.update({ 
            estado: nuevoEstado 
        });

        res.json({
            message: `Categoría ${nuevoEstado}`
        });

    } catch (error) {
        next(error);
    }
};