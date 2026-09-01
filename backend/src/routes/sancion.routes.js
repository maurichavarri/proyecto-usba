import { Router } from 'express';
import { crearSancion } from '../controllers/sancion.controller.js';

import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';

const router = Router();

router.post('/partidos/:partidoId/sanciones', verifyToken, verifyRole('arbitro'), crearSancion);

export default router;