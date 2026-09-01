// arbitro.controller.js
import bcrypt from 'bcryptjs';
import { Usuario, Arbitro, Partido, Inscripcion, Equipo, Jugador, TorneoCategoria, Torneo, Categoria, Sede, Sancion } from '../models/index.js';
import sequelize from '../config/db.js';
import { Op } from 'sequelize';

export const getArbitros = async (req, res, next) => {
    try {
        const arbitros = await Arbitro.findAll({
            include: [{ model: Usuario, as: "usuario", attributes: ["id", "correo"] }]
        });
        res.json(arbitros);
    } catch (error) {
        next(error);
    }
};

export const getArbitroById = async (req, res, next) => {
    try {
        const arbitro = await Arbitro.findByPk(req.params.id, {
            include: [{ model: Usuario, as: "usuario", attributes: ["id", "correo"] }]
        });

        if (!arbitro) {
            return res.status(404).json({ message: "Árbitro no encontrado" });
        }

        res.json(arbitro);
    } catch (error) {
        next(error);
    }
};

export const createArbitro = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { nombre, apellido, correo, contraseña } = req.body;

        if (!nombre || !apellido || !correo || !contraseña) {
            await t.rollback();
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const existe = await Usuario.findOne({ where: { correo }, transaction: t });
        if (existe) {
            await t.rollback();
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        const passwordHash = await bcrypt.hash(contraseña, 10);

        const usuario = await Usuario.create({
            correo,
            contraseña: passwordHash,
            rol: 'arbitro'
        }, { transaction: t });

        const arbitro = await Arbitro.create({
            nombre,
            apellido,
            usuario_id: usuario.id
        }, { transaction: t });

        await t.commit();

        const arbitroConUsuario = await Arbitro.findByPk(arbitro.id, {
            include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'correo'] }]
        });

        res.status(201).json(arbitroConUsuario);

    } catch (error) {
        await t.rollback();
        next(error);
    }
};

export const updateArbitro = async (req, res, next) => {
    try {
        const { nombre, apellido, correo } = req.body;

        const arbitro = await Arbitro.findByPk(req.params.id, {
            include: [{ model: Usuario, as: 'usuario' }]
        });

        if (!arbitro) {
            return res.status(404).json({ message: 'Árbitro no encontrado' });
        }

        await arbitro.update({ nombre, apellido });

        if (correo) {
            const existe = await Usuario.findOne({
                where: { correo, id: { [Op.ne]: arbitro.usuario.id } }
            });
            if (existe) {
                return res.status(400).json({ message: 'El correo ya está registrado por otro usuario' });
            }
            await arbitro.usuario.update({ correo });
        }

        const arbitroActualizado = await Arbitro.findByPk(arbitro.id, {
            include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'correo'] }]
        });

        res.json(arbitroActualizado);

    } catch (error) {
        next(error);
    }
};

export const deleteArbitro = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const arbitro = await Arbitro.findByPk(req.params.id, {
            include: [{ model: Usuario, as: 'usuario' }]
        });

        if (!arbitro) {
            await t.rollback();
            return res.status(404).json({ message: 'Árbitro no encontrado' });
        }

        // Primero eliminar árbitro
        await arbitro.destroy({ transaction: t });

        // Luego eliminar usuario asociado
        if (arbitro.usuario) {
            await arbitro.usuario.destroy({ transaction: t });
        }

        await t.commit();
        res.json({ message: 'Árbitro y usuario eliminados' });

    } catch (error) {
        await t.rollback();
        next(error);
    }
};

export const getMisPartidos = async (req, res, next) => {
    try {
        const usuarioId = req.usuario.id;

        // Buscar el perfil de árbitro asociado al usuario autenticado
        const arbitro = await Arbitro.findOne({
            where: {
                usuario_id: usuarioId
            }
        });

        if (!arbitro) {
            return res.status(404).json({
                message: 'Perfil de árbitro no encontrado'
            });
        }

        // Buscar solamente los partidos asignados a ese árbitro
        const partidos = await Partido.findAll({
            where: {
                arbitro_id: arbitro.id
            },
            include: [
                {
                    model: Inscripcion,
                    as: 'local',
                    include: [
                        {
                            model: Equipo,
                            attributes: ['id', 'nombre']
                        }
                    ]
                },
                {
                    model: Inscripcion,
                    as: 'visitante',
                    include: [
                        {
                            model: Equipo,
                            attributes: ['id', 'nombre']
                        }
                    ]
                },
                {
                    model: Sede,
                    as: 'sede',
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
            order: [
                ['fecha', 'ASC']
            ]
        });
        res.json(partidos);
    } catch (error) {
        next(error);
    }
};

export const getMiPartidoById = async (req, res, next) => {
    try {
        const usuarioId = req.usuario.id;
        const { id } = req.params;

        // Perfil de árbitro autenticado
        const arbitro = await Arbitro.findOne({
            where: {
                usuario_id: usuarioId
            }
        });

        if (!arbitro) {
            return res.status(404).json({
                message: "Perfil de árbitro no encontrado"
            });
        }

        const partido = await Partido.findByPk(id, {
            include: [
                {
                    model: Inscripcion,
                    as: "local",
                    include: [
                        {
                            model: Equipo,
                            attributes: ["id", "nombre"],
                            include: [
                                {
                                    model: Jugador,
                                    as: "jugadores",
                                    attributes: [
                                        "id",
                                        "nombre",
                                        "apellido",
                                        "dni",
                                        "dorsal",
                                        "estado"
                                    ]
                                }
                            ]
                        }
                    ]
                },

                {
                    model: Inscripcion,
                    as: "visitante",
                    include: [
                        {
                            model: Equipo,
                            attributes: ["id", "nombre"],
                            include: [
                                {
                                    model: Jugador,
                                    as: "jugadores",
                                    attributes: [
                                        "id",
                                        "nombre",
                                        "apellido",
                                        "dni",
                                        "dorsal",
                                        "estado"
                                    ]
                                }
                            ]
                        }
                    ]
                },

                {
                    model: Sede,
                    as: "sede",
                    attributes: ["id", "nombre"]
                },

                {
                    model: TorneoCategoria,
                    as: "torneoCategoria",
                    include: [
                        {
                            model: Torneo,
                            as: "torneo",
                            attributes: ["id", "nombre"]
                        },
                        {
                            model: Categoria,
                            as: "categoria",
                            attributes: ["id", "nombre"]
                        }
                    ]
                },

                {
                    model: Sancion,
                    as: "sanciones",
                    include: [
                        {
                            model: Jugador,
                            as: "jugador",
                            attributes: [
                                "id",
                                "nombre",
                                "apellido",
                                "dorsal"
                            ]
                        }
                    ]
                }
            ]
        });

        if (!partido) {
            return res.status(404).json({
                message: "Partido no encontrado"
            });
        }

        // Seguridad
        if (partido.arbitro_id !== arbitro.id) {
            return res.status(403).json({
                message: "No está autorizado para consultar este partido"
            });
        }

        res.json(partido);

    } catch (error) {
        next(error);
    }
};