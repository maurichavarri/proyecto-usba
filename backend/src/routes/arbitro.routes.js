import { Router } from 'express';
import {
    getArbitros,
    getArbitroById,
    createArbitro,
    updateArbitro,
    deleteArbitro
} from '../controllers/arbitro.controller.js';

import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';

const router = Router();

router.get('/', getArbitros);
router.get('/:id', getArbitroById);
router.post('/', verifyToken, verifyRole('admin'), createArbitro);
router.put('/:id', verifyToken, verifyRole('admin'), updateArbitro);
router.delete('/:id', verifyToken, verifyRole('admin'), deleteArbitro);

export default router;