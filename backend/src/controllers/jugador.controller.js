import { Op } from "sequelize";
import Jugador from '../models/jugador.model.js';
import Equipo from '../models/equipo.model.js';
import { plantelBloqueado } from "../services/plantelBloqueado.service.js";

export const crearJugador = async (req, res, next) => {
    try {
        const { nombre, apellido, dni, dorsal, equipo_id } = req.body;
        const usuarioId = req.usuario.id;

        if (!/^\d{7,8}$/.test(dni)) {
            return res.status(400).json({
                message: "El DNI debe contener únicamente 7 u 8 números."
            });
        }

        if (!Number.isInteger(Number(dorsal))) {
            return res.status(400).json({
                message: "El dorsal debe ser numérico."
            });
        }

        if (Number(dorsal) < 0 || Number(dorsal) > 99) {
            return res.status(400).json({
                message: "El dorsal debe estar entre 0 y 99."
            });
        }

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

        // Validar DNI repetido EN EL EQUIPO
        const existeJugador = await Jugador.findOne({
            where: {
                dni,
                equipo_id
            }
        });

        if (existeJugador) {
            return res.status(400).json({
                message: 'Ya existe un jugador con ese DNI en el equipo'
            });
        }

        // Validar DORSAL repetido EN EL EQUIPO
        const existeDorsal = await Jugador.findOne({
            where: {
                dorsal,
                equipo_id
            }
        });

        if (existeDorsal) {
            return res.status(400).json({
                message: "Ya existe un jugador con ese dorsal en el equipo"
            });
        }

        const bloqueado = await plantelBloqueado(equipo_id);

        if (bloqueado) {
            return res.status(400).json({
                message: "No es posible agregar jugadores porque el equipo ya posee una inscripción confirmada."
            });
        }

        // Crear jugador
        const jugador = await Jugador.create({ nombre, apellido, dni, dorsal, equipo_id });
        res.status(201).json(jugador);

    } catch (error) {
        next(error);
    }
};

export const obtenerJugadoresPorEquipo = async (req, res, next) => {
    try {
        const { equipoId } = req.params;
        const usuarioId = req.usuario.id;
        const equipo = await Equipo.findByPk(equipoId);

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

        const jugadores = await Jugador.findAll({
            where: {
                equipo_id: equipoId
            }
        });

        res.json(jugadores);

    } catch (error) {
        next(error);
    }
};

export const obtenerJugador = async (req, res, next) => {
    try {
        const jugador = await Jugador.findByPk(req.params.id);

        if (!jugador) {
            return res.status(404).json({
                message: "Jugador no encontrado"
            });
        }

        res.json(jugador);

    } catch (error) {
        next(error);
    }
};

export const editarJugador = async (req, res, next) => {
    try {
        const jugador = await Jugador.findByPk(req.params.id);

        if (!jugador) {
            return res.status(404).json({
                message: "Jugador no encontrado"
            });
        }

        const { nombre, apellido, dni, dorsal } = req.body;

        if (!nombre.trim()) {
            return res.status(400).json({
                message: "Debe ingresar un nombre."
            });
        }

        if (!apellido.trim()) {
            return res.status(400).json({
                message: "Debe ingresar un apellido."
            });
        }

        if (!/^\d{7,8}$/.test(dni)) {
            return res.status(400).json({
                message: "El DNI debe contener 7 u 8 números."
            });
        }

        if (Number(dorsal) < 0 || Number(dorsal) > 99) {
            return res.status(400).json({
                message: "El dorsal debe estar entre 0 y 99."
            });
        }

        const existeDni = await Jugador.findOne({
            where: {
                dni,
                equipo_id: jugador.equipo_id,
                id: {
                    [Op.ne]: jugador.id
                }
            }
        });

        if (existeDni) {
            return res.status(400).json({
                message: "Ya existe otro jugador con ese DNI en el equipo."
            });
        }

        const existeDorsal = await Jugador.findOne({
            where: {
                dorsal,
                equipo_id: jugador.equipo_id,
                id: {
                    [Op.ne]: jugador.id
                }
            }
        });

        if (existeDorsal) {
            return res.status(400).json({
                message: "Ya existe otro jugador con ese dorsal."
            });
        }

        const bloqueado = await plantelBloqueado(jugador.equipo_id);

        if (bloqueado && dni !== jugador.dni) {
            return res.status(400).json({
                message: "No es posible modificar el DNI porque el equipo ya posee una inscripción confirmada."
            });
        }

        await jugador.update({ nombre, apellido, dni, dorsal });

        res.json({ message: "Jugador actualizado correctamente", jugador });

    } catch (error) {
        next(error);
    }
};

export const cambiarEstadoJugador = async (req, res, next) => {
    try {

        const jugador = await Jugador.findByPk(req.params.id);

        const bloqueado = await plantelBloqueado(jugador.equipo_id);

        if (bloqueado) {
            return res.status(400).json({
                message: "No es posible activar o desactivar jugadores porque el equipo ya posee una inscripción confirmada."
            });
        }

        if (!jugador) {
            return res.status(404).json({
                message: "Jugador no encontrado"
            });
        }

        await jugador.update({
            estado:
                jugador.estado === "activo"
                    ? "inactivo"
                    : "activo"
        });

        res.json({
            message: "Estado actualizado correctamente"
        });

    } catch (error) {
        next(error);
    }
};