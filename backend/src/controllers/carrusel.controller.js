import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Público: solo imágenes activas ordenadas
export const getImagenesPublicas = async (req, res, next) => {
    try {
        const imagenes = await CarruselImagen.findAll({
            where: { activo: true },
            order: [['orden', 'ASC'], ['createdAt', 'ASC']]
        });
        res.json(imagenes);
    } catch (error) {
        next(error);
    }
};

// Admin: todas las imágenes
export const getTodasLasImagenes = async (req, res, next) => {
    try {
        const imagenes = await CarruselImagen.findAll({
            order: [['orden', 'ASC'], ['createdAt', 'ASC']]
        });
        res.json(imagenes);
    } catch (error) {
        next(error);
    }
};

// Subir nueva imagen
export const crearImagen = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se recibió ninguna imagen' });
        }

        const orden = parseInt(req.body.orden) || 0;
        const url = `/uploads/carrusel/${req.file.filename}`;

        const imagen = await CarruselImagen.create({ url, orden });

        res.status(201).json(imagen);
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        next(error);
    }
};

// Cambiar activo/inactivo
export const toggleEstado = async (req, res, next) => {
    try {
        const imagen = await CarruselImagen.findByPk(req.params.id);

        if (!imagen) {
            return res.status(404).json({ message: 'Imagen no encontrada' });
        }

        await imagen.update({ activo: !imagen.activo });

        res.json({ message: `Imagen ${imagen.activo ? 'visible' : 'oculta'}`, imagen });
    } catch (error) {
        next(error);
    }
};

// Actualizar orden
export const actualizarOrden = async (req, res, next) => {
    try {
        const imagen = await CarruselImagen.findByPk(req.params.id);

        if (!imagen) {
            return res.status(404).json({ message: 'Imagen no encontrada' });
        }

        const orden = parseInt(req.body.orden);

        if (isNaN(orden)) {
            return res.status(400).json({ message: 'El orden debe ser un número' });
        }

        await imagen.update({ orden });

        res.json({ message: 'Orden actualizado', imagen });
    } catch (error) {
        next(error);
    }
};

// Eliminar imagen (disco + BD)
export const eliminarImagen = async (req, res, next) => {
    try {
        const imagen = await CarruselImagen.findByPk(req.params.id);

        if (!imagen) {
            return res.status(404).json({ message: 'Imagen no encontrada' });
        }

        // Borrar archivo del disco
        const rutaArchivo = path.join(__dirname, '../../', imagen.url);
        if (fs.existsSync(rutaArchivo)) {
            fs.unlinkSync(rutaArchivo);
        }

        await imagen.destroy();

        res.json({ message: 'Imagen eliminada correctamente' });
    } catch (error) {
        next(error);
    }
};