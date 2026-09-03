import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import Carrusel from "../components/Carrusel";
import Bienvenida from "../components/Bienvenida";
import { Link } from "react-router-dom";

const colores = {
  fondo: "#0a0a0a",
  superficie: "#111111",
  superficieClara: "#181818",
  borde: "rgba(255,255,255,0.08)",
  naranja: "#e8500a",
  naranjaOscuro: "#c94008",
  texto: "#ffffff",
  textoSecundario: "rgba(255,255,255,0.55)",
};

const Home = () => {
  const { data: anuncios = [] } = useFetch(
    "http://localhost:3000/api/v1/anuncios",
  );

  const [imagenesCarrusel, setImagenesCarrusel] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/carrusel");

        if (!res.ok) {
          throw new Error();
        }

        const data = await res.json();

        const imagenes = Array.isArray(data) ? data : [];

        setImagenesCarrusel(
          imagenes.map((img) => `http://localhost:3000${img.url}`),
        );
      } catch {
        setImagenesCarrusel([]);
      }
    };

    cargar();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colores.fondo,
        color: colores.texto,
      }}
    >
      {/* ================================= */}
      {/* CARRUSEL */}
      {/* ================================= */}

      {imagenesCarrusel === null ? (
        <div
          style={{
            height: "480px",
            backgroundColor: colores.fondo,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="text-center">
            <div
              className="spinner-border"
              role="status"
              style={{
                color: colores.naranja,
              }}
            >
              <span className="visually-hidden">Cargando...</span>
            </div>

            <div
              style={{
                color: colores.textoSecundario,
                fontSize: "0.85rem",
                marginTop: "14px",
              }}
            >
              Cargando contenido...
            </div>
          </div>
        </div>
      ) : imagenesCarrusel.length > 0 ? (
        <Carrusel imagenes={imagenesCarrusel} />
      ) : (
        <section
          style={{
            minHeight: "360px",
            display: "flex",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #e8500a 0%, #9e3507 35%, #111 78%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "430px",
              height: "430px",
              borderRadius: "50%",
              border: "75px solid rgba(255,255,255,0.035)",
              right: "-100px",
              top: "-160px",
            }}
          />

          <div className="container position-relative">
            <div
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "11px",
                fontWeight: "800",
                letterSpacing: "3px",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              USBA · Básquet Amateur
            </div>

            <h1
              style={{
                fontWeight: "900",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                letterSpacing: "-2px",
                lineHeight: 1,
                marginBottom: "18px",
              }}
            >
              Unión Santiagueña
              <br />
              de Básquet Amateur
            </h1>

            <p
              style={{
                maxWidth: "600px",
                color: "rgba(255,255,255,0.7)",
                fontSize: "1rem",
                lineHeight: 1.7,
                marginBottom: 0,
              }}
            >
              Torneos, resultados, equipos y toda la actualidad de la
              competencia.
            </p>
          </div>
        </section>
      )}

      {/* ================================= */}
      {/* BIENVENIDA */}
      {/* ================================= */}

      <Bienvenida />

      {/* ================================= */}
      {/* ANUNCIOS */}
      {/* ================================= */}

      <section
        style={{
          borderTop: `1px solid ${colores.borde}`,
          padding: "70px 0 90px"
        }}
      >
        <div className="container">

          {/* ENCABEZADO */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
            <div>
              <div
                style={{
                  color: colores.naranja,
                  fontSize: "11px",
                  fontWeight: "800",
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  marginBottom: "5px",
                }}
              >
                Novedades
              </div>

              <h2
                style={{
                  fontWeight: "900",
                  letterSpacing: "-1px",
                  marginBottom: "6px",
                }}
              >
                Últimos anuncios
              </h2>

              <p
                style={{
                  color: colores.textoSecundario,
                  marginBottom: 0,
                  fontSize: "0.9rem",
                }}
              >
                Noticias y comunicados oficiales de USBA.
              </p>
            </div>

            <Link
              to="/anuncios"
              style={{
                color: colores.naranja,
                fontWeight: "800",
                fontSize: "0.82rem",
                textDecoration: "none",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Ver todos →
            </Link>
          </div>

          {/* SIN ANUNCIOS */}
          {anuncios.length === 0 ? (
            <div
              className="text-center py-5"
              style={{
                backgroundColor: colores.superficie,
                border: `1px solid ${colores.borde}`,
                borderRadius: "4px",
              }}
            >
              {/* 
                                <div
                                    style={{
                                        fontSize: "2.7rem",
                                        marginBottom: "12px"
                                    }}
                                >
                                    📢
                                </div>
                                */}

              <div
                style={{
                  color: colores.naranja,
                  fontSize: "10px",
                  fontWeight: "800",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                Sin novedades
              </div>

              <h4
                style={{
                  fontWeight: "900",
                  marginTop: "5px",
                }}
              >
                No hay anuncios disponibles
              </h4>

              <p
                style={{
                  color: colores.textoSecundario,
                  marginBottom: 0,
                }}
              >
                Las novedades aparecerán publicadas en esta sección.
              </p>
            </div>
          ) : (
            <div className="row g-4">
              {anuncios.slice(0, 8).map((anuncio) => (
                <div className="col-12 col-md-6 col-lg-3" key={anuncio.id}>
                  <Link
                    to={`/anuncios/${anuncio.id}`}
                    style={{
                      textDecoration: "none",
                      color: "#fff",
                    }}
                  >
                    <article
                      style={{
                        height: "100%",
                        backgroundColor: colores.superficie,
                        border: `1px solid ${colores.borde}`,
                        borderRadius: "5px",
                        overflow: "hidden",
                        transition: "transform 0.2s, border-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";

                        e.currentTarget.style.borderColor = colores.naranja;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";

                        e.currentTarget.style.borderColor = colores.borde;
                      }}
                    >

                      {/* IMAGEN */}
                      <div
                        style={{
                          height: "180px",
                          backgroundColor: colores.superficieClara,
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {anuncio.imagen ? (
                          <img
                            src={`http://localhost:3000${anuncio.imagen}`}
                            alt={anuncio.titulo}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              filter: "brightness(0.65)",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background:
                                "linear-gradient(135deg, #181818, #3a1607)",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "3rem",
                              }}
                            >
                              🏀
                            </span>
                          </div>
                        )}

                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(to top, #111 0%, transparent 70%)",
                          }}
                        />
                      </div>

                      {/* CONTENIDO */}

                      <div
                        style={{
                          padding: "20px",
                        }}
                      >
                        <div
                          style={{
                            color: colores.naranja,
                            fontSize: "10px",
                            fontWeight: "800",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            marginBottom: "8px",
                          }}
                        >
                          Comunicado
                        </div>

                        <h5
                          style={{
                            fontWeight: "900",
                            letterSpacing: "-0.3px",
                            lineHeight: 1.3,
                            marginBottom: "10px",
                            color: "#fff",
                          }}
                        >
                          {anuncio.titulo}
                        </h5>

                        <p
                          style={{
                            color: colores.textoSecundario,
                            fontSize: "0.84rem",
                            lineHeight: 1.6,
                            marginBottom: "18px",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {anuncio.contenido}
                        </p>

                        <span
                          style={{
                            color: colores.naranja,
                            fontSize: "0.75rem",
                            fontWeight: "800",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                          }}
                        >
                          Leer anuncio →
                        </span>
                      </div>
                    </article>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;