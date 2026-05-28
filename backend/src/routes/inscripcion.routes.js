import { Router } from 'express';
import { crearInscripcion, obtenerMisInscripciones } from '../controllers/inscripcion.controller.js';

import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';

const router = Router();

// GET MIS INSCRIPCIONES
router.get('/', verifyToken, verifyRole('delegado'), obtenerMisInscripciones);

// CREAR INSCRIPCIÓN
router.post('/', verifyToken, verifyRole('delegado'), crearInscripcion);

export default router;