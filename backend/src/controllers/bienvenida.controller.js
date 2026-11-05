import Bienvenida from '../models/bienvenida.model.js';
import { subirImagen, eliminarImagen } from '../config/cloudinary.js';

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

        const imagenAnterior = bienvenida.imagen;
        let imagen = imagenAnterior;

        if (req.file) {
            imagen = await subirImagen(req.file.buffer, 'usba/bienvenida');
        }

        await bienvenida.update({ titulo, texto, imagen });

        // Si se reemplazó la imagen, borra la anterior de Cloudinary
        if (req.file && imagenAnterior) {
            try {
                await eliminarImagen(imagenAnterior);
            } catch (errorArchivo) {
                console.error('No se pudo borrar la imagen anterior:', errorArchivo);
            }
        }

        res.json({ message: 'Bienvenida actualizada', bienvenida });
    } catch (error) {
        next(error);
    }
};