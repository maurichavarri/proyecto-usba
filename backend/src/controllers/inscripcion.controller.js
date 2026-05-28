import Inscripcion from '../models/inscripcion.model.js';
import Equipo from '../models/equipo.model.js';
import Jugador from '../models/jugador.model.js';
import TorneoCategoria from '../models/torneoCategoria.model.js';
import Torneo from '../models/torneo.model.js';
import Categoria from '../models/categoria.model.js';

export const crearInscripcion = async (req, res, next) => {
    try {
        const { equipo_id, torneo_categoria_id } = req.body;
        const usuarioId = req.usuario.id;

        // Buscar equipo
        const equipo = await Equipo.findByPk(equipo_id);
        if (!equipo) {
            return res.status(404).json({
                message: 'Equipo no encontrado'
            });
        }

        // Ownership
        if (equipo.id_usuario_creador !== usuarioId) {
            return res.status(403).json({
                message: 'No autorizado'
            });
        }

        // Contar jugadores
        const cantidadJugadores =
            await Jugador.count({
                where: {
                    equipo_id
                }
            });

        if (cantidadJugadores < 5) {
            return res.status(400).json({
                message:
                    'El equipo debe tener mínimo 5 jugadores'
            });
        }

        // Verificar inscripción previa
        const existeInscripcion =
            await Inscripcion.findOne({
                where: {
                    equipo_id,
                    torneo_categoria_id
                }
            });

        if (existeInscripcion) {
            return res.status(400).json({
                message:
                    'El equipo ya está inscripto'
            });
        }

        // Crear inscripción
        const inscripcion =
            await Inscripcion.create({
                equipo_id,
                torneo_categoria_id,
                fecha: new Date(),
                estado: 'pendiente'
            });

        res.status(201).json(inscripcion);

    } catch (error) {
        next(error);
    }
};


export const obtenerMisInscripciones = async (req, res, next) => {
    try {
        const usuarioId = req.usuario.id;
        const inscripciones =
            await Inscripcion.findAll({
                include: [
                    {
                        model: Equipo,
                        where: {
                            id_usuario_creador: usuarioId
                        }
                    },
                    {
                        model: TorneoCategoria,
                        include: [
                            {
                                model: Torneo
                            },
                            {
                                model: Categoria
                            }
                        ]
                    }
                ]

            });
            
        res.json(inscripciones);

    } catch (error) {
        next(error);
    }
};