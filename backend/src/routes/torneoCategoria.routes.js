import { Router } from 'express';
import {
    crearTorneoCategoria,
    getTorneoCategorias,
    getDetalle,
    generarFixtureController,
    getFixture,
    getTablaPosiciones,
    getResumenTorneoCategoria,
    generarPlayoffsController,
    finalizarCompetencia
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

// Obtener tabla
router.get('/:id/tabla', getTablaPosiciones);

// Obtener resumen
router.get("/:id/resumen", getResumenTorneoCategoria);

// Generar playoff
router.post('/:id/playoffs', verifyToken, verifyRole('admin'), generarPlayoffsController);

// Finalizar competición
router.patch('/:id/finalizar', verifyToken, verifyRole('admin'), finalizarCompetencia)

export default router;