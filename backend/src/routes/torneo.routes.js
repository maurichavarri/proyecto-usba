import { Router } from 'express';
import { 
    getTodosLosTorneos,
    getTorneos,
    getTorneo,
    crearTorneo,
    actualizarTorneo,
    estadoTorneo 
} from '../controllers/torneo.controller.js';

import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';

const router = Router();

// Públicas
router.get('/', getTorneos);
router.get('/:id', getTorneo);

// Admin
router.get('/admin/todos', verifyToken, verifyRole('admin'), getTodosLosTorneos);
router.post('/crear', verifyToken, verifyRole('admin'), crearTorneo);
router.put('/:id', verifyToken, verifyRole('admin'), actualizarTorneo);
router.patch('/:id/estado', verifyToken, verifyRole('admin'), estadoTorneo);

export default router;