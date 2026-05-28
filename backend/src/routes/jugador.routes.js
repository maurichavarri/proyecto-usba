import { Router } from 'express';
import { crearJugador, obtenerJugadoresPorEquipo } from '../controllers/jugador.controller.js';

import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';

const router = Router();

// Crear jugador
router.post('/', verifyToken, verifyRole('delegado'), crearJugador);

// Obtener jugadores por equipo
router.get('/equipo/:equipoId', verifyToken, verifyRole('delegado'), obtenerJugadoresPorEquipo);

export default router;