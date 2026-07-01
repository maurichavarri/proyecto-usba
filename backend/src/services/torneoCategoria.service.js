import { TorneoCategoria, Torneo, Categoria, Inscripcion, Partido } from '../models/index.js';
import { obtenerCampeonYSubcampeon } from './campeon.service.js';

export const getDetalleTorneoCategoria = async (torneoCategoriaId) => {

  const torneoCategoria = await TorneoCategoria.findByPk(torneoCategoriaId,
    {
      include: [
        {
          model: Torneo,
          as: 'torneo',
          attributes: ['id', 'nombre']
        },
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id', 'nombre']
        }
      ]
    }
  );

  if (!torneoCategoria) {
    throw new Error('Torneo-Categoría no encontrado');
  }

  const equiposInscriptos = await Inscripcion.count({
    where: {
      torneo_categoria_id: torneoCategoriaId,
      estado: 'confirmado'
    }
  });

  const partidosGenerados = await Partido.count({
    where: {
      torneo_categoria_id: torneoCategoriaId
    }
  });

  const partidosJugados = await Partido.count({
    where: {
      torneo_categoria_id: torneoCategoriaId,
      estado: 'jugado'
    }
  });

  const jornadas = await Partido.max(
    'jornada',
    {
      where: {
        torneo_categoria_id: torneoCategoriaId
      }
    }
  );

  let podio = null;

  if (torneoCategoria.estado_competencia === 'finalizado') {
    podio = await obtenerCampeonYSubcampeon(torneoCategoriaId, torneoCategoria.formato_competencia);
  }

  return {
    id: torneoCategoria.id,
    torneo: torneoCategoria.torneo,
    categoria: torneoCategoria.categoria,
    arancel: torneoCategoria.arancel,
    formato_competencia: torneoCategoria.formato_competencia,
    estado_competencia: torneoCategoria.estado_competencia,
    equipos_inscriptos: equiposInscriptos,
    partidos_generados: partidosGenerados,
    partidos_jugados: partidosJugados,
    jornadas: jornadas || 0,
    campeon: podio?.campeon || null,
    subcampeon: podio?.subcampeon || null
  };
};