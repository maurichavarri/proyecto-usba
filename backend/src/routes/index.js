import { Router } from 'express';
import torneoRoutes from './torneo.routes.js';
import categoriaRoutes from './categoria.routes.js';

const router = Router();

router.use('/torneos', torneoRoutes);
router.use('/categorias', categoriaRoutes);

export default router;