import { Torneo, Categoria } from '../models/index.js';

export const getTorneos = async (req, res, next) => {
    try {
        // Obtenemos los torneos.
        const torneos = await Torneo.findAll({
            where: { estado: 'activo' }
        });
        res.json(torneos);

    } catch (error) {
        next(error);
    }
};

export const getTorneo = async (req, res, next) => {
    try {
        // Obtenemos un torneo con sus categorías.
        const torneo = await Torneo.findByPk(req.params.id, {
            // Incluye las 'Categorías' vinculadas a cada uno, con sus atributos.
            include: {
                model: Categoria,
                where: { estado: 'activo' },
                attributes: ['id', 'nombre']
            }
        });
        res.json(torneo);

    } catch (error) {
        next(error);
    }
};

export const crearTorneo = async (req, res, next) => {
    try {
        // Guardamos en un objeto literal la información de req.body.
        const { nombre, fecha_inicio, fecha_fin } = req.body;
        
        // Validaciones
        if (!nombre || !fecha_inicio || !fecha_fin) {
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });
        }

        if (new Date(fecha_inicio) > new Date(fecha_fin)) {
            return res.status(400).json({
                message: 'La fecha de inicio no puede ser mayor a la fecha de fin'
            });
        }

        const existe = await Torneo.findOne({ where: { nombre } });

        if (existe) {
            return res.status(400).json({
                message: 'El torneo ya existe'
            });
        }

        // Creamos un torneo con dicha información.
        const torneo = await Torneo.create({
            nombre,
            fecha_inicio,
            fecha_fin
        });

        res.status(201).json(torneo);

    } catch (error) {
        next(error);
    }
};

export const actualizarTorneo = async (req, res, next) => {
    try{
        // Guardamos en un objeto literal la información de req.body.
        const { nombre, fecha_inicio, fecha_fin } = req.body;
        
        // Obtenemos un torneo a través de la clave primaria que se encuentra en la ruta.
        const torneo = await Torneo.findByPk(req.params.id);

        // Si el torneo no se encontró...
        if (!torneo) {
            return res.status(404).json({
                message: 'Torneo no encontrado'
            });
        }

        // Validaciones
        // En el caso de que se hayan ingresado nuevas fechas, verificamos que estas sean correctas
        if (fecha_inicio && fecha_fin) {
            if (new Date(fecha_inicio) > new Date(fecha_fin)) {
                return res.status(400).json({
                    message: 'Fechas inválidas'
                });
            }
        }

        // Si toda la información es correcta. Hacemos el UPDATE correspondiente.
        await torneo.update({
            nombre: nombre ?? torneo.nombre,
            fecha_inicio: fecha_inicio ?? torneo.fecha_inicio,
            fecha_fin: fecha_fin ?? torneo.fecha_fin
        });

        res.json(torneo);
    } catch (error) {
        next(error);
    }
}

export const estadoTorneo = async (req, res, next) => {
    try {
        const torneo = await Torneo.findByPk(req.params.id);

        if (!torneo) {
            return res.status(404).json({
                message: 'Torneo no encontrado'
            });
        }

        const nuevoEstado = torneo.estado === 'activo' ? 'inactivo' : 'activo';

        await torneo.update({ estado: nuevoEstado });

        res.json({
            message: `Torneo ${nuevoEstado}`
        });

    } catch (error) {
        next(error);
    }
}