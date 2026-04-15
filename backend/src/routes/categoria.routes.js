import { Router } from 'express';
import { getCategorias } from '../controllers/categoria.controller.js';
import { getCategoria } from '../controllers/categoria.controller.js';
import { crearCategoria } from '../controllers/categoria.controller.js';
import { actualizarCategoria } from '../controllers/categoria.controller.js';
import { estadoCategoria } from '../controllers/categoria.controller.js';

const router = Router();

router.get('/', getCategorias);
router.get('/:id', getCategoria);
router.post('/crear', crearCategoria);
//router.post('/', authMiddleware, roleMiddleware('admin'), crearCategoria);
router.put('/:id/actualizar', actualizarCategoria);
router.patch('/:id/estado', estadoCategoria);

export default router;