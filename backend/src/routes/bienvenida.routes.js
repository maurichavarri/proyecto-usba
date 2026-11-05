import { Router } from 'express';
import { getBienvenida, actualizarBienvenida } from '../controllers/bienvenida.controller.js';
import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';
import upload from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/', getBienvenida);
router.put('/', verifyToken, verifyRole('admin'), upload.single('imagen'), actualizarBienvenida);

export default router;