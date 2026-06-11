import { Anuncio } from '../models/index.js';

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

        // Validaciones
        if (!titulo || !contenido) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Verificar duplicado
        const existe = await Anuncio.findOne({ where: { titulo } });

        if (existe) {
            return res.status(400).json({ message: 'Ya existe un anuncio con ese título' });
        }

        // Crear anuncio
        const anuncio = await Anuncio.create({ titulo, contenido });

        res.status(201).json(anuncio);

    } catch (error) {
        next(error);
    }
};

export const actualizarAnuncio = async (req, res, next) => {
    try {

        const { id } =
            req.params;

        const {
            titulo,
            contenido
        } = req.body;

        const anuncio =
            await Anuncio.findByPk(id);

        if (!anuncio) {

            return res.status(404).json({
                message:
                    'Anuncio no encontrado'
            });
        }

        // Validaciones
        if (
            !titulo ||
            !contenido
        ) {

            return res.status(400).json({
                message:
                    'Todos los campos son obligatorios'
            });
        }

        // Verificar duplicado
        const existe =
            await Anuncio.findOne({
                where: { titulo }
            });

        if (
            existe &&
            existe.id !== anuncio.id
        ) {

            return res.status(400).json({
                message:
                    'Ya existe un anuncio con ese título'
            });
        }

        await anuncio.update({
            titulo,
            contenido
        });

        res.json({
            message:
                'Anuncio actualizado',
            anuncio
        });

    } catch (error) {

        next(error);
    }
};

export const estadoAnuncio =
    async (req, res, next) => {

        try {

            const anuncio =
                await Anuncio.findByPk(
                    req.params.id
                );

            if (!anuncio) {

                return res.status(404).json({
                    message:
                        'Anuncio no encontrado'
                });
            }

            const nuevoEstado =
                anuncio.estado === 'activo'
                    ? 'inactivo'
                    : 'activo';

            await anuncio.update({
                estado: nuevoEstado
            });

            res.json({
                message:
                    `Anuncio ${nuevoEstado}`
            });

        } catch (error) {

            next(error);
        }
    };