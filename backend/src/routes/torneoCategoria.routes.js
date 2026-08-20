import { Router } from 'express';
import {
    crearTorneoCategoria,
    getTorneoCategorias,
    getTorneoCategoriasDisponibles,
    getDetalle,
    generarFixtureController,
    getFixture,
    getTablaPosiciones,
    getResumenTorneoCategoria,
    generarPlayoffsController,
    finalizarCompetencia,
    getEquipoCompetencia
} from '../controllers/torneoCategoria.controller.js';

import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';

const router = Router();

// Crear relación torneo-categoría
router.post('/', verifyToken, verifyRole('admin'), crearTorneoCategoria);

// Obtener todas
router.get('/', getTorneoCategorias);

// Obtener todas (disponibles)
router.get('/disponibles', verifyToken, verifyRole('delegado'), getTorneoCategoriasDisponibles);

// Obtener la información de un Equipo y sus Jugadores para la vista pública
router.get("/:id/equipos/:equipoId", getEquipoCompetencia);

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