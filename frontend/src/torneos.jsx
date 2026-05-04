import { useState } from 'react';
import './torneos.css';
import { Link } from 'react-router-dom';

const partidos = [
  { id: 1, fecha: 'Sábado 19 Abr', hora: '10:00', local: 'Los Tigres', visitante: 'Club Atlético', cancha: 'Cancha 1', estado: 'proximo' },
  { id: 2, fecha: 'Sábado 19 Abr', hora: '12:00', local: 'Deportivo Norte', visitante: 'Básquet Sur', cancha: 'Cancha 2', estado: 'proximo' },
  { id: 3, fecha: 'Sábado 19 Abr', hora: '14:00', local: 'Los Pumas', visitante: 'Club Rivera', cancha: 'Cancha 1', estado: 'proximo' },
  { id: 4, fecha: 'Sábado 12 Abr', hora: '10:00', local: 'Los Tigres', visitante: 'Los Pumas', resultadoLocal: 72, resultadoVisitante: 65, cancha: 'Cancha 1', estado: 'jugado' },
  { id: 5, fecha: 'Sábado 12 Abr', hora: '12:00', local: 'Club Atlético', visitante: 'Deportivo Norte', resultadoLocal: 58, resultadoVisitante: 61, cancha: 'Cancha 2', estado: 'jugado' },
  { id: 6, fecha: 'Sábado 12 Abr', hora: '14:00', local: 'Básquet Sur', visitante: 'Club Rivera', resultadoLocal: 80, resultadoVisitante: 74, cancha: 'Cancha 1', estado: 'jugado' },
];

const posiciones = [
  { pos: 1, equipo: 'Los Tigres',      pj: 6, pg: 5, pp: 1, pf: 432, pc: 380 },
  { pos: 2, equipo: 'Deportivo Norte', pj: 6, pg: 4, pp: 2, pf: 410, pc: 395 },
  { pos: 3, equipo: 'Básquet Sur',     pj: 6, pg: 4, pp: 2, pf: 398, pc: 390 },
  { pos: 4, equipo: 'Club Atlético',   pj: 6, pg: 3, pp: 3, pf: 375, pc: 382 },
  { pos: 5, equipo: 'Los Pumas',       pj: 6, pg: 2, pp: 4, pf: 360, pc: 400 },
  { pos: 6, equipo: 'Club Rivera',     pj: 6, pg: 0, pp: 6, pf: 310, pc: 450 },
];

const Torneos = () => {
  const [tab, setTab] = useState('proximos');

  const filtrados = partidos.filter(p =>
    tab === 'proximos' ? p.estado === 'proximo' : p.estado === 'jugado'
  );

  return (
    <section className="torneos-section">
      <div className="torneos-container">
        <div className="torneos-hero">
          <span className="torneos-badge">Temporada 2026</span>
          <h1 className="torneos-titulo">Liga Principal</h1>
          <p className="torneos-sub">Santiago del Estero — Básquet Amateur</p>
        </div>

        {/* Partidos */}
        <div className="torneos-card">
          <div className="card-header">
            <h2 className="card-titulo">Partidos</h2>
            <div className="tabs">
              <button className={`tab ${tab === 'proximos' ? 'active' : ''}`} onClick={() => setTab('proximos')}>
                Próximos
              </button>
              <button className={`tab ${tab === 'jugados' ? 'active' : ''}`} onClick={() => setTab('jugados')}>
                Jugados
              </button>
            </div>
          </div>

          <div className="partidos-lista">
            {filtrados.map(p => (
              <div key={p.id} className="partido-item">
                <div className="partido-fecha">
                  <span className="fecha-dia">{p.fecha}</span>
                  <span className="fecha-hora">{p.hora}hs</span>
                </div>
                <div className="partido-equipos">
                  <span className={`equipo ${p.estado === 'jugado' && p.resultadoLocal > p.resultadoVisitante ? 'ganador' : ''}`}>
                    {p.local}
                  </span>
                  <div className="partido-centro">
                    {p.estado === 'jugado'
                      ? <span className="resultado">{p.resultadoLocal} — {p.resultadoVisitante}</span>
                      : <span className="vs">VS</span>
                    }
                  </div>
                  <span className={`equipo derecha ${p.estado === 'jugado' && p.resultadoVisitante > p.resultadoLocal ? 'ganador' : ''}`}>
                    {p.visitante}
                  </span>
                </div>
                <div className="partido-cancha">
                  <span>{p.cancha}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabla de posiciones */}
        <div className="torneos-card">
          <div className="card-header">
            <h2 className="card-titulo">Tabla de Posiciones</h2>
          </div>
          <div className="tabla-wrap">
            <table className="tabla-posiciones">
              <thead>
                <tr>
                  <th>#</th>
                  <th className="th-equipo">Equipo</th>
                  <th>PJ</th>
                  <th>PG</th>
                  <th>PP</th>
                  <th>PF</th>
                  <th>PC</th>
                  <th>DIF</th>
                </tr>
              </thead>
              <tbody>
                {posiciones.map(p => (
                  <tr key={p.pos} className={p.pos <= 2 ? 'clasificado' : ''}>
                    <td className="td-pos">
                      <span className={`pos-badge ${p.pos <= 2 ? 'top' : ''}`}>{p.pos}</span>
                    </td>
                    <td className="td-equipo">{p.equipo}</td>
                    <td>{p.pj}</td>
                    <td className="td-pg">{p.pg}</td>
                    <td>{p.pp}</td>
                    <td>{p.pf}</td>
                    <td>{p.pc}</td>
                    <td className={p.pf - p.pc >= 0 ? 'positivo' : 'negativo'}>
                      {p.pf - p.pc > 0 ? '+' : ''}{p.pf - p.pc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="tabla-leyenda">🟠 Clasificados a siguiente fase</p>
        </div>

      </div>
    </section>
  );
};

export default Torneos;
