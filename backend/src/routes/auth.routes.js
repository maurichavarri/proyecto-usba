import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

router.post('/inscribirse', register);
router.post('/ingresar', login);

export default router;