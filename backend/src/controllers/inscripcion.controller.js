import {
  Equipo,
  Jugador,
  Inscripcion,
  TorneoCategoria,
  Torneo,
  Categoria,
} from "../models/index.js";
import { validarJugadoresDuplicados } from "../services/validarJugadoresDuplicados.service.js";
import { plantelBloqueado } from "../services/plantelBloqueado.service.js";
import { obtenerFechaActualArgentina } from "../utils/fecha.utils.js";

const calcularEdadEnFecha = (fechaNacimiento, fechaReferencia) => {
  if (!fechaNacimiento || !fechaReferencia) {
    return null;
  }

  const [anioNacimiento, mesNacimiento, diaNacimiento] = String(fechaNacimiento)
    .split("T")[0]
    .split("-")
    .map(Number);
  const [anioReferencia, mesReferencia, diaReferencia] = String(fechaReferencia)
    .split("T")[0]
    .split("-")
    .map(Number);

  if (
    [
      anioNacimiento,
      mesNacimiento,
      diaNacimiento,
      anioReferencia,
      mesReferencia,
      diaReferencia,
    ].some((valor) => Number.isNaN(valor))
  ) {
    return null;
  }

  let edad = anioReferencia - anioNacimiento;

  if (
    mesReferencia < mesNacimiento ||
    (mesReferencia === mesNacimiento && diaReferencia < diaNacimiento)
  ) {
    edad--;
  }

  return edad;
};

// DELEGADO
export const crearInscripcion = async (req, res, next) => {
  try {
    const { equipo_id, torneo_categoria_id } = req.body;

    const usuarioId = req.usuario.id;

    // =========================
    // BUSCAR EQUIPO
    // =========================

    const equipo = await Equipo.findByPk(equipo_id);

    if (!equipo) {
      return res.status(404).json({
        message: "Equipo no encontrado",
      });
    }

    // =========================
    // OWNERSHIP
    // =========================

    if (equipo.id_usuario_creador !== usuarioId) {
      return res.status(403).json({
        message: "No autorizado",
      });
    }

    // =========================
    // TORNEO - CATEGORÍA
    // =========================

    const torneoCategoria = await TorneoCategoria.findByPk(
      torneo_categoria_id,
      {
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
      },
    );

    if (!torneoCategoria) {
      return res.status(404).json({
        message: "Torneo categoría no encontrado",
      });
    }

    // =========================
    // FIXTURE GENERADO
    // =========================

    if (torneoCategoria.fixture_generado) {
      return res.status(400).json({
        message:
          "Las inscripciones están cerradas porque el fixture ya fue generado",
      });
    }

    // =========================
    // VALIDAR FECHAS
    // =========================

    const torneo = torneoCategoria.torneo;

    const categoria = torneoCategoria.categoria;

    const hoy = obtenerFechaActualArgentina();

    const fechaInicio = torneo.fecha_inicio;

    const fechaCierre = torneo.fecha_cierre_inscripcion;

    if (hoy >= fechaInicio) {
      return res.status(400).json({
        message: "El torneo ya comenzó y/o finalizó",
      });
    }

    if (hoy > fechaCierre) {
      return res.status(400).json({
        message: "El período de inscripción finalizó",
      });
    }

    // =========================
    // BUSCAR JUGADORES
    // =========================

    const jugadores = await Jugador.findAll({
      where: {
        equipo_id,
      },
    });

    // =========================
    // CANTIDAD DE JUGADORES
    // =========================

    const cantidadJugadores = jugadores.length;

    if (cantidadJugadores === 0) {
      return res.status(400).json({
        message: "El equipo no posee jugadores.",
      });
    }

    if (cantidadJugadores < 5) {
      return res.status(400).json({
        message: "El equipo debe tener al menos 5 jugadores.",
      });
    }

    if (cantidadJugadores > 12) {
      return res.status(400).json({
        message: "El equipo no puede tener más de 12 jugadores.",
      });
    }

    // =========================
    // INSCRIPCIÓN PREVIA
    // =========================

    const existeInscripcion = await Inscripcion.findOne({
      where: {
        equipo_id,
        torneo_categoria_id,
      },
    });

    if (existeInscripcion) {
      return res.status(400).json({
        message: "El equipo ya está inscripto",
      });
    }

    // =========================
    // JUGADORES REPETIDOS
    // =========================

    const resultado = await validarJugadoresDuplicados(
      equipo_id,
      torneo_categoria_id,
    );

    if (!resultado.valido) {
      return res.status(400).json({
        code: "JUGADORES_DUPLICADOS",

        message:
          "No es posible registrar la inscripción porque existen jugadores que ya participan en esta competencia.",

        jugadores: resultado.jugadores,
      });
    }

    // =========================
    // VALIDAR CONFIGURACIÓN
    // DE LA CATEGORÍA
    // =========================

    if (
      !categoria ||
      categoria.edad_minima === null ||
      categoria.edad_minima === undefined ||
      categoria.edad_maxima === null ||
      categoria.edad_maxima === undefined ||
      !categoria.sexo
    ) {
      return res.status(400).json({
        code: "CATEGORIA_INCOMPLETA",

        message:
          "La categoría no posee configurados correctamente los requisitos de edad y sexo.",
      });
    }

    // =========================
    // VALIDAR JUGADORES
    // CONTRA LA CATEGORÍA
    // =========================

    const jugadoresNoAptos = [];

    for (const jugador of jugadores) {
      const motivos = [];

      let edad = null;

      // -------------------------
      // FECHA DE NACIMIENTO
      // -------------------------

      if (!jugador.fecha_nacimiento) {
        motivos.push("No tiene cargada la fecha de nacimiento.");
      } else {
        edad = calcularEdadEnFecha(
          jugador.fecha_nacimiento,
          torneo.fecha_inicio,
        );

        if (edad === null) {
          motivos.push("La fecha de nacimiento no es válida.");
        } else if (
          edad < categoria.edad_minima ||
          edad > categoria.edad_maxima
        ) {
          motivos.push(
            `Tiene ${edad} años al inicio del torneo. La categoría permite jugadores de ${categoria.edad_minima} a ${categoria.edad_maxima} años.`,
          );
        }
      }

      // -------------------------
      // SEXO
      // -------------------------

      if (!jugador.sexo) {
        motivos.push("No tiene cargado el sexo.");
      } else if (jugador.sexo !== categoria.sexo) {
        motivos.push(
          `El jugador figura como ${jugador.sexo}, pero la categoría es ${categoria.sexo}.`,
        );
      }

      // -------------------------
      // AGREGAR JUGADOR OBSERVADO
      // -------------------------

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

    // =========================
    // RECHAZAR INSCRIPCIÓN
    // =========================

    if (jugadoresNoAptos.length > 0) {
      const bloqueado = await plantelBloqueado(equipo_id);

      return res.status(400).json({
        code: "JUGADORES_NO_APTOS",

        message:
          "El plantel posee jugadores que no cumplen los requisitos de la categoría.",

        requisitos: {
          edad_minima: categoria.edad_minima,

          edad_maxima: categoria.edad_maxima,

          sexo: categoria.sexo,
        },

        puede_editar_plantel: !bloqueado,

        jugadores: jugadoresNoAptos,
      });
    }

    // =========================
    // VALIDAR DORSALES
    // =========================

    const dorsales = jugadores.map((jugador) => jugador.dorsal);

    const repetidos = dorsales.filter(
      (dorsal, index) => dorsales.indexOf(dorsal) !== index,
    );

    if (repetidos.length > 0) {
      return res.status(400).json({
        message: "Existen dorsales duplicados dentro del equipo.",
      });
    }

    // =========================
    // CREAR INSCRIPCIÓN
    // =========================

    const inscripcion = await Inscripcion.create({
      equipo_id,

      torneo_categoria_id,

      fecha: new Date(),

      estado: "pendiente",
    });

    res.status(201).json(inscripcion);
  } catch (error) {
    next(error);
  }
};

export const obtenerMisInscripciones = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const inscripciones = await Inscripcion.findAll({
      include: [
        {
          model: Equipo,
          where: {
            id_usuario_creador: usuarioId,
          },
        },
        {
          model: TorneoCategoria,
          as: "torneoCategoria",
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
        },
      ],
    });

    res.json(inscripciones);
  } catch (error) {
    next(error);
  }
};

// ADMIN
export const getInscripciones = async (req, res, next) => {
  try {
    const inscripciones = await Inscripcion.findAll({
      include: [
        {
          model: Equipo,
          attributes: ["id", "nombre"],
        },
        {
          model: TorneoCategoria,
          as: "torneoCategoria",
          include: [
            {
              model: Torneo,
              as: "torneo",
              attributes: ["id", "nombre"],
            },
            {
              model: Categoria,
              as: "categoria",
              attributes: ["id", "nombre"],
            },
          ],
        },
      ],
      order: [["fecha", "DESC"]],
    });

    res.json(inscripciones);
  } catch (error) {
    next(error);
  }
};

export const cambiarEstadoInscripcion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const inscripcion = await Inscripcion.findByPk(id);

    // Si el administrador quiere CONFIRMAR la inscripción
    if (estado === "confirmado") {
      const resultado = await validarJugadoresDuplicados(
        inscripcion.equipo_id,
        inscripcion.torneo_categoria_id,
        inscripcion.id,
      );

      if (!resultado.valido) {
        return res.status(400).json({
          message:
            "No es posible confirmar la inscripción porque existen jugadores que ya participan en esta competencia.",
          jugadores: resultado.jugadores,
        });
      }
    }

    if (!inscripcion) {
      return res.status(404).json({
        message: "Inscripción no encontrada",
      });
    }

    await inscripcion.update({ estado });

    res.json({
      message: "Estado actualizado",
    });
  } catch (error) {
    next(error);
  }
};
