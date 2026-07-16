import Bienvenida from '../models/bienvenida.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GET público
export const getBienvenida = async (req, res, next) => {
    try {
        let bienvenida = await Bienvenida.findOne();

        // Si no existe, la crea con defaults
        if (!bienvenida) {
            bienvenida = await Bienvenida.create({
                titulo: 'Bienvenido a la USBA',
                texto: 'La Unión de Santiago del Estero de Básquet Amateur te invita a formar parte de nuestros torneos.'
            });
        }

        res.json(bienvenida);
    } catch (error) {
        next(error);
    }
};

// PUT admin — actualiza título, texto e imagen
export const actualizarBienvenida = async (req, res, next) => {
    try {
        const { titulo, texto } = req.body;

        let bienvenida = await Bienvenida.findOne();

        if (!bienvenida) {
            bienvenida = await Bienvenida.create({ titulo, texto });
        }

        let imagen = bienvenida.imagen;

        if (req.file) {
            // Borrar imagen anterior si existe
            if (bienvenida.imagen) {
                const rutaAnterior = path.join(__dirname, '../../', bienvenida.imagen);
                if (fs.existsSync(rutaAnterior)) fs.unlinkSync(rutaAnterior);
            }
            imagen = `/uploads/bienvenida/${req.file.filename}`;
        }

        await bienvenida.update({ titulo, texto, imagen });

        res.json({ message: 'Bienvenida actualizada', bienvenida });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        next(error);
    }
};