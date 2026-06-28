import Jugador from '../models/jugador.model.js';
import Equipo from '../models/equipo.model.js';

export const crearJugador = async (req, res, next) => {

    try {

        const {
            nombre,
            apellido,
            dni,
            equipo_id
        } = req.body;

        const usuarioId = req.usuario.id;

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

        // Crear jugador
        const jugador = await Jugador.create({
            nombre,
            apellido,
            dni,
            equipo_id
        });

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