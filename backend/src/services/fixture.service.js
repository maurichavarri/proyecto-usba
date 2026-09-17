import {
  Inscripcion,
  Partido,
  TorneoCategoria,
  Torneo,
} from "../models/index.js";
import { obtenerFechaActualArgentina } from "../utils/fecha.utils.js";

export const generarFixture = async (torneoCategoriaId) => {
  // =====================================================
  // BUSCAR COMPETENCIA
  // =====================================================

  const torneoCategoria = await TorneoCategoria.findByPk(torneoCategoriaId, {
    include: [
      {
        model: Torneo,
        as: "torneo",
      },
    ],
  });

  if (!torneoCategoria) {
    throw new Error("La categoría del torneo no existe.");
  }

  // =====================================================
  // VERIFICAR SI EL FIXTURE YA FUE GENERADO
  // =====================================================

  if (torneoCategoria.fixture_generado) {
    throw new Error("El fixture ya fue generado.");
  }

  // =====================================================
  // SEGURIDAD EXTRA:
  // VERIFICAR SI YA EXISTEN PARTIDOS
  // =====================================================

  const yaExiste = await Partido.count({
    where: {
      torneo_categoria_id: torneoCategoriaId,
    },
  });

  if (yaExiste > 0) {
    throw new Error("Ya existen partidos para esta competencia.");
  }

  // =====================================================
  // VERIFICAR INSCRIPCIONES PENDIENTES
  // =====================================================
  //
  // IMPORTANTE:
  // Esta validación debe realizarse ANTES de comprobar
  // la fecha de cierre de inscripción.
  // =====================================================

  const inscripcionesPendientes = await Inscripcion.count({
    where: {
      torneo_categoria_id: torneoCategoriaId,
      estado: "pendiente",
    },
  });

  if (inscripcionesPendientes > 0) {
    if (inscripcionesPendientes === 1) {
      throw new Error(
        "No se puede generar el fixture porque queda 1 inscripción pendiente de resolución.",
      );
    }

    throw new Error(
      `No se puede generar el fixture porque quedan ${inscripcionesPendientes} inscripciones pendientes de resolución.`,
    );
  }

  // =====================================================
  // VERIFICAR PERÍODO DE INSCRIPCIÓN
  // =====================================================

  const obtenerHoyArgentinaISO = () => {
    const partes = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Argentina/Buenos_Aires",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const valores = Object.fromEntries(
      partes
        .filter((parte) => parte.type !== "literal")
        .map((parte) => [parte.type, parte.value]),
    );

    return `${valores.year}-${valores.month}-${valores.day}`;
  };

  const hoy = obtenerHoyArgentinaISO();

  const fechaCierre = String(
    torneoCategoria.torneo.fecha_cierre_inscripcion,
  ).split("T")[0];

  if (!fechaCierre) {
    throw new Error(
      "El torneo no posee una fecha de cierre de inscripción configurada.",
    );
  }

  if (hoy < fechaCierre) {
    throw new Error("Todavía no finalizó el período de inscripción.");
  }

  // =====================================================
  // OBTENER INSCRIPCIONES CONFIRMADAS
  // =====================================================

  const inscripciones = await Inscripcion.findAll({
    where: {
      torneo_categoria_id: torneoCategoriaId,
      estado: "confirmado",
    },
    order: [["id", "ASC"]],
  });

  let equipos = inscripciones.map((inscripcion) => inscripcion.id);

  // =====================================================
  // CANTIDAD MÍNIMA SEGÚN FORMATO
  // =====================================================

  const minimoEquipos =
    torneoCategoria.formato_competencia === "playoff_8" ? 8 : 4;

  if (equipos.length < minimoEquipos) {
    throw new Error(
      `Se necesitan al menos ${minimoEquipos} equipos confirmados para generar el fixture.`,
    );
  }

  // =====================================================
  // SI ES IMPAR, AGREGAR BYE
  // =====================================================

  if (equipos.length % 2 !== 0) {
    equipos.push(null);
  }

  const n = equipos.length;

  const rondas = n - 1;

  const mitad = n / 2;

  const partidos = [];

  // =====================================================
  // GENERAR FASE REGULAR - IDA
  // =====================================================

  for (let jornada = 0; jornada < rondas; jornada++) {
    for (let i = 0; i < mitad; i++) {
      const local = equipos[i];

      const visitante = equipos[n - 1 - i];

      // BYE:
      // si alguno es null no se genera partido

      if (local && visitante) {
        const esPar = jornada % 2 === 0;

        partidos.push({
          torneo_categoria_id: torneoCategoriaId,

          inscripcion_local_id: esPar ? local : visitante,

          inscripcion_visitante_id: esPar ? visitante : local,

          jornada: jornada + 1,

          fecha: new Date(),

          estado: "pendiente",

          fase: "regular",
        });
      }
    }

    // =============================================
    // ROTACIÓN ROUND ROBIN
    // =============================================

    const ultimo = equipos.pop();

    equipos.splice(1, 0, ultimo);
  }

  // =====================================================
  // GENERAR PARTIDOS DE VUELTA
  // =====================================================

  const partidosVuelta = partidos.map((partido) => ({
    torneo_categoria_id: partido.torneo_categoria_id,

    inscripcion_local_id: partido.inscripcion_visitante_id,

    inscripcion_visitante_id: partido.inscripcion_local_id,

    jornada: partido.jornada + rondas,

    fecha: partido.fecha,

    estado: "pendiente",

    fase: partido.fase,
  }));

  partidos.push(...partidosVuelta);

  // =====================================================
  // VOLVER A COMPROBAR PENDIENTES
  // =====================================================
  //
  // Seguridad extra:
  // puede haber pasado algo entre la primera consulta
  // y la creación de los partidos.
  // =====================================================

  const pendientesAntesDeCrear = await Inscripcion.count({
    where: {
      torneo_categoria_id: torneoCategoriaId,

      estado: "pendiente",
    },
  });

  if (pendientesAntesDeCrear > 0) {
    throw new Error(
      pendientesAntesDeCrear === 1
        ? "No se puede generar el fixture porque queda 1 inscripción pendiente de resolución."
        : `No se puede generar el fixture porque quedan ${pendientesAntesDeCrear} inscripciones pendientes de resolución.`,
    );
  }

  // =====================================================
  // CREAR PARTIDOS
  // =====================================================

  const partidosCreados = await Partido.bulkCreate(partidos);

  // =====================================================
  // MARCAR FIXTURE GENERADO
  // Y COMPETENCIA EN CURSO
  // =====================================================

  await torneoCategoria.update({
    fixture_generado: true,
    estado_competencia: "en_curso",
  });

  // =====================================================
  // RETORNAR PARTIDOS
  // =====================================================

  return partidosCreados;
};
