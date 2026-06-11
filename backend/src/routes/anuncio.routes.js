import { Router } from 'express';
import {
    getAnuncios,
    getAnuncio,
    crearAnuncio,
    actualizarAnuncio,
    estadoAnuncio,
    getTodosLosAnuncios
} from '../controllers/anuncio.controller.js';

import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';

const router = Router();

// Públicas
router.get('/', getAnuncios);

// Admin
router.get('/admin/todos', verifyToken, verifyRole('admin'), getTodosLosAnuncios);
router.get('/:id', getAnuncio);
router.post('/crear', verifyToken, verifyRole('admin'), crearAnuncio);
router.put('/:id', verifyToken, verifyRole('admin'), actualizarAnuncio);
router.patch('/:id/estado', verifyToken, verifyRole('admin'), estadoAnuncio);

export default router;