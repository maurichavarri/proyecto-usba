import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const EquipoDetalle = () => {
  const { id } = useParams();
  const [equipo, setEquipo] = useState(null);

  useEffect(() => {
    // Cargar detalle del equipo por ID
    const mockEquipo = {
      id: 1,
      nombre: "Los Fundadores",
      logo: "🏛️",
      ciudad: "Santiago del Estero",
      titulos: 3,
      categoria: "+30",
      fundacion: 2015,
      dt: "Carlos Pérez",
      jugadores: [
        { numero: 4, nombre: "Martín Gómez", posicion: "Base" },
        { numero: 5, nombre: "Lucas Fernández", posicion: "Escolta" },
      ]
    };
    setEquipo(mockEquipo);
  }, [id]);

  if (!equipo) return <div className="equipos-loading"><div className="spinner"></div></div>;

  return (
    <div className="equipos-page">
      <div className="volver-container">
        <Link to="/equipos" className="btn-volver">← Volver a Equipos</Link>
      </div>
      
      <div className="equipo-detalle-container">
        <div className="equipo-detalle-header">
          <div className="equipo-detalle-logo">{equipo.logo}</div>
          <h1>{equipo.nombre}</h1>
          <p>{equipo.ciudad} • {equipo.categoria}</p>
        </div>
        
        <div className="equipo-detalle-info">
          <div className="info-card">
            <h3>Información</h3>
            <p>🏆 {equipo.titulos} títulos</p>
            <p>📅 Fundado en {equipo.fundacion}</p>
            <p>👨‍🏫 DT: {equipo.dt}</p>
          </div>
          
          <div className="jugadores-card">
            <h3>Plantel</h3>
            <div className="jugadores-lista">
              {equipo.jugadores.map(j => (
                <div key={j.numero} className="jugador-item">
                  <span className="numero">#{j.numero}</span>
                  <span className="nombre">{j.nombre}</span>
                  <span className="posicion">{j.posicion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipoDetalle;