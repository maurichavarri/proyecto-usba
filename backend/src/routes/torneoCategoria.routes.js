import { Router } from 'express';
import { crearTorneoCategoria } from '../controllers/torneoCategoria.controller.js';
import { getTorneoCategorias } from '../controllers/torneoCategoria.controller.js'
import { getDetalle } from '../controllers/torneoCategoria.controller.js'
import { generarFixtureController } from '../controllers/torneoCategoria.controller.js'
import { getFixture } from '../controllers/torneoCategoria.controller.js'

import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';

const router = Router();

router.post('/', verifyToken, verifyRole('admin'), crearTorneoCategoria);
router.get('/', getTorneoCategorias);
router.get('/:id', getDetalle);
router.get('/:id/fixture', generarFixtureController);
router.post('/:id/fixture', getFixture)

export default router;