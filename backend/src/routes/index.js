import { Router } from 'express';
import torneoRoutes from './torneo.routes.js';
import categoriaRoutes from './categoria.routes.js';
import torneoCategoriaRoutes from './torneoCategoria.routes.js';
import anuncioRoutes from './anuncio.routes.js'

const router = Router();

router.use('/torneos', torneoRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/torneo-categorias', torneoCategoriaRoutes);
router.use('/anuncios', anuncioRoutes);

export default router;