import { Categoria } from '../models/index.js';

export const getCategorias = async (req, res, next) => {
    try {
        // Obtenemos las categorias.
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
        // Obtenemos una categoria.
        const categoria = await Categoria.findByPk(req.params.id);
        res.json(categoria);

    } catch (error) {
        next(error);
    }
};

export const crearCategoria = async (req, res, next) => {
    try {
        // Guardamos en un objeto literal la información de req.body.
        const { nombre, descripcion } = req.body;
        
        // Validaciones
        if (!nombre || !descripcion) {
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });
        }

        const existe = await Categoria.findOne({ where: { nombre } });

        if (existe) {
            return res.status(400).json({
                message: 'La categoría ya existe'
            });
        }

        // Creamos una categoría con dicha información.
        const categoria = await Categoria.create({
            nombre,
            descripcion
        });

        res.status(201).json(categoria);

    } catch (error) {
        next(error);
    }
};

export const actualizarCategoria = async (req, res, next) => {
    try{
        // Guardamos en un objeto literal la información de req.body.
        const { nombre, descripcion } = req.body;
        
        // Obtenemos una categoria a través de la clave primaria que se encuentra en la ruta.
        const categoria = await Categoria.findByPk(req.params.id);

        // Si la categoría no se encontró...
        if (!categoria) {
            return res.status(404).json({
                message: 'Categoria no encontrada'
            });
        }

        // Si toda la información es correcta. Hacemos el UPDATE correspondiente.
        await categoria.update({
            nombre: nombre ?? categoria.nombre,
            descripcion: descripcion ?? categoria.descripcion
        });

        res.json(categoria);
    } catch (error) {
        next(error);
    }
}

export const estadoCategoria = async (req, res, next) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id);

        if (!categoria) {
            return res.status(404).json({
                message: 'Categoria no encontrada'
            });
        }

        const nuevoEstado = categoria.estado === 'activo' ? 'inactivo' : 'activo';

        await categoria.update({ estado: nuevoEstado });

        res.json({
            message: `Categoria ${nuevoEstado}`
        });

    } catch (error) {
        next(error);
    }
}