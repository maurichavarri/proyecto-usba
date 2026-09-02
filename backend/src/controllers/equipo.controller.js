<<<<<<< HEAD
// src/controllers/equipo.controller.js
=======
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
import { Sequelize } from 'sequelize';
import Equipo from '../models/equipo.model.js';
import Jugador from '../models/jugador.model.js';

export const crearEquipo = async (req, res, next) => {
    try {
        const { nombre, descripcion } = req.body;
        const usuarioId = req.usuario.id;

        const equipo = await Equipo.create({
            nombre,
            descripcion,
            creado_en: new Date().getFullYear(),
            id_usuario_creador: usuarioId
        });
<<<<<<< HEAD
        
=======
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
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
<<<<<<< HEAD
                            (SELECT COUNT(*) FROM jugador WHERE jugador.equipo_id = Equipo.id)
                        `),
=======
                (
                    SELECT COUNT(*)
                    FROM jugador
                    WHERE jugador.equipo_id = Equipo.id
                )
            `),
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
                        'cantidad_jugadores'
                    ],
                    [
                        Sequelize.literal(`
<<<<<<< HEAD
                            (SELECT COUNT(*) FROM inscripcion 
                             WHERE inscripcion.equipo_id = Equipo.id 
                             AND inscripcion.estado = 'confirmado')
                        `),
=======
                (
                    SELECT COUNT(*)
                    FROM inscripcion
                    WHERE inscripcion.equipo_id = Equipo.id
                    AND inscripcion.estado = 'confirmado'
                )
            `),
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
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