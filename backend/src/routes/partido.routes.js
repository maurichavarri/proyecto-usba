import { Router } from 'express';

import {
    getPartidoById,
    updatePartido
} from '../controllers/partido.controller.js';

import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';

const router = Router();

router.get('/:id', getPartidoById);

router.put(
    '/:id',
    verifyToken,
    verifyRole('admin'),
    updatePartido
);

export default router;