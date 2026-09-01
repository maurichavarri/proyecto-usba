import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Torneo = () => {
  const { categoriaId } = useParams();
  const navigate = useNavigate();
  console.log("✅ Torneo renderizando, categoriaId:", categoriaId);

  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para el modal
  const [showModal, setShowModal] = useState(false);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);

  // Verificar si el usuario está logueado y es delegado
  const isDelegado = () => {
    const user = localStorage.getItem('user');
    if (!user) return false;
    
    try {
      const userData = JSON.parse(user);
      return userData.rol === 'delegado' || userData.rol === 'admin';
    } catch (e) {
      return false;
    }
  };

  // Verificar si el usuario está logueado
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  useEffect(() => {
    console.log("🔄 useEffect Torneo ejecutándose...");
    
    const fetchTorneos = async () => {
      try {
        console.log("📡 Fetching torneos...");
        const url = `http://localhost:3000/api/v1/torneos?categoriaId=${categoriaId || 1}`;
        console.log("📡 URL:", url);
        
        const response = await fetch(url);
        console.log("📡 Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("📦 Torneos recibidos:", data);
        setTorneos(data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTorneos();
  }, [categoriaId]);

  // Manejar clic en inscribir equipo
  const handleInscribirEquipo = (torneo) => {
    // Verificar si el usuario es delegado
    if (!isDelegado()) {
      setTorneoSeleccionado(torneo);
      setShowModal(true);
      return;
    }
    
    // Si es delegado, proceder con la inscripción
    alert('✅ Como delegado, puedes inscribir equipos en este torneo');
    // Aquí iría la lógica de inscripción
    // navigate(`/inscripcion-equipo/${torneo.id}`);
  };

  // Manejar la redirección al login
  const handleRedirectToLogin = () => {
    setShowModal(false);
    // Guardar el torneo seleccionado para redirigir después del login
    localStorage.setItem('torneoDestino', JSON.stringify(torneoSeleccionado));
    navigate('/auth/ingresar');
};

  // Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setTorneoSeleccionado(null);
  };

  if (loading) {
    return (
        <section className="container mt-5 mb-5">
            <div className="col-lg-10 mx-auto">
                <h2 className="mb-3">
                    Torneos
                </h2>
                {
                    data.length === 0 ?
                        (
                            <p>
                                No hay torneos disponibles.
                            </p>
                        )
                        :
                        (
                            <div className="row g-4">
                                {
                                    data.map((torneo) => (
                                        <div
                                            key={torneo.id}
                                            className="col-12 col-md-6 col-lg-4"
                                        >
                                            <div
                                                style={{ cursor: "pointer" }}
                                                onClick={() => toggleTorneo(torneo.id)}
                                            >
                                                <Card
                                                    titulo={torneo.nombre}
                                                    imagen={img}
                                                    descripcion={
                                                        <>
                                                            Ver categorías{" "}
                                                            <span className="ms-1">
                                                                {
                                                                    torneoExpandido === torneo.id
                                                                        ? "▲"
                                                                        : "▼"
                                                                }
                                                            </span>
                                                        </>
                                                    }
                                                />
                                            </div>

                                            <div
                                                className={`collapse overflow-hidden ${torneoExpandido === torneo.id
                                                    ? "show"
                                                    : ""
                                                    }`}
                                            >

                                                <div className="card border-0 shadow-sm mt-2">
                                                    <div className="card-body">
                                                        <h6 className="mb-3">
                                                            Categorías
                                                        </h6>
                                                        {
                                                            torneo.categorias.length === 0 ?
                                                                (
                                                                    <p className="text-muted mb-0">
                                                                        No hay categorías disponibles.
                                                                    </p>
                                                                )

                                                                :

                                                                (
                                                                    <div className="list-group">
                                                                        {
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
                                                                                    className={`list-group-item d-flex justify-content-between align-items-center ${categoria.estado === "configuracion"
                                                                                        ? "disabled bg-light text-muted"
                                                                                        : "list-group-item-action"
                                                                                        }`}
                                                                                >
                                                                                    <div>
                                                                                        <strong>
                                                                                            {categoria.nombre}
                                                                                        </strong>

                                                                                        <br />

                                                                                        <small className="text-muted">
                                                                                            {categoria.equipos} equipos
                                                                                            {" • "}
                                                                                            {
                                                                                                categoria.formato === "solo_liga"
                                                                                                    ? "Liga"
                                                                                                    : categoria.formato === "playoff_4"
                                                                                                        ? "Liga + Play-Off (4)"
                                                                                                        : "Liga + Play-Off (8)"
                                                                                            }
                                                                                        </small>
                                                                                    </div>

                                                                                    <span
                                                                                        className={`badge ${categoria.estado === "finalizado"
                                                                                            ? "bg-success"

                                                                                            : categoria.estado === "en_curso"
                                                                                                ? "bg-primary"

                                                                                                : "bg-secondary"
                                                                                            }`}
                                                                                    >
                                                                                        {
                                                                                            categoria.estado === "configuracion"
                                                                                                ? "Configuración"
                                                                                                : categoria.estado === "en_curso"
                                                                                                    ? "En curso"
                                                                                                    : "Finalizado"
                                                                                        }
                                                                                    </span>
                                                                                </Link>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                }
            </div>
        </section>
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
};

export default Torneo;