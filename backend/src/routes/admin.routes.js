import { Router } from 'express';
import { 
    obtenerInscripcionesAdmin, 
    actualizarEstadoInscripcion, 
    generarFixture,
    obtenerPartidosPorTorneoCategoria,
    actualizarPartido
} from '../controllers/admin.controller.js';

import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';

const router = Router();

router.get('/inscripciones', verifyToken, verifyRole('admin'), obtenerInscripcionesAdmin);
router.patch('/inscripciones/:id', verifyToken, verifyRole('admin'), actualizarEstadoInscripcion);
router.post('/fixture/generar/:torneoCategoriaId', verifyToken, verifyRole('admin'), generarFixture);
router.get('/fixture/:torneoCategoriaId', verifyToken, verifyRole('admin'), obtenerPartidosPorTorneoCategoria);
router.patch('/partidos/:id', verifyToken, verifyRole('admin'), actualizarPartido);