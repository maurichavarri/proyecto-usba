import { Anuncio } from '../models/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAnuncios = async (req, res, next) => {
    try {
        const anuncios = await Anuncio.findAll({
            where: { estado: 'activo' },
            order: [['createdAt', 'DESC']]
        });
        res.json(anuncios);
    } catch (error) {
        next(error);
    }
};

export const getTodosLosAnuncios = async (req, res, next) => {
    try {
        const anuncios = await Anuncio.findAll({
            order: [['id', 'DESC']]
        });
        res.json(anuncios);
    } catch (error) {
        next(error);
    }
};

export const getAnuncio = async (req, res, next) => {
    try {
        const anuncio = await Anuncio.findByPk(req.params.id);
        if (!anuncio) {
            return res.status(404).json({ message: 'Anuncio no encontrado' });
        }
        res.json(anuncio);
    } catch (error) {
        next(error);
    }
};

export const crearAnuncio = async (req, res, next) => {
    try {
        const { titulo, contenido } = req.body;

        if (!titulo || !contenido) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const existe = await Anuncio.findOne({ where: { titulo } });
        if (existe) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Ya existe un anuncio con ese título' });
        }

        // Lee la imagen si fue subida
        const imagen = req.file ? `/uploads/anuncios/${req.file.filename}` : null;

        const anuncio = await Anuncio.create({ titulo, contenido, imagen });

        res.status(201).json(anuncio);

    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        next(error);
    }
};

export const actualizarAnuncio = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { titulo, contenido } = req.body;

        const anuncio = await Anuncio.findByPk(id);
        if (!anuncio) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: 'Anuncio no encontrado' });
        }

        if (!titulo || !contenido) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const existe = await Anuncio.findOne({ where: { titulo } });
        if (existe && existe.id !== anuncio.id) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Ya existe un anuncio con ese título' });
        }

        let imagen = anuncio.imagen;

        if (req.file) {
            // Borrar imagen anterior del disco
            if (anuncio.imagen) {
                const rutaAnterior = path.join(__dirname, '../../', anuncio.imagen);
                if (fs.existsSync(rutaAnterior)) fs.unlinkSync(rutaAnterior);
            }
            imagen = `/uploads/anuncios/${req.file.filename}`;
        }

        await anuncio.update({ titulo, contenido, imagen });

        res.json({ message: 'Anuncio actualizado', anuncio });

    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        next(error);
    }
};

export const estadoAnuncio = async (req, res, next) => {
    try {
        const anuncio = await Anuncio.findByPk(req.params.id);
        if (!anuncio) {
            return res.status(404).json({ message: 'Anuncio no encontrado' });
        }

        const nuevoEstado = anuncio.estado === 'activo' ? 'inactivo' : 'activo';
        await anuncio.update({ estado: nuevoEstado });

        res.json({ message: `Anuncio ${nuevoEstado}` });

    } catch (error) {
        next(error);
    }
};