import Usuario from "./usuario.model.js";
import Torneo from "./torneo.model.js";
import Categoria from "./categoria.model.js";
import TorneoCategoria from "./torneoCategoria.model.js";
import Equipo from "./equipo.model.js";
import Delegado from "./delegado.model.js";
import Jugador from "./jugador.model.js";
import Inscripcion from "./inscripcion.model.js";
import InscripcionJugador from "./inscripcionJugador.model.js";
import Arbitro from "./arbitro.model.js";
import Sede from "./sede.model.js";
import Partido from "./partido.model.js";
import Sancion from "./sancion.model.js";
import Anuncio from "./anuncio.model.js";
import ImagenCarrusel from "./imagenCarrusel.model.js";
import Bienvenida from "./bienvenida.model.js";

// Relaciones

// 1 a 1 (hasOne o belongsTo)
// 1 a M (hasMany o belongsTo)
// M a N (belongsToMany)

// ATENCION! Siempre que creamos una relación desde un modelo, debemos generar
// la misma desde el otro con quien está relacionado. Si no lo hacemos,
// Sequelize no reconoce la asociación.

// Usuario - Equipo
Usuario.hasMany(Equipo, { foreignKey: "id_usuario_creador" }); // 1 USUARIO puede tener muchos EQUIPOS
Equipo.belongsTo(Usuario, { foreignKey: "id_usuario_creador" }); // 1 EQUIPO es creado por 1 USUARIO

// Torneo - Categoria (muchos a muchos)
Torneo.belongsToMany(Categoria, {
  through: TorneoCategoria,
  foreignKey: "torneo_id",
});

Categoria.belongsToMany(Torneo, {
  through: TorneoCategoria,
  foreignKey: "categoria_id",
});

// TorneoCategoria - Torneo
TorneoCategoria.belongsTo(Torneo, {
  foreignKey: "torneo_id",
  as: "torneo",
});

// TorneoCategoria - Categoria
TorneoCategoria.belongsTo(Categoria, {
  foreignKey: "categoria_id",
  as: "categoria",
});

// TorneoCategoria - Partido
TorneoCategoria.hasMany(Partido, {
  foreignKey: "torneo_categoria_id",
  as: "partidos",
});

// Equipo - Jugador
Equipo.hasMany(Jugador, {
  foreignKey: "equipo_id",
  as: "jugadores",
});

Jugador.belongsTo(Equipo, {
  foreignKey: "equipo_id",
  as: "equipo",
});

// Equipo - Inscripción
Equipo.hasMany(Inscripcion, { foreignKey: "equipo_id" });

Inscripcion.belongsTo(Equipo, { foreignKey: "equipo_id" });

// TorneoCategoria - Inscripción
TorneoCategoria.hasMany(Inscripcion, {
  foreignKey: "torneo_categoria_id",
  as: "inscripciones",
});

Inscripcion.belongsTo(TorneoCategoria, {
  foreignKey: "torneo_categoria_id",
  as: "torneoCategoria",
});

// =========================
// INSCRIPCION - JUGADORES
// HISTÓRICOS
// =========================

Inscripcion.hasMany(InscripcionJugador, {
  foreignKey: "inscripcion_id",
  as: "jugadores",
});

InscripcionJugador.belongsTo(Inscripcion, {
  foreignKey: "inscripcion_id",
  as: "inscripcion",
});

// =========================
// JUGADOR ORIGINAL
// =========================

Jugador.hasMany(InscripcionJugador, {
  foreignKey: "jugador_id",
  as: "participaciones",
});

InscripcionJugador.belongsTo(Jugador, {
  foreignKey: "jugador_id",
  as: "jugador",
});

// Partido
Partido.belongsTo(Inscripcion, {
  foreignKey: "inscripcion_local_id",
  as: "local",
});
Partido.belongsTo(Inscripcion, {
  foreignKey: "inscripcion_visitante_id",
  as: "visitante",
});
Partido.belongsTo(Sede, { foreignKey: "sede_id", as: "sede" });
Partido.belongsTo(Arbitro, { foreignKey: "arbitro_id", as: "arbitro" });
Partido.belongsTo(TorneoCategoria, {
  foreignKey: "torneo_categoria_id",
  as: "torneoCategoria",
});

// Sanción - Jugador
Sancion.belongsTo(Jugador, {
  foreignKey: "jugador_id",
  as: "jugador",
});

Jugador.hasMany(Sancion, {
  foreignKey: "jugador_id",
  as: "sanciones",
});

// Sanción - Partido
Sancion.belongsTo(Partido, {
  foreignKey: "partido_id",
  as: "partido",
});

Partido.hasMany(Sancion, {
  foreignKey: "partido_id",
  as: "sanciones",
});

// Usuario - Arbitro
Usuario.hasOne(Arbitro, {
  foreignKey: "usuario_id",
  as: "arbitro",
});

Arbitro.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario",
});

// Usuario - Delegado
Usuario.hasOne(Delegado, {
  foreignKey: "usuario_id",
  as: "delegado",
});

Delegado.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario",
});

export {
  Usuario,
  Torneo,
  Categoria,
  TorneoCategoria,
  Equipo,
  Delegado,
  Jugador,
  Inscripcion,
  InscripcionJugador,
  Arbitro,
  Sede,
  Partido,
  Sancion,
  Anuncio,
  ImagenCarrusel,
  Bienvenida,
};
