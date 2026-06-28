// arbitro.controller.js
import bcrypt from 'bcryptjs';
import { Usuario, Arbitro } from '../models/index.js';
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
