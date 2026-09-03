import { Router } from "express";

import {
  obtenerInscripcionesAdmin,
  actualizarEstadoInscripcion,
  obtenerPlantelInscripcion,
  generarFixture,
  obtenerPartidosPorTorneoCategoria,
  actualizarPartido,
} from "../controllers/admin.controller.js";

import { getDetalleAdmin } from "../controllers/torneoCategoria.controller.js";

import verifyToken from "../middlewares/verifyToken.js";
import verifyRole from "../middlewares/verifyRole.js";

const router = Router();

// ========================================================
// INSCRIPCIONES
// ========================================================

router.get(
  "/inscripciones",
  verifyToken,
  verifyRole("admin"),
  obtenerInscripcionesAdmin,
);

router.patch(
  "/inscripciones/:id",
  verifyToken,
  verifyRole("admin"),
  actualizarEstadoInscripcion,
);

router.get(
  "/inscripciones/:id/plantel",
  verifyToken,
  verifyRole("admin"),
  obtenerPlantelInscripcion,
);

// ========================================================
// FIXTURE
// ========================================================

router.post(
  "/fixture/generar/:torneoCategoriaId",
  verifyToken,
  verifyRole("admin"),
  generarFixture,
);

router.get(
  "/fixture/:torneoCategoriaId",
  verifyToken,
  verifyRole("admin"),
  obtenerPartidosPorTorneoCategoria,
);

// ========================================================
// PARTIDOS
// ========================================================

router.patch(
  "/partidos/:id",
  verifyToken,
  verifyRole("admin"),
  actualizarPartido,
);

// ========================================================
// TORNEO - CATEGORÍAS
// ========================================================

router.get(
  "/torneo-categorias/:id",
  verifyToken,
  verifyRole("admin"),
  getDetalleAdmin,
);

export default router;