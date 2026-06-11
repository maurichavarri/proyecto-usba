import { Router } from 'express';
import {
    getSedes,
    getSedeById,
    createSede,
    updateSede,
    deleteSede
} from '../controllers/sede.controller.js';

import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';

const router = Router();

router.get('/', getSedes);
router.get('/:id', getSedeById);

router.post('/', verifyToken, verifyRole('admin'), createSede);
router.put('/:id', verifyToken, verifyRole('admin'), updateSede);
router.delete('/:id', verifyToken, verifyRole('admin'), deleteSede);

export default router;