import { Router } from 'express';
import { getTorneos } from '../controllers/torneo.controller.js';
import { getTorneo } from '../controllers/torneo.controller.js';
import { crearTorneo } from '../controllers/torneo.controller.js';
import { actualizarTorneo } from '../controllers/torneo.controller.js';
import { estadoTorneo } from '../controllers/torneo.controller.js';

import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';

const router = Router();

router.get('/', getTorneos);
router.get('/:id', getTorneo);
router.post('/crear', verifyToken, verifyRole('admin'), crearTorneo);
router.put('/:id/actualizar', actualizarTorneo);
router.patch('/:id/estado', estadoTorneo);

export default router;