// src/controllers/equipo.controller.js
import { Sequelize } from 'sequelize';
import Equipo from '../models/equipo.model.js';

export const crearEquipo = async (req, res, next) => {
    try {
        const { nombre, descripcion } = req.body;
        const usuarioId = req.usuario.id;

        const equipo = await Equipo.create({
            nombre,
            descripcion,
            id_usuario_creador: usuarioId
        });
        
        res.status(201).json(equipo);
    } catch (error) {
        console.error('Error al crear equipo:', error);
        next(error);
    }
};

export const obtenerMisEquipos = async (req, res, next) => {
    try {
        const usuarioId = req.usuario.id;
        const equipos = await Equipo.findAll({
            where: {
                id_usuario_creador: usuarioId
            },
            attributes: {
                include: [
                    [
                        Sequelize.literal(`
                            (SELECT COUNT(*) FROM jugador WHERE jugador.equipo_id = Equipo.id)
                        `),
                        'cantidad_jugadores'
                    ],
                    [
                        Sequelize.literal(`
                            (SELECT COUNT(*) FROM inscripcion 
                             WHERE inscripcion.equipo_id = Equipo.id 
                             AND inscripcion.estado = 'confirmado')
                        `),
                        'cantidad_competencias'
                    ]
                ]
            }
        });
        res.json(equipos);
    } catch (error) {
        console.error('Error al obtener equipos:', error);
        next(error);
    }
};