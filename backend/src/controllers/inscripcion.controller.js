import Inscripcion from '../models/inscripcion.model.js';
import Equipo from '../models/equipo.model.js';
import Jugador from '../models/jugador.model.js';
import TorneoCategoria from '../models/torneoCategoria.model.js';
import Torneo from '../models/torneo.model.js';
import Categoria from '../models/categoria.model.js';


// DELEGADO

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

        // Buscar torneo categoría
        const torneoCategoria = await TorneoCategoria.findByPk(torneo_categoria_id,
            {
                include: [
                    {
                        model: Torneo,
                        as: 'torneo'
                    }
                ]
            }
        );

        if (!torneoCategoria) {
            return res.status(404).json({
                message: 'Torneo categoría no encontrado'
            });
        }

        // Validar fechas
        const torneo = torneoCategoria.torneo;
        const hoy = new Date();
        const fechaInicio = new Date(torneo.fecha_inicio);
        const fechaCierre = new Date(torneo.fecha_cierre_inscripcion);

        // El torneo ya comenzó
        if (hoy > fechaInicio) {
            return res.status(400).json({
                message: 'El torneo ya comenzó y/o finalizó'
            });
        }

        // Inscripciones cerradas
        if (hoy > fechaCierre) {
            return res.status(400).json({
                message: 'El período de inscripción finalizó'
            });
        }

        // Contar jugadores
        const cantidadJugadores = await Jugador.count({
            where: { equipo_id }
        });

        if (cantidadJugadores < 5) {
            return res.status(400).json({
                message: 'El equipo debe tener mínimo 5 jugadores'
            });
        }

        // Verificar inscripción previa
        const existeInscripcion = await Inscripcion.findOne({
            where: {
                equipo_id,
                torneo_categoria_id
            }
        });

        if (existeInscripcion) {
            return res.status(400).json({
                message: 'El equipo ya está inscripto'
            });
        }

        // Crear inscripción
        const inscripcion = await Inscripcion.create({
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
        const inscripciones = await Inscripcion.findAll({
            include: [
                {
                    model: Equipo,
                    where: {
                        id_usuario_creador: usuarioId
                    }
                },
                {
                    model: TorneoCategoria,
                    as: 'torneoCategoria',
                    include: [
                        {
                            model: Torneo,
                            as: 'torneo'
                        },
                        {
                            model: Categoria,
                            as: 'categoria'
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


// ADMIN

export const getInscripciones = async (req, res, next) => {
    try {
        const inscripciones = await Inscripcion.findAll({
            include: [
                {
                    model: Equipo,
                    attributes: ['id', 'nombre']
                },
                {
                    model: TorneoCategoria,
                    as: 'torneoCategoria',
                    include: [
                        {
                            model: Torneo,
                            as: 'torneo',
                            attributes: ['id', 'nombre']
                        },
                        {
                            model: Categoria,
                            as: 'categoria',
                            attributes: ['id', 'nombre']
                        }
                    ]
                }
            ],
            order: [['fecha', 'DESC']]
        });

        res.json(inscripciones);

    } catch (error) {
        next(error);
    }
};

export const cambiarEstadoInscripcion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const inscripcion = await Inscripcion.findByPk(id);

        if (!inscripcion) {
            return res.status(404).json({
                message: 'Inscripción no encontrada'
            });
        }

        await inscripcion.update({ estado });

        res.json({
            message: 'Estado actualizado'
        });

    } catch (error) {
        next(error);
    }
};