import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Categoria = () => {
  const navigate = useNavigate();
  console.log("✅ Categoria renderizando");

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para el modal
  const [showModal, setShowModal] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  
  // Estado para el formulario
  const [form, setForm] = useState({
    nombre: "",
    edad: "",
    documento: "",
    email: ""
  });

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
    console.log("🔄 useEffect ejecutándose...");
    
    const fetchCategorias = async () => {
      try {
        console.log("📡 Fetching categorías...");
        const response = await fetch('http://localhost:3000/api/v1/categorias');
        console.log("📡 Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("📦 Datos recibidos:", data);
        setCategorias(data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  // Manejador del formulario
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Abrir modal de inscripción
  const handleInscribirClick = (categoria) => {
    // Verificar si el usuario es delegado
    if (!isDelegado()) {
      setShowModal(true);
      setCategoriaSeleccionada(categoria);
      return;
    }
    
    // Si es delegado, abrir formulario de inscripción
    setCategoriaSeleccionada(categoria);
    // Aquí podrías abrir un modal de inscripción o redirigir a un formulario
    alert('✅ Como delegado, puedes inscribir jugadores');
    // navigate(`/inscripcion/${categoria.id}`);
  };

  // Manejar la redirección al login
  const handleRedirectToLogin = () => {
    setShowModal(false);
    // Guardar la categoría a la que quería inscribirse para redirigir después del login
    localStorage.setItem('categoriaDestino', JSON.stringify(categoriaSeleccionada));
    navigate('/login', { 
      state: { 
        from: '/categorias',
        categoria: categoriaSeleccionada 
      } 
    });
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setCategoriaSeleccionada(null);
  };

  // Mostrar loading
  if (loading) {
    return (
      <div className="container mt-5">
        <h2>🏀 Categorías</h2>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="container mt-5">
        <h2>🏀 Categorías</h2>
        <div className="alert alert-danger">
          <h5>❌ Error al cargar categorías</h5>
          <p>{error}</p>
          <p className="text-muted small">
            💡 Asegúrate que el backend esté corriendo en http://localhost:3000
          </p>
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

  // Mostrar categorías
  return (
    <div className="container mt-5">
      <h2 className="mb-4">🏀 Categorías de Básquet</h2>
      
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
      
      {categorias.length === 0 ? (
        <div className="alert alert-info">
          <p>No hay categorías disponibles.</p>
        </div>
      ) : (
        <div className="row">
          {categorias.map((cat) => (
            <div className="col-md-4 mb-3" key={cat.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{cat.nombre}</h5>
                  <p className="card-text text-muted">{cat.descripcion}</p>
                  {cat.edadMinima && (
                    <p className="card-text">
                      <small className="text-primary">
                        Edad mínima: {cat.edadMinima} años
                      </small>
                    </p>
                  )}
                  <button 
                    className="btn btn-primary w-100"
                    onClick={() => handleInscribirClick(cat)}
                  >
                    📋 Inscribirme
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
                <strong>Solo puede registrar jugadores el delegado</strong>
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Para inscribirte en esta categoría, necesitas ser un delegado autorizado.
                {!isAuthenticated() && ' Inicia sesión o regístrate para continuar.'}
              </p>
              {categoriaSeleccionada && (
                <p style={{ fontSize: '14px', color: '#e3a21f', marginTop: '10px' }}>
                  Categoría: <strong>{categoriaSeleccionada.nombre}</strong>
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

export default Categoria;