import { Router } from 'express';
import { getTorneos } from '../controllers/torneo.controller.js';
import { getTorneo } from '../controllers/torneo.controller.js';
import { crearTorneo } from '../controllers/torneo.controller.js';
import { actualizarTorneo } from '../controllers/torneo.controller.js';
import { estadoTorneo } from '../controllers/torneo.controller.js';

const router = Router();

router.get('/', getTorneos);
router.get('/:id', getTorneo);
router.post('/crear', crearTorneo);
//router.post('/', authMiddleware, roleMiddleware('admin'), crearTorneo);
router.put('/:id/actualizar', actualizarTorneo);
router.patch('/:id/estado', estadoTorneo);

export default router;