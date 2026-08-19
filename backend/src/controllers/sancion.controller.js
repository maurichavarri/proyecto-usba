import { Sancion, Partido, Jugador, Arbitro, Inscripcion } from '../models/index.js';
import sequelize from '../config/db.js';

export const crearSancion = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { partidoId } = req.params;
        const { jugador_id, falta, tipo, descripcion, fechas_suspension } = req.body;
        const usuarioId = req.usuario.id;

        // =========================
        // VALIDACIONES GENERALES
        // =========================

        if (!jugador_id || !falta || !tipo || !descripcion || fechas_suspension === undefined) {
            await transaction.rollback();
            return res.status(400).json({
                message: 'Debe completar todos los campos'
            });
        }

        const tiposPermitidos = ['tecnica', 'antideportiva', 'descalificante', 'expulsion', 'otra'];

        if (!tiposPermitidos.includes(tipo)) {
            await transaction.rollback();
            return res.status(400).json({
                message: 'Tipo de falta inválido'
            });
        }

        const fechasSuspensionNumero = Number(fechas_suspension);

        if (!Number.isInteger(fechasSuspensionNumero) || fechasSuspensionNumero < 0) {
            await transaction.rollback();
            return res.status(400).json({
                message: 'La cantidad de fechas de suspensión debe ser un número entero igual o mayor a 0'
            });
        }


        // =========================
        // BUSCAR ÁRBITRO
        // =========================

        const arbitro = await Arbitro.findOne({
            where: {
                usuario_id: usuarioId
            },
            transaction
        });

        if (!arbitro) {
            await transaction.rollback();
            return res.status(403).json({
                message: 'El usuario no posee un perfil de árbitro'
            });
        }


        // =========================
        // BUSCAR PARTIDO
        // =========================

        const partido = await Partido.findByPk(
            partidoId,
            {
                transaction
            }
        );

        if (!partido) {
            await transaction.rollback();
            return res.status(404).json({
                message: 'Partido no encontrado'
            });
        }


        // =========================
        // VALIDAR ÁRBITRO ASIGNADO
        // =========================

        if (partido.arbitro_id !== arbitro.id) {
            await transaction.rollback();
            return res.status(403).json({
                message: 'No está autorizado para registrar faltas en este partido'
            });
        }


        // =========================
        // VALIDAR ESTADO PARTIDO
        // =========================

        if (partido.estado !== 'jugado') {
            await transaction.rollback();
            return res.status(400).json({
                message: 'Las faltas solo pueden registrarse cuando el administrador haya marcado el partido como jugado'
            });
        }


        // =========================
        // OBTENER EQUIPOS
        // =========================

        const inscripcionLocal = await Inscripcion.findByPk(
            partido.inscripcion_local_id,
            {
                transaction
            }
        );

        const inscripcionVisitante = await Inscripcion.findByPk(
            partido.inscripcion_visitante_id,
            {
                transaction
            }
        );

        if (!inscripcionLocal || !inscripcionVisitante) {
            await transaction.rollback();
            return res.status(400).json({
                message: 'No fue posible determinar los equipos del partido'
            });
        }


        // =========================
        // BUSCAR JUGADOR
        // =========================

        const jugador = await Jugador.findByPk(
            jugador_id,
            {
                transaction
            }
        );

        if (!jugador) {
            await transaction.rollback();
            return res.status(404).json({
                message: 'Jugador no encontrado'
            });
        }


        // El jugador debe pertenecer al local o visitante
        const perteneceAlPartido =
            jugador.equipo_id === inscripcionLocal.equipo_id ||
            jugador.equipo_id === inscripcionVisitante.equipo_id;


        if (!perteneceAlPartido) {
            await transaction.rollback();
            return res.status(400).json({
                message: 'El jugador no pertenece a ninguno de los equipos de este partido'
            });
        }


        // =========================
        // ESTADO DE LA SANCIÓN
        // =========================

        const estadoSancion = fechasSuspensionNumero > 0 ? 'activa' : 'cumplida';

        // Fecha real del partido
        const fechaPartido = new Date(partido.fecha).toISOString().split('T')[0];

        // =========================
        // CREAR SANCIÓN
        // =========================

        const sancion = await Sancion.create(
            {
                jugador_id: jugador.id,
                partido_id: partido.id,
                falta: falta.trim(),
                tipo,
                descripcion: descripcion.trim(),
                fecha: fechaPartido,
                fechas_suspension: fechasSuspensionNumero,
                fechas_cumplidas: 0,
                estado: estadoSancion
            },
            {
                transaction
            }
        );


        // =========================
        // SUSPENDER JUGADOR
        // =========================

        if (fechasSuspensionNumero > 0) {
            await jugador.update(
                {
                    estado: 'inactivo'
                },
                {
                    transaction
                }
            );
        }

        await transaction.commit();

        res.status(201).json({
            message: fechasSuspensionNumero > 0 ? `Sanción registrada. El jugador fue suspendido por ${fechasSuspensionNumero} fecha(s).` : 'Falta registrada correctamente.',
            sancion
        });

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

export const obtenerHistorialJugador = async (req, res, next) => {
    try {

        const { jugadorId } = req.params;

        const jugador = await Jugador.findByPk(jugadorId);

        if (!jugador) {
            return res.status(404).json({
                message: 'Jugador no encontrado'
            });
        }

        const sanciones = await Sancion.findAll({
            where: {
                jugador_id: jugadorId
            },
            include: [
                {
                    model: Partido,
                    as: 'partido',
                    attributes: [
                        'id',
                        'fecha',
                        'fase',
                        'jornada'
                    ]
                }
            ],
            order: [
                ['fecha', 'DESC'],
                ['id', 'DESC']
            ]
        });

        res.json({
            jugador: {
                id: jugador.id,
                nombre: jugador.nombre,
                apellido: jugador.apellido,
                dorsal: jugador.dorsal
            },
            sanciones
        });

    } catch (error) {
        next(error);
    }
};