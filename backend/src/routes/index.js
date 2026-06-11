import { Router } from 'express';

import torneoRoutes from './torneo.routes.js';
import categoriaRoutes from './categoria.routes.js';
import torneoCategoriaRoutes from './torneoCategoria.routes.js';

import anuncioRoutes from './anuncio.routes.js';

import authRoutes from './auth.routes.js';

import equipoRoutes from './equipo.routes.js';
import jugadorRoutes from './jugador.routes.js';
import inscripcionRoutes from './inscripcion.routes.js';

import sedeRoutes from './sede.routes.js';
import arbitroRoutes from './arbitro.routes.js';

import adminRoutes from './admin.routes.js';

const router = Router();

// Públicas
router.use('/torneos', torneoRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/torneo-categorias', torneoCategoriaRoutes);
router.use('/anuncios', anuncioRoutes);

// Auth
router.use('/auth', authRoutes);

// Delegado
router.use('/delegado/equipos', equipoRoutes);
router.use('/delegado/jugadores', jugadorRoutes);
router.use('/delegado/inscripciones', inscripcionRoutes);

// Admin
router.use('/admin', adminRoutes);
router.use('/sedes', sedeRoutes);
router.use('/arbitros', arbitroRoutes);

export default router;