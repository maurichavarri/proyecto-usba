import Usuario from './usuario.model.js';
import Torneo from './torneo.model.js';
import Categoria from './categoria.model.js';
import TorneoCategoria from './torneoCategoria.model.js';
import Equipo from './equipo.model.js';
import Jugador from './jugador.model.js';
import Inscripcion from './inscripcion.model.js';
import Arbitro from './arbitro.model.js';
import Sede from './sede.model.js';
import Partido from './partido.model.js';
import Sancion from './sancion.model.js';

// Relaciones
// hasMany → “uno tiene muchos”
// belongsTo → “muchos pertenecen a uno”
// belongsToMany → “muchos a muchos”

// Torneo - Categoria (muchos a muchos)
Torneo.belongsToMany(Categoria, {
  through: TorneoCategoria,
  foreignKey: 'torneo_id'
});

Categoria.belongsToMany(Torneo, {
  through: TorneoCategoria,
  foreignKey: 'categoria_id'
});

// Usuario - Equipo
Usuario.hasMany(Equipo, { foreignKey: 'id_usuario_creador' });
Equipo.belongsTo(Usuario, { foreignKey: 'id_usuario_creador' });

// Equipo - Jugador
Equipo.hasMany(Jugador, { foreignKey: 'equipo_id' });
Jugador.belongsTo(Equipo, { foreignKey: 'equipo_id' });

// Equipo - Inscripción
Equipo.hasMany(Inscripcion, { foreignKey: 'equipo_id' });
Inscripcion.belongsTo(Equipo, { foreignKey: 'equipo_id' });

// TorneoCategoria - Inscripción
TorneoCategoria.hasMany(Inscripcion, { foreignKey: 'torneo_categoria_id' });
Inscripcion.belongsTo(TorneoCategoria, { foreignKey: 'torneo_categoria_id' });

// Partido
Partido.belongsTo(Inscripcion, { as: 'local', foreignKey: 'inscripcion_local_id' });
Partido.belongsTo(Inscripcion, { as: 'visitante', foreignKey: 'inscripcion_visitante_id' });

Partido.belongsTo(Sede, { foreignKey: 'sede_id' });
Partido.belongsTo(Arbitro, { foreignKey: 'arbitro_id' });

// Sanción
Sancion.belongsTo(Jugador, { foreignKey: 'jugador_id' });
Sancion.belongsTo(Partido, { foreignKey: 'partido_id' });


export {
  Usuario,
  Torneo,
  Categoria,
  TorneoCategoria,
  Equipo,
  Jugador,
  Inscripcion,
  Arbitro,
  Sede,
  Partido,
  Sancion
};