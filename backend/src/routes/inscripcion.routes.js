import { Router } from 'express';
import {
    crearInscripcion,
    obtenerMisInscripciones,
    getInscripciones,
    cambiarEstadoInscripcion
} from '../controllers/inscripcion.controller.js';

import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';

const router = Router();


// =========================
// DELEGADO
// =========================

// GET MIS INSCRIPCIONES
router.get('/', verifyToken, verifyRole('delegado'), obtenerMisInscripciones);

// CREAR INSCRIPCIÓN
router.post('/', verifyToken, verifyRole('delegado'), crearInscripcion);


// =========================
// ADMIN
// =========================

// OBTENER TODAS LAS INSCRIPCIONES
router.get('/admin', verifyToken, verifyRole('admin'), getInscripciones);

// CAMBIAR ESTADO
router.patch('/:id/estado', verifyToken, verifyRole('admin'), cambiarEstadoInscripcion);

export default router;