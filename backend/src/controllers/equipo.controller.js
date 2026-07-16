import Equipo from '../models/equipo.model.js';

export const crearEquipo = async (req, res, next) => {

    try {

        const { nombre, descripcion } = req.body;

        // Usuario viene del token
        const usuarioId = req.usuario.id;

        // Crear equipo
        const equipo = await Equipo.create({
            nombre,
            descripcion,
            id_usuario_creador: usuarioId
        });

        res.status(201).json(equipo);

    } catch (error) {
        next(error);
    }
};

export const obtenerMisEquipos = async (req, res, next) => {

    try {

        const usuarioId = req.usuario.id;

        const equipos = await Equipo.findAll({
            where: {
                id_usuario_creador: usuarioId
            }
        });

        res.json(equipos);

    } catch (error) {
        next(error);
    }
};