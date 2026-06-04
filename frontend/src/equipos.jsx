import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const Equipos = () => {
  const { categoriaId, torneoId } = useParams();
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [titulo, setTitulo] = useState('Equipos');

  useEffect(() => {
    setLoading(true);
    
    // Determinar qué tipo de vista es
    if (categoriaId) {
      // Cargar equipos por categoría
      setTitulo('Equipos de la Categoría');
      // Simular API call - Reemplazar con tu endpoint real
      const mockEquipos = [
        { id: 1, nombre: "Los Fundadores", logo: "🏛️", ciudad: "Santiago del Estero", titulos: 3, categoria: "+30", fundacion: 2015 },
        { id: 2, nombre: "Veteranos del Norte", logo: "🌵", ciudad: "La Banda", titulos: 1, categoria: "+30", fundacion: 2018 },
        { id: 3, nombre: "Pirates BBC", logo: "🏴‍☠️", ciudad: "Termas de Río Hondo", titulos: 0, categoria: "+30", fundacion: 2020 },
      ];
      setEquipos(mockEquipos);
      setLoading(false);
    } 
    else if (torneoId) {
      // Cargar equipos por torneo
      setTitulo('Equipos Participantes');
      // Simular API call - Reemplazar con tu endpoint real
      const mockEquipos = [
        { id: 1, nombre: "Los Fundadores", logo: "🏛️", ciudad: "Santiago del Estero", pj: 4, pg: 4, pp: 0, puntos: 8 },
        { id: 2, nombre: "Veteranos del Norte", logo: "🌵", ciudad: "La Banda", pj: 4, pg: 3, pp: 1, puntos: 6 },
        { id: 5, nombre: "Masters del Sur", logo: "🧙‍♂️", ciudad: "Santiago del Estero", pj: 4, pg: 2, pp: 2, puntos: 4 },
      ];
      setEquipos(mockEquipos);
      setLoading(false);
    }
    else {
      // Cargar todos los equipos
      setTitulo('Todos los Equipos');
      const mockEquipos = [
        { id: 1, nombre: "Los Fundadores", logo: "🏛️", ciudad: "Santiago del Estero", titulos: 3, categoria: "+30" },
        { id: 2, nombre: "Veteranos del Norte", logo: "🌵", ciudad: "La Banda", titulos: 1, categoria: "+30" },
        { id: 3, nombre: "Pirates BBC", logo: "🏴‍☠️", ciudad: "Termas de Río Hondo", titulos: 0, categoria: "+30" },
        { id: 4, nombre: "Leyendas Santiagueñas", logo: "👑", ciudad: "Clodomira", titulos: 5, categoria: "+30" },
        { id: 5, nombre: "Masters del Sur", logo: "🧙‍♂️", ciudad: "Santiago del Estero", titulos: 4, categoria: "+35" },
        { id: 6, nombre: "Corazón de Bastón", logo: "❤️", ciudad: "Fernández", titulos: 2, categoria: "+35" },
      ];
      setEquipos(mockEquipos);
      setLoading(false);
    }
  }, [categoriaId, torneoId]);

  if (loading) {
    return (
      <div className="equipos-loading">
        <div className="spinner"></div>
        <p>Cargando equipos...</p>
      </div>
    );
  }

  return (
    <div className="equipos-page">
      {/* Hero Section */}
      <section className="hero-section-equipos">
        <div className="hero-content-equipos">
          <span className="hero-badge-equipos">USBA · 2026</span>
          <h1 className="hero-titulo-equipos">{titulo}</h1>
          <p className="hero-subtitulo-equipos">
            {categoriaId && `Categoría con tradición y pasión`}
            {torneoId && `Equipos que compiten en este torneo`}
            {!categoriaId && !torneoId && `Liga Amateur de Básquet de Santiago del Estero`}
          </p>
          <div className="hero-stats-equipos">
            <div className="stat-equipo">
              <span className="stat-numero-equipo">{equipos.length}</span>
              <span className="stat-label-equipo">Equipos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros por categoría (solo en vista general) */}
      {!categoriaId && !torneoId && (
        <div className="filtros-categoria">
          <Link to="/equipos" className="filtro-link active">Todos</Link>
          <Link to="/equipos/categoria/30" className="filtro-link">+30</Link>
          <Link to="/equipos/categoria/35" className="filtro-link">+35</Link>
        </div>
      )}

      {/* Botón volver */}
      {(categoriaId || torneoId) && (
        <div className="volver-container">
          <Link to={categoriaId ? "/categorias" : "/torneos"} className="btn-volver">
            ← Volver
          </Link>
        </div>
      )}

      {/* Vista de equipos (grilla) */}
      {!torneoId && (
        <div className="equipos-grid-container">
          <div className="equipos-grid">
            {equipos.map(equipo => (
              <div key={equipo.id} className="equipo-card">
                <div className="equipo-card-header">
                  <div className="equipo-logo">{equipo.logo}</div>
                  {equipo.titulos !== undefined && (
                    <div className="equipo-titulos-badge">
                      🏆 {equipo.titulos} {equipo.titulos === 1 ? 'título' : 'títulos'}
                    </div>
                  )}
                </div>
                <div className="equipo-card-body">
                  <h3 className="equipo-nombre">{equipo.nombre}</h3>
                  <p className="equipo-ciudad">📍 {equipo.ciudad}</p>
                  {equipo.categoria && (
                    <span className="equipo-categoria-badge">{equipo.categoria}</span>
                  )}
                  {equipo.fundacion && (
                    <p className="equipo-fundacion">📅 Fundado en {equipo.fundacion}</p>
                  )}
                </div>
                <div className="equipo-card-footer">
                  <Link to={`/equipo/${equipo.id}`} className="btn-ver-equipo">
                    Ver Detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vista de equipos en torneo (tabla) */}
      {torneoId && (
        <div className="equipos-tabla-container">
          <div className="tabla-equipos-wrapper">
            <table className="tabla-equipos-torneo">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Equipo</th>
                  <th>Ciudad</th>
                  <th>PJ</th>
                  <th>PG</th>
                  <th>PP</th>
                  <th>Puntos</th>
                </tr>
              </thead>
              <tbody>
                {equipos.map((equipo, index) => (
                  <tr key={equipo.id}>
                    <td>{index + 1}</td>
                    <td>
                      <span className="equipo-logo-mini">{equipo.logo}</span>
                      {equipo.nombre}
                    </td>
                    <td>{equipo.ciudad}</td>
                    <td>{equipo.pj}</td>
                    <td>{equipo.pg}</td>
                    <td>{equipo.pp}</td>
                    <td className="puntos-equipo">{equipo.puntos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipos;