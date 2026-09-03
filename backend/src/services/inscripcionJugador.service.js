import { Jugador, InscripcionJugador } from "../models/index.js";

export const crearSnapshotPlantel = async (inscripcionId, equipoId, transaction,) => {
  // =========================
  // EVITAR SNAPSHOT DUPLICADO
  // =========================

  const snapshotExistente = await InscripcionJugador.count({
    where: {
      inscripcion_id: inscripcionId,
    },
    transaction,
  });

  if (snapshotExistente > 0) {
    throw new Error("La inscripción ya posee un plantel histórico registrado.");
  }

  // =========================
  // PLANTEL ACTUAL
  // =========================

  const jugadores = await Jugador.findAll({
    where: {
      equipo_id: equipoId,
      en_plantel: true,
    },
    transaction,
  });

  if (jugadores.length === 0) {
    throw new Error("El equipo no posee jugadores en el plantel.");
  }

  // =========================
  // SNAPSHOT
  // =========================

  const snapshot = jugadores.map((jugador) => ({
    inscripcion_id: inscripcionId,
    jugador_id: jugador.id,
    nombre: jugador.nombre,
    apellido: jugador.apellido,
    dni: jugador.dni,
    dorsal: jugador.dorsal,
    fecha_nacimiento: jugador.fecha_nacimiento,
    sexo: jugador.sexo,
    es_delegado: jugador.es_delegado,
  }));

  // =========================
  // INSERT
  // =========================

  await InscripcionJugador.bulkCreate(snapshot, {
    transaction,
  });

  return snapshot;
};
