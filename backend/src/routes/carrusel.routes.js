import { Router } from 'express';
import {
    getImagenesPublicas,
    getTodasLasImagenes,
    crearImagen,
    toggleEstado,
    actualizarOrden,
    eliminarImagen
} from '../controllers/carrusel.controller.js';

import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';
import uploadCarrusel from '../middlewares/uploadCarrusel.middleware.js';

const router = Router();

// Pública: para mostrar el carrusel en el Home
router.get('/', getImagenesPublicas);

// Admin
router.get('/admin/todas', verifyToken, verifyRole('admin'), getTodasLasImagenes);
router.post('/crear', verifyToken, verifyRole('admin'), uploadCarrusel.single('imagen'), crearImagen);
router.patch('/:id/estado', verifyToken, verifyRole('admin'), toggleEstado);
router.patch('/:id/orden', verifyToken, verifyRole('admin'), actualizarOrden);
router.delete('/:id', verifyToken, verifyRole('admin'), eliminarImagen);

export default router;