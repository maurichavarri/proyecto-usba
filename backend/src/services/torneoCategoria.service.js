import { TorneoCategoria, Inscripcion, Equipo, Partido } from '../models/index.js';

export const getDetalleTorneoCategoria = async (torneoCategoriaId) => {

  // 1. Traer categoría
  const categoria = await TorneoCategoria.findByPk(torneoCategoriaId);

  if (!categoria) throw new Error('No existe');

  // 2. Equipos (inscripciones)
  const equipos = await Inscripcion.findAll({
    where: {
      torneo_categoria_id: torneoCategoriaId,
      estado: 'confirmado'
    },
    include: {
      model: Equipo,
      attributes: ['id', 'nombre']
    }
  });

  // 3. Fixture (partidos)
  const fixture = await Partido.findAll({
    where: {
      torneo_categoria_id: torneoCategoriaId
    },
    include: [
      { association: 'local', include: [Equipo] },
      { association: 'visitante', include: [Equipo] }
    ],
    order: [['fecha', 'ASC']]
  });

  // 4. Tabla (la vamos a calcular después)
  const tabla = []; // placeholder

  return {
    categoria,
    equipos,
    fixture,
    tabla
  };
};