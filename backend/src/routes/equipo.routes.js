import { Router } from 'express';
import { crearEquipo, obtenerMisEquipos } from '../controllers/equipo.controller.js';

import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';

const router = Router();

// Crear equipo
router.post('/', verifyToken, verifyRole('delegado'), crearEquipo);

// Ver mis equipos
router.get('/', verifyToken, verifyRole('delegado'), obtenerMisEquipos);

export default router;