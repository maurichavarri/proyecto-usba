import {
  Jugador,
  TorneoCategoria,
  Torneo,
  Categoria,
} from "../models/index.js";

import { validarJugadoresDuplicados } from "./validarJugadoresDuplicados.service.js";

const calcularEdadEnFecha = (fechaNacimiento, fechaReferencia) => {
  const [anioN, mesN, diaN] = String(fechaNacimiento)
    .split("T")[0]
    .split("-")
    .map(Number);

  const [anioR, mesR, diaR] = String(fechaReferencia)
    .split("T")[0]
    .split("-")
    .map(Number);

  let edad = anioR - anioN;

  if (mesR < mesN || (mesR === mesN && diaR < diaN)) {
    edad--;
  }

  return edad;
};

export const validarPlantelInscripcion = async (
  equipoId,
  torneoCategoriaId,
  inscripcionId = null,
) => {
  // =========================
  // COMPETENCIA
  // =========================

  const torneoCategoria = await TorneoCategoria.findByPk(torneoCategoriaId, {
    include: [
      {
        model: Torneo,
        as: "torneo",
      },
      {
        model: Categoria,
        as: "categoria",
      },
    ],
  });

  if (!torneoCategoria) {
    return {
      valido: false,
      code: "TORNEO_CATEGORIA_NO_ENCONTRADO",
      message: "Torneo-categoría no encontrado.",
    };
  }

  const torneo = torneoCategoria.torneo;

  const categoria = torneoCategoria.categoria;

  // =========================
  // PLANTEL ACTUAL
  // =========================

  const jugadores = await Jugador.findAll({
    where: {
      equipo_id: equipoId,
      en_plantel: true,
    },
  });

  // =========================
  // CANTIDAD
  // =========================

  if (jugadores.length < 5) {
    return {
      valido: false,
      code: "PLANTEL_INCOMPLETO",
      message: "El equipo debe contar con al menos 5 jugadores.",
    };
  }

  if (jugadores.length > 12) {
    return {
      valido: false,
      code: "PLANTEL_EXCEDIDO",
      message: "El equipo no puede superar los 12 jugadores.",
    };
  }

  // =========================
  // DELEGADO OBLIGATORIO
  // =========================

  const tieneDelegado = jugadores.some(
    (jugador) => jugador.es_delegado === true,
  );

  if (!tieneDelegado) {
    return {
      valido: false,
      code: "DELEGADO_FALTANTE",
      message: "El delegado debe formar parte del plantel.",
    };
  }

  // =========================
  // DORSALES REPETIDOS
  // =========================

  const dorsales = jugadores.map((jugador) => Number(jugador.dorsal));

  const dorsalesUnicos = new Set(dorsales);

  if (dorsalesUnicos.size !== dorsales.length) {
    return {
      valido: false,
      code: "DORSALES_DUPLICADOS",
      message: "Existen jugadores con dorsales repetidos en el plantel.",
    };
  }

  // =========================
  // REQUISITOS DE CATEGORÍA
  // =========================

  const jugadoresNoAptos = [];

  for (const jugador of jugadores) {
    const edad = calcularEdadEnFecha(
      jugador.fecha_nacimiento,
      torneo.fecha_inicio,
    );

    const motivos = [];

    if (edad < categoria.edad_minima) {
      motivos.push(
        `Tiene ${edad} años y la edad mínima es ${categoria.edad_minima}.`,
      );
    }

    if (edad > categoria.edad_maxima) {
      motivos.push(
        `Tiene ${edad} años y la edad máxima es ${categoria.edad_maxima}.`,
      );
    }

    if (jugador.sexo !== categoria.sexo) {
      motivos.push(
        `El sexo registrado no corresponde a la categoría ${categoria.sexo}.`,
      );
    }

    if (motivos.length > 0) {
      jugadoresNoAptos.push({
        id: jugador.id,

        nombre: jugador.nombre,

        apellido: jugador.apellido,

        dorsal: jugador.dorsal,

        edad,

        sexo: jugador.sexo,

        motivos,
      });
    }
  }

  if (jugadoresNoAptos.length > 0) {
    return {
      valido: false,

      code: "JUGADORES_NO_APTOS",

      message:
        "El plantel posee jugadores que no cumplen los requisitos de la categoría.",

      requisitos: {
        edad_minima: categoria.edad_minima,

        edad_maxima: categoria.edad_maxima,

        sexo: categoria.sexo,
      },

      jugadores: jugadoresNoAptos,
    };
  }

  // =========================
  // JUGADORES DUPLICADOS
  // EN LA COMPETENCIA
  // =========================

  const duplicados = await validarJugadoresDuplicados(
    equipoId,
    torneoCategoriaId,
    inscripcionId,
  );

  if (!duplicados.valido) {
    return {
      valido: false,

      code: "JUGADORES_DUPLICADOS",

      message: "Existen jugadores que ya participan en esta competencia.",

      jugadores: duplicados.jugadores,
    };
  }

  // =========================
  // TODO CORRECTO
  // =========================

  return {
    valido: true,
    jugadores,
    torneoCategoria,
  };
};
