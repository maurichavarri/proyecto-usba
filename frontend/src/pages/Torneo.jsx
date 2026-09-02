import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import img from "../assets/img/pelota-basquet.jpeg";

const ESTADO_LABEL = {
    configuracion: "Configuración",
    en_curso: "En curso",
    finalizado: "Finalizado",
};

const FORMATO_LABEL = {
    solo_liga: "Liga",
    playoff_4: "Liga + Play-Off (4)",
    playoff_8: "Liga + Play-Off (8)",
};

const Torneo = () => {

    const { data } = useFetch("http://localhost:3000/api/v1/torneos");
    const [torneoExpandido, setTorneoExpandido] = useState(null);
    const toggleTorneo = (id) => {
        setTorneoExpandido(torneoExpandido === id ? null : id);
    };

    const obtenerFormato = (formato) => {
        if (formato === "solo_liga") {
            return "Liga";
        }

        if (formato === "playoff_4") {
            return "Liga + Play-Off (4)";
        }

        if (formato === "playoff_8") {
            return "Liga + Play-Off (8)";
        }

        return "-";
    };


    const obtenerEstado = (estado) => {
        if (estado === "en_curso") {
            return {
                texto: "En curso",
                color: "#69db7c"
            };
        }

        if (estado === "finalizado") {
            return {
                texto: "Finalizado",
                color: "#ffffff"
            };
        }

        return {
            texto: "Próximamente",
            color: "rgba(255,255,255,0.4)"
        };
    };


    return (
        <>
            {/* HERO DEPORTIVO */}
            <section className="tor-hero">
                <div className="container tor-hero-inner">
                    <span className="tor-hero-eyebrow text-light">USBA · Básquet Amateur</span>
                    <h1 className="tor-hero-title">Torneos en competencia</h1>
                    <p className="tor-hero-sub text-light">
                        Temporada regular, categorías y play-offs. Tocá un torneo
                        para ver sus divisiones y el estado de cada una.
                    </p>
                </div>
            </section>

            {/* LISTA */}
            <section className="tor-section">
                <div className="container">
                    {data.length === 0 ? (
                        <p className="text-muted">No hay torneos disponibles.</p>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {data.map((torneo) => {
                                const totalCategorias = torneo.categorias?.length || 0;
                                const totalEquipos = (torneo.categorias || []).reduce(
                                    (acc, c) => acc + (c.equipos || 0),
                                    0
                                );
                                const expandido = torneoExpandido === torneo.id;

                                return (
                                    <div key={torneo.id} className="tor-card">
                                        <div
                                            className="tor-card-top"
                                            role="button"
                                            onClick={() => toggleTorneo(torneo.id)}
                                        >
                                            <div className="tor-card-img-wrap">
                                                <img src={img} alt={torneo.nombre} />
                                            </div>

                                            <div className="tor-card-main">
                                                <span className="tor-card-label">Torneo</span>
                                                <h3 className="tor-card-title">{torneo.nombre}</h3>
                                                <div className="tor-card-stats">
                                                    <span>
                                                        <strong>{totalCategorias}</strong>
                                                        categorías
                                                    </span>
                                                    <span>
                                                        <strong>{totalEquipos}</strong>
                                                        equipos
                                                    </span>
                                                </div>
                                            </div>

                                            <div
                                                className={`tor-card-toggle-icon ${expandido ? "up" : ""}`}
                                            >
                                                ▼
                                            </div>
                                        </div>

                                        <div className={`collapse ${expandido ? "show" : ""}`}>
                                            <div className="tor-card-body">
                                                {totalCategorias === 0 ? (
                                                    <p className="text-muted mb-0 pt-3">
                                                        No hay categorías disponibles.
                                                    </p>
                                                ) : (
                                                    torneo.categorias.map((categoria) => (
                                                        <Link
                                                            key={categoria.id}
                                                            to={
                                                                categoria.estado === "configuracion"
                                                                    ? "#"
                                                                    : `/torneos/${categoria.id}`
                                                            }
                                                            onClick={(e) => {
                                                                if (categoria.estado === "configuracion") {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                            className={`tor-cat-row ${
                                                                categoria.estado === "configuracion"
                                                                    ? "disabled"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <div>
                                                                <div className="tor-cat-name">
                                                                    {categoria.nombre}
                                                                </div>
                                                                <div className="tor-cat-meta">
                                                                    {categoria.equipos} equipos
                                                                    {" • "}
                                                                    {FORMATO_LABEL[categoria.formato]}
                                                                </div>
                                                            </div>

                                                            <span
                                                                className={`tor-cat-badge ${categoria.estado}`}
                                                            >
                                                                {ESTADO_LABEL[categoria.estado]}
                                                            </span>
                                                        </Link>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <h2>🏆 Torneos</h2>
        <div className="alert alert-danger">
          <h5>❌ Error al cargar torneos</h5>
          <p>{error}</p>
          <button 
            className="btn btn-primary mt-2"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🏆 Torneos</h2>
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate('/categorias')}
        >
          ← Volver
        </button>
      </div>

      {/* Mostrar estado del usuario */}
      <div className="mb-3">
        {isAuthenticated() ? (
          <span className="badge bg-success">
            ✅ Usuario autenticado {isDelegado() ? '(Delegado)' : '(Jugador)'}
          </span>
        ) : (
          <span className="badge bg-warning text-dark">
            ⚠️ No has iniciado sesión
          </span>
        )}
      </div>
      
      {torneos.length === 0 ? (
        <div className="alert alert-info">
          <p>No hay torneos disponibles para esta categoría.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/categorias')}
          >
            Ver categorías
          </button>
        </div>
      ) : (
        <div className="row">
          {torneos.map((torneo) => (
            <div className="col-md-4 mb-3" key={torneo.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{torneo.nombre}</h5>
                  <p className="card-text">
                    📅 {torneo.fecha}<br />
                    📍 {torneo.ubicacion}<br />
                    👥 {torneo.equipos} equipos
                  </p>
                  <span className={`badge bg-${torneo.estado === 'activo' ? 'success' : 'warning'}`}>
                    {torneo.estado?.toUpperCase() || 'PENDIENTE'}
                  </span>
                  <button 
                    className="btn btn-success w-100 mt-2"
                    onClick={() => handleInscribirEquipo(torneo)}
                  >
                    📝 Inscribir Equipo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de validación */}
      {showModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '450px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <div className="modal-header" style={{
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '50px', marginBottom: '10px' }}>⛔</div>
              <h3 style={{ color: '#dc3545' }}>Acceso Restringido</h3>
            </div>
            
            <div className="modal-body" style={{
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <p style={{ fontSize: '16px', color: '#333' }}>
                <strong>Solo puede registrar quipos el Delegado o Administrador</strong>
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Para inscribir un equipo en este torneo, necesitas ser un Delegado o Administrador autorizado .
                {!isAuthenticated() && ' Inicia sesión o regístrate para continuar.'}
              </p>
              {torneoSeleccionado && (
                <p style={{ fontSize: '14px', color: '#667eea', marginTop: '10px' }}>
                  Torneo: <strong>{torneoSeleccionado.nombre}</strong>
                </p>
              )}
            </div>
            
            <div className="modal-footer" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <button 
                className="btn btn-primary w-100"
                onClick={handleRedirectToLogin}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #eb8a22 0%, #bb8828 100%)',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                {isAuthenticated() ? '🔑 Ir al Login' : '🔑 Iniciar Sesión / Registrarse'}
              </button>
              
              <button 
                className="btn btn-secondary w-100"
                onClick={handleCloseModal}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  background: 'white',
                  color: '#666',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estilos para la animación del modal */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );


export default Torneo;