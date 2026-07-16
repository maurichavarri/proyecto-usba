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
import upload from '../middlewares/upload.middleware.js';

const router = Router();

// Admin (SIEMPRE antes de /:id)
router.get('/admin/todos', verifyToken, verifyRole('admin'), getTodosLosAnuncios);
router.post('/crear', verifyToken, verifyRole('admin'), upload.single('imagen'), crearAnuncio);
router.put('/:id', verifyToken, verifyRole('admin'), upload.single('imagen'), actualizarAnuncio);
router.patch('/:id/estado', verifyToken, verifyRole('admin'), estadoAnuncio);

// Públicas
router.get('/', getAnuncios);
router.get('/:id', getAnuncio);

export default router;