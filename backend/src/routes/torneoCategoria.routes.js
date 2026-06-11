import { Router } from 'express';
import {
    crearTorneoCategoria,
    getTorneoCategorias,
    getDetalle,
    generarFixtureController,
    getFixture
} from '../controllers/torneoCategoria.controller.js';

import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';

const router = Router();

// Crear relación torneo-categoría
router.post('/', verifyToken, verifyRole('admin'), crearTorneoCategoria);

// Obtener todas
router.get('/', getTorneoCategorias);

// Obtener detalle
router.get('/:id', getDetalle);

// Generar fixture
router.post('/:id/fixture', verifyToken, verifyRole('admin'), generarFixtureController);

// Obtener fixture
router.get('/:id/fixture', getFixture);

export default router;