import { Router } from 'express';
import { crearJugador, obtenerJugadoresPorEquipo, obtenerJugador, editarJugador, cambiarEstadoJugador } from "../controllers/jugador.controller.js";
import { obtenerHistorialJugador } from '../controllers/sancion.controller.js';

import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';

const router = Router();

// Crear jugador
router.post('/', verifyToken, verifyRole('delegado'), crearJugador);

// Obtener jugadores por equipo
router.get('/equipo/:equipoId', verifyToken, verifyRole('delegado'), obtenerJugadoresPorEquipo);

// Obtener un jugador
router.get("/:id", verifyToken, verifyRole("delegado"), obtenerJugador);

// Editar jugador
router.put("/:id", verifyToken, verifyRole("delegado"), editarJugador);

// Activar / desactivar jugador
//router.patch("/:id/estado", verifyToken, verifyRole("delegado"), cambiarEstadoJugador);

// Obtener las sanciones de un jugador
router.get('/:jugadorId/sanciones', verifyToken, verifyRole('delegado'), obtenerHistorialJugador);

export default router;