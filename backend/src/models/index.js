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

// 1 a 1 (hasOne o belongsTo)
// 1 a M (hasMany o belongsTo)
// M a N (belongsToMany)

// ATENCION! Siempre que creamos una relación desde un modelo, debemos generar
// la misma desde el otro con quien está relacionado. Si no lo hacemos, 
// Sequelize no reconoce la asociación.

// Usuario - Equipo
Usuario.hasMany(Equipo, { foreignKey: 'id_usuario_creador' });   // 1 USUARIO puede tener muchos EQUIPOS
Equipo.belongsTo(Usuario, { foreignKey: 'id_usuario_creador' }); // 1 EQUIPO es creado por 1 USUARIO 

// Torneo - Categoria (muchos a muchos)
Torneo.belongsToMany(Categoria, {
  through: TorneoCategoria,
  foreignKey: 'torneo_id'
});

Categoria.belongsToMany(Torneo, {
  through: TorneoCategoria,
  foreignKey: 'categoria_id'
});

// TorneoCategoria - Torneo
TorneoCategoria.belongsTo(Torneo, { foreignKey: 'torneo_id' });

// TorneoCategoria - Categoria
TorneoCategoria.belongsTo(Categoria, { foreignKey: 'categoria_id' });

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