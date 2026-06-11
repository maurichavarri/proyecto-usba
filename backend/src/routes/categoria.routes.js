import { Router } from 'express';
import {
    getTodasLasCategorias,
    getCategorias,
    getCategoria,
    crearCategoria,
    actualizarCategoria,
    estadoCategoria
} from '../controllers/categoria.controller.js';

import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';

const router = Router();

// Públicas
router.get('/', getCategorias);
router.get('/:id', getCategoria);

// Admin
router.get('/admin/todas', verifyToken, verifyRole('admin'), getTodasLasCategorias);
router.post('/crear', verifyToken, verifyRole('admin'), crearCategoria);
router.put('/:id', verifyToken, verifyRole('admin'), actualizarCategoria);
router.patch('/:id/estado', verifyToken, verifyRole('admin'), estadoCategoria);

export default router;