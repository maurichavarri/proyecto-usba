import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import img from "../assets/img/pelota-basquet.jpeg";

<<<<<<< HEAD

const colores = {
    fondo: "#0a0a0a",
    superficie: "#111111",
    superficieClara: "#181818",
    borde: "rgba(255,255,255,0.08)",
    naranja: "#e8500a",
    naranjaOscuro: "#c94008",
    texto: "#ffffff",
    textoSecundario: "rgba(255,255,255,0.55)"
};

=======
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
>>>>>>> 63c6e1b (cambios de administrador y delegados)

const Torneo = () => {

    const { data } = useFetch("http://localhost:3000/api/v1/torneos");
    const [torneoExpandido, setTorneoExpandido] = useState(null);
    const toggleTorneo = (id) => {
<<<<<<< HEAD

        setTorneoExpandido(
            torneoExpandido === id
                ? null
                : id
        );
=======
        setTorneoExpandido(torneoExpandido === id ? null : id);
>>>>>>> 63c6e1b (cambios de administrador y delegados)
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
<<<<<<< HEAD

        <div
            style={{
                minHeight: "100vh",
                backgroundColor: colores.fondo,
                color: colores.texto,
                paddingBottom: "80px"
            }}
        >


            {/* ================================ */}
            {/* HERO */}
            {/* ================================ */}

            <section
                style={{
                    position: "relative",
                    overflow: "hidden",
                    borderBottom:
                        `1px solid ${colores.borde}`,
                    background:
                        "linear-gradient(135deg, #111 0%, #181818 55%, #3a1607 100%)"
                }}
            >

                {/* Círculo decorativo */}

                <div
                    style={{
                        position: "absolute",
                        width: "420px",
                        height: "420px",
                        borderRadius: "50%",
                        border:
                            "70px solid rgba(232,80,10,0.06)",
                        right: "-90px",
                        top: "-170px",
                        pointerEvents: "none"
                    }}
                />


                <div className="container py-5">

                    <div
                        style={{
                            color: colores.naranja,
                            fontSize: "11px",
                            fontWeight: "800",
                            letterSpacing: "3px",
                            textTransform: "uppercase",
                            marginBottom: "12px"
                        }}
                    >
                        USBA · Básquet Amateur
                    </div>


                    <h1
                        style={{
                            fontSize:
                                "clamp(2.5rem, 5vw, 4.5rem)",
                            fontWeight: "900",
                            letterSpacing: "-2px",
                            lineHeight: 1,
                            marginBottom: "18px"
                        }}
                    >
                        Torneos
                    </h1>


                    <p
                        style={{
                            color: colores.textoSecundario,
                            maxWidth: "620px",
                            fontSize: "1rem",
                            lineHeight: 1.7,
                            marginBottom: 0
                        }}
                    >
                        Consultá las competencias disponibles,
                        categorías, formatos, equipos participantes
                        y el estado actual de cada torneo.
                    </p>

                </div>

            </section>


            {/* ================================ */}
            {/* CONTENIDO */}
            {/* ================================ */}

            <section className="container mt-5">


                {/* Encabezado */}

                <div className="mb-4">

                    <div
                        style={{
                            color: colores.naranja,
                            fontSize: "11px",
                            fontWeight: "800",
                            letterSpacing: "2.5px",
                            textTransform: "uppercase"
                        }}
                    >
                        Competencias
                    </div>

                    <h2
                        style={{
                            fontWeight: "900",
                            letterSpacing: "-1px",
                            marginTop: "4px"
                        }}
                    >
                        Torneos disponibles
                    </h2>

                </div>


                {/* SIN TORNEOS */}

                {
                    data.length === 0 ? (

                        <div
                            className="text-center py-5"
                            style={{
                                backgroundColor:
                                    colores.superficie,
                                border:
                                    `1px solid ${colores.borde}`,
                                borderRadius: "4px"
                            }}
                        >

                            <div
                                style={{
                                    fontSize: "3rem",
                                    marginBottom: "15px"
                                }}
                            >
                                🏀
                            </div>

                            <div
                                style={{
                                    color: colores.naranja,
                                    fontSize: "11px",
                                    fontWeight: "800",
                                    letterSpacing: "2px",
                                    textTransform: "uppercase"
                                }}
                            >
                                Próximamente
                            </div>

                            <h3
                                style={{
                                    fontWeight: "900",
                                    marginTop: "6px"
                                }}
                            >
                                No hay torneos disponibles
                            </h3>

                            <p
                                style={{
                                    color:
                                        colores.textoSecundario,
                                    marginBottom: 0
                                }}
                            >
                                Cuando exista una nueva competencia,
                                aparecerá publicada en esta sección.
                            </p>

                        </div>

                    ) : (

                        <div className="row g-4">

                            {
                                data.map((torneo) => {

                                    const expandido =
                                        torneoExpandido ===
                                        torneo.id;

                                    return (

                                        <div
                                            key={torneo.id}
                                            className="col-12 col-lg-6"
                                        >

                                            {/* ==================== */}
                                            {/* TARJETA DEL TORNEO */}
                                            {/* ==================== */}

                                            <div
                                                style={{
                                                    position:
                                                        "relative",
                                                    overflow:
                                                        "hidden",
                                                    backgroundColor:
                                                        colores.superficie,
                                                    border:
                                                        expandido
                                                            ? `1px solid ${colores.naranja}`
                                                            : `1px solid ${colores.borde}`,
                                                    borderRadius:
                                                        "5px",
                                                    cursor:
                                                        "pointer",
                                                    transition:
                                                        "border-color 0.2s, transform 0.2s"
                                                }}
                                                onClick={() =>
                                                    toggleTorneo(
                                                        torneo.id
                                                    )
                                                }
                                            >

                                                {/* Imagen */}

                                                <div
                                                    style={{
                                                        height:
                                                            "190px",
                                                        position:
                                                            "relative",
                                                        overflow:
                                                            "hidden"
                                                    }}
                                                >

                                                    <img
                                                        src={img}
                                                        alt="Básquet"
                                                        style={{
                                                            width:
                                                                "100%",
                                                            height:
                                                                "100%",
                                                            objectFit:
                                                                "cover",
                                                            filter:
                                                                "brightness(0.55)"
                                                        }}
                                                    />


                                                    <div
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            inset: 0,
                                                            background:
                                                                "linear-gradient(to top, #111 0%, rgba(17,17,17,0.25) 65%, transparent 100%)"
                                                        }}
                                                    />


                                                    <div
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            bottom:
                                                                "20px",
                                                            left:
                                                                "22px",
                                                            right:
                                                                "22px"
                                                        }}
                                                    >

                                                        <div
                                                            style={{
                                                                color:
                                                                    colores.naranja,
                                                                fontSize:
                                                                    "10px",
                                                                fontWeight:
                                                                    "800",
                                                                letterSpacing:
                                                                    "2px",
                                                                textTransform:
                                                                    "uppercase",
                                                                marginBottom:
                                                                    "5px"
                                                            }}
                                                        >
                                                            Torneo USBA
                                                        </div>


                                                        <h3
                                                            style={{
                                                                fontWeight:
                                                                    "900",
                                                                letterSpacing:
                                                                    "-1px",
                                                                margin:
                                                                    0,
                                                                color:
                                                                    "#fff"
                                                            }}
                                                        >
                                                            {
                                                                torneo.nombre
                                                            }
                                                        </h3>

                                                    </div>

                                                </div>


                                                {/* Footer tarjeta */}

                                                <div
                                                    className="d-flex justify-content-between align-items-center"
                                                    style={{
                                                        padding:
                                                            "18px 22px"
                                                    }}
                                                >

                                                    <span
                                                        style={{
                                                            color:
                                                                colores.textoSecundario,
                                                            fontSize:
                                                                "0.85rem",
                                                            fontWeight:
                                                                "600"
                                                        }}
                                                    >
                                                        Ver categorías
                                                    </span>


                                                    <span
                                                        style={{
                                                            color:
                                                                colores.naranja,
                                                            fontWeight:
                                                                "900",
                                                            fontSize:
                                                                "1rem"
                                                        }}
                                                    >
                                                        {
                                                            expandido
                                                                ? "▲"
                                                                : "▼"
                                                        }
                                                    </span>

                                                </div>

                                            </div>


                                            {/* ==================== */}
                                            {/* CATEGORÍAS */}
                                            {/* ==================== */}

                                            {
                                                expandido && (

                                                    <div
                                                        style={{
                                                            marginTop:
                                                                "10px",
                                                            backgroundColor:
                                                                colores.superficie,
                                                            border:
                                                                `1px solid ${colores.borde}`,
                                                            borderRadius:
                                                                "5px",
                                                            overflow:
                                                                "hidden"
                                                        }}
                                                    >

                                                        <div
                                                            style={{
                                                                padding:
                                                                    "18px 20px",
                                                                borderBottom:
                                                                    `1px solid ${colores.borde}`
                                                            }}
                                                        >

                                                            <div
                                                                style={{
                                                                    color:
                                                                        colores.naranja,
                                                                    fontSize:
                                                                        "10px",
                                                                    fontWeight:
                                                                        "800",
                                                                    letterSpacing:
                                                                        "2px",
                                                                    textTransform:
                                                                        "uppercase"
                                                                }}
                                                            >
                                                                Competencias
                                                            </div>

                                                            <h5
                                                                style={{
                                                                    fontWeight:
                                                                        "900",
                                                                    marginTop:
                                                                        "4px",
                                                                    marginBottom:
                                                                        0
                                                                }}
                                                            >
                                                                Categorías
                                                                disponibles
                                                            </h5>

                                                        </div>


                                                        {
                                                            torneo
                                                                .categorias
                                                                .length ===
                                                            0 ? (

                                                                <div
                                                                    style={{
                                                                        padding:
                                                                            "22px",
                                                                        color:
                                                                            colores.textoSecundario
                                                                    }}
                                                                >
                                                                    No hay
                                                                    categorías
                                                                    vinculadas.
                                                                </div>

                                                            ) : (

                                                                torneo.categorias.map(
                                                                    (
                                                                        categoria
                                                                    ) => {

                                                                        const
                                                                            estado =
                                                                                obtenerEstado(
                                                                                    categoria.estado
                                                                                );

                                                                        const
                                                                            bloqueada =
                                                                                categoria.estado ===
                                                                                "configuracion";

                                                                        return (

                                                                            <Link
                                                                                key={
                                                                                    categoria.id
                                                                                }
                                                                                to={
                                                                                    bloqueada
                                                                                        ? "#"
                                                                                        : `/torneos/${categoria.id}`
                                                                                }
                                                                                onClick={(
                                                                                    e
                                                                                ) => {
                                                                                    if (
                                                                                        bloqueada
                                                                                    ) {
                                                                                        e.preventDefault();
                                                                                    }
                                                                                }}
                                                                                style={{
                                                                                    display:
                                                                                        "block",
                                                                                    textDecoration:
                                                                                        "none",
                                                                                    color:
                                                                                        "#fff",
                                                                                    padding:
                                                                                        "20px",
                                                                                    borderBottom:
                                                                                        `1px solid ${colores.borde}`,
                                                                                    backgroundColor:
                                                                                        bloqueada
                                                                                            ? "#141414"
                                                                                            : colores.superficieClara,
                                                                                    opacity:
                                                                                        bloqueada
                                                                                            ? 0.55
                                                                                            : 1,
                                                                                    cursor:
                                                                                        bloqueada
                                                                                            ? "not-allowed"
                                                                                            : "pointer",
                                                                                    transition:
                                                                                        "background-color 0.2s"
                                                                                }}
                                                                            >

                                                                                <div className="d-flex justify-content-between align-items-center gap-3">

                                                                                    <div>

                                                                                        <div
                                                                                            style={{
                                                                                                fontWeight:
                                                                                                    "900",
                                                                                                fontSize:
                                                                                                    "1.05rem",
                                                                                                marginBottom:
                                                                                                    "6px"
                                                                                            }}
                                                                                        >
                                                                                            {
                                                                                                categoria.nombre
                                                                                            }
                                                                                        </div>


                                                                                        <div
                                                                                            style={{
                                                                                                color:
                                                                                                    colores.textoSecundario,
                                                                                                fontSize:
                                                                                                    "0.8rem"
                                                                                            }}
                                                                                        >
                                                                                            {
                                                                                                categoria.equipos
                                                                                            }{" "}
                                                                                            equipos
                                                                                            {" · "}
                                                                                            {
                                                                                                obtenerFormato(
                                                                                                    categoria.formato
                                                                                                )
                                                                                            }
                                                                                        </div>

                                                                                    </div>


                                                                                    <div
                                                                                        className="text-end"
                                                                                        style={{
                                                                                            minWidth:
                                                                                                "100px"
                                                                                        }}
                                                                                    >

                                                                                        <span
                                                                                            style={{
                                                                                                color:
                                                                                                    estado.color,
                                                                                                fontSize:
                                                                                                    "10px",
                                                                                                fontWeight:
                                                                                                    "900",
                                                                                                letterSpacing:
                                                                                                    "1px",
                                                                                                textTransform:
                                                                                                    "uppercase"
                                                                                            }}
                                                                                        >
                                                                                            ●{" "}
                                                                                            {
                                                                                                estado.texto
                                                                                            }
                                                                                        </span>

                                                                                    </div>

                                                                                </div>

                                                                            </Link>

                                                                        );
                                                                    }
                                                                )

                                                            )
                                                        }

                                                    </div>

                                                )
                                            }

                                        </div>

                                    );
                                })
                            }

                        </div>

                    )
                }

            </section>

        </div>
=======
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
>>>>>>> 63c6e1b (cambios de administrador y delegados)
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