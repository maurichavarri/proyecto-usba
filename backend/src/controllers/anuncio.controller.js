import { Anuncio } from '../models/index.js';

export const getAnuncios = async (req, res, next) => {
    try {
        // Obtenemos los anuncios.
        const anuncios = await Anuncio.findAll();
        res.json(anuncios);
    } catch (error) {
        next(error);
    }
};

export const getAnuncio = async (req, res, next) => {
    try {
        // Obtenemos un solo anuncio
        const anuncio = await Anuncio.findByPk(req.params.id)
        res.json(anuncio)
    } catch (error) {
        next(error)
    }
}

export const crearAnuncio = async (req, res, next) => {
    try {
        // Guardamos en un objeto literal la información de req.body
        const { titulo, descripcion, fecha } = req.body;
        
        // Validaciones
        if (!titulo || !descripcion || !fecha) {
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });
        }

        // Creamos un anuncio con dicha información.
        const anuncio = await Anuncio.create({
            titulo,
            descripcion,
            fecha
        });

        res.status(201).json(anuncio);

    } catch (error) {
        next(error);
    }
}