import { Router } from 'express';
import { getAnuncios } from '../controllers/anuncio.controller.js';
import { getAnuncio } from '../controllers/anuncio.controller.js';
import { crearAnuncio } from '../controllers/anuncio.controller.js';

const router = Router();

router.get('/', getAnuncios);
router.get('/:id', getAnuncio);
router.post('/crear', crearAnuncio);

export default router;