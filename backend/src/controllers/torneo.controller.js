import { Torneo, Categoria, TorneoCategoria, Inscripcion } from '../models/index.js';

export const getTodosLosTorneos = async (req, res, next) => {
    try {
        const torneos = await Torneo.findAll({
            order: [['id', 'DESC']]
        });
        res.json(torneos);
    } catch (error) {
        next(error);
    }
};

export const getTorneos = async (req, res, next) => {
    try {
        const torneos = await Torneo.findAll({
            where: {
                estado: "activo"
            },

            include: [
                {
                    model: Categoria,
                    required: false,

                    where: {
                        estado: "activo"
                    },

                    attributes: [
                        "id",
                        "nombre"
                    ],

                    through: {
                        attributes: [
                            "id",
                            "formato_competencia",
                            "estado_competencia"
                        ]
                    }
                }
            ],

            order: [
                ["fecha_inicio", "DESC"]
            ]
        });

        const resultado = await Promise.all(
            torneos.map(async (torneo) => {
                const categorias = await Promise.all(
                    torneo.Categoria.map(async (categoria) => {
                        const equipos = await Inscripcion.count({
                            where: {
                                torneo_categoria_id: categoria.TorneoCategoria.id,
                                estado: "confirmado"
                            }
                        });

                        return {
                            id: categoria.TorneoCategoria.id,
                            nombre: categoria.nombre,
                            equipos,
                            formato: categoria.TorneoCategoria.formato_competencia,
                            estado: categoria.TorneoCategoria.estado_competencia
                        };
                    })
                );
                return {
                    id: torneo.id,
                    nombre: torneo.nombre,
                    fecha_inicio: torneo.fecha_inicio,
                    fecha_fin: torneo.fecha_fin,
                    categorias
                };
            })
        );

        res.json(resultado);

    } catch (error) {
        next(error);
    }

};

export const getTorneo = async (req, res, next) => {
    try {
        // Obtenemos un torneo con sus categorías.
        const torneo = await Torneo.findByPk(req.params.id, {
            // Incluye las 'Categorías' vinculadas a cada uno, con sus atributos.
            include: {
                model: Categoria,
                where: { estado: 'activo' },
                attributes: ['id', 'nombre'],
                required: false
            }
        });
        res.json(torneo);
    } catch (error) {
        next(error);
    }
};

export const crearTorneo = async (req, res, next) => {
    try {
        // Guardamos en un objeto literal la información de req.body.
        const { nombre, fecha_inicio, fecha_fin, fecha_cierre_inscripcion } = req.body;

        // Validaciones
        if (!nombre || !fecha_inicio || !fecha_fin || !fecha_cierre_inscripcion) {
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });
        }

        if (new Date(fecha_inicio) > new Date(fecha_fin)) {
            return res.status(400).json({
                message: 'La fecha de inicio no puede ser mayor a la fecha de fin'
            });
        }

        if (new Date(fecha_cierre_inscripcion) > new Date(fecha_inicio)) {
            return res.status(400).json({
                message: 'La fecha de cierre debe ser anterior al inicio del torneo'
            });
        }

        const existe = await Torneo.findOne({ where: { nombre } });

        if (existe) {
            return res.status(400).json({
                message: 'El torneo ya existe'
            });
        }

        // Creamos un torneo con dicha información.
        const torneo = await Torneo.create({ nombre, fecha_inicio, fecha_fin, fecha_cierre_inscripcion });
        res.status(201).json(torneo);

    } catch (error) {
        next(error);
    }
};

export const actualizarTorneo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre, fecha_inicio, fecha_fin, fecha_cierre_inscripcion } = req.body;

        const torneo = await Torneo.findByPk(id);

        if (!torneo) {
            return res.status(404).json({
                message: 'Torneo no encontrado'
            });
        }

        // Validar campos
        if (!nombre || !fecha_inicio || !fecha_fin || !fecha_cierre_inscripcion) {
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });
        }

        // Validar fechas
        if (new Date(fecha_inicio) > new Date(fecha_fin)) {
            return res.status(400).json({
                message: 'La fecha de inicio no puede ser mayor a la fecha de fin'
            });
        }

        if (new Date(fecha_cierre_inscripcion) > new Date(fecha_inicio)) {
            return res.status(400).json({
                message: 'La fecha de cierre debe ser anterior al inicio del torneo'
            });
        }

        // Verificar duplicado
        const existe = await Torneo.findOne({ where: { nombre } });

        // Si existe y no es el mismo torneo
        if (existe && existe.id !== torneo.id) {
            return res.status(400).json({
                message: 'Ya existe un torneo con ese nombre'
            });
        }

        await torneo.update({ nombre, fecha_inicio, fecha_fin, fecha_cierre_inscripcion });

        res.json({
            message: 'Torneo actualizado', torneo
        });

    } catch (error) {
        next(error);
    }
};

export const estadoTorneo = async (req, res, next) => {
    try {
        const torneo = await Torneo.findByPk(req.params.id);

        if (!torneo) {
            return res.status(404).json({
                message: 'Torneo no encontrado'
            });
        }

        const nuevoEstado = torneo.estado === 'activo' ? 'inactivo' : 'activo';

        await torneo.update({ estado: nuevoEstado });

        res.json({
            message: `Torneo ${nuevoEstado}`
        });

    } catch (error) {
        next(error);
    }
}