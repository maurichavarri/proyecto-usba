import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";


const colores = {
  fondo: "#0a0a0a",
  superficie: "#111111",
  superficieClara: "#181818",
  borde: "rgba(255,255,255,0.08)",
  naranja: "#e8500a",
  texto: "#ffffff",
  textoSecundario: "rgba(255,255,255,0.55)"
};


const AnuncioDetalle = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const { data } = useFetch(
    `http://localhost:3000/api/v1/anuncios/${id}`
  );


  // ================================
  // FORMATEAR FECHA
  // ================================

  const formatearFecha = (fecha) => {

    if (!fecha) {
      return null;
    }

    // Evitamos problemas de zona horaria
    // si viene como YYYY-MM-DD
    const [anio, mes, dia] = fecha
      .split("T")[0]
      .split("-")
      .map(Number);

    const fechaLocal = new Date(
      anio,
      mes - 1,
      dia
    );

    return fechaLocal.toLocaleDateString(
      "es-AR",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );
  };


  return (

    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colores.fondo,
        color: colores.texto,
        paddingBottom: "90px"
      }}
    >


      {/* ================================= */}
      {/* ENCABEZADO */}
      {/* ================================= */}

      <section
        style={{
          borderBottom:
            `1px solid ${colores.borde}`,
          background:
            "linear-gradient(135deg, #111 0%, #181818 55%, #3a1607 100%)",
          position: "relative",
          overflow: "hidden"
        }}
      >

        {/* DECORACIÓN */}

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


        <div
          className="container position-relative"
          style={{
            paddingTop: "45px",
            paddingBottom: "60px"
          }}
        >

          {/* VOLVER */}

          <button
            type="button"
            onClick={() =>
              navigate("/anuncios")
            }
            style={{
              backgroundColor:
                "transparent",
              border:
                `1px solid ${colores.borde}`,
              color:
                colores.textoSecundario,
              padding: "8px 13px",
              borderRadius: "3px",
              fontSize: "0.78rem",
              fontWeight: "700",
              marginBottom: "40px"
            }}
          >
            ← Volver a anuncios
          </button>


          {/* ETIQUETA */}

          <div
            style={{
              color: colores.naranja,
              fontSize: "11px",
              fontWeight: "900",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              marginBottom: "12px"
            }}
          >
            USBA · Comunicado oficial
          </div>


          {/* TÍTULO */}

          <h1
            style={{
              maxWidth: "900px",
              fontSize:
                "clamp(2.3rem, 5vw, 4.5rem)",
              fontWeight: "900",
              letterSpacing: "-2px",
              lineHeight: 1.05,
              marginBottom: "20px"
            }}
          >
            {data?.titulo || "Anuncio"}
          </h1>


          {/* FECHA */}

          {
            data?.fecha && (

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color:
                    colores.textoSecundario,
                  fontSize: "0.85rem"
                }}
              >

                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor:
                      colores.naranja,
                    display: "inline-block"
                  }}
                />

                Publicado el{" "}
                {formatearFecha(
                  data.fecha
                )}

              </div>

            )
          }

        </div>

      </section>


      {/* ================================= */}
      {/* PUBLICACIÓN */}
      {/* ================================= */}

      <main className="container mt-5">

        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto"
          }}
        >


          {/* ================================= */}
          {/* IMAGEN PRINCIPAL */}
          {/* ================================= */}

          {
            data?.imagen && (

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height:
                    "clamp(280px, 50vw, 520px)",
                  overflow: "hidden",
                  borderRadius: "5px",
                  border:
                    `1px solid ${colores.borde}`,
                  marginBottom: "35px",
                  backgroundColor:
                    colores.superficie
                }}
              >

                <img
                  src={
                    `http://localhost:3000${data.imagen}`
                  }
                  alt={data.titulo}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />


                {/* SOMBRA INFERIOR */}

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.35), transparent 45%)",
                    pointerEvents: "none"
                  }}
                />

              </div>

            )
          }


          {/* ================================= */}
          {/* CONTENIDO */}
          {/* ================================= */}

          <article
            style={{
              backgroundColor:
                colores.superficie,
              border:
                `1px solid ${colores.borde}`,
              borderLeft:
                `4px solid ${colores.naranja}`,
              borderRadius: "4px",
              padding:
                "clamp(25px, 5vw, 50px)"
            }}
          >

            <div
              style={{
                color: colores.naranja,
                fontSize: "10px",
                fontWeight: "900",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "25px"
              }}
            >
              Comunicado
            </div>


            <div
              style={{
                color:
                  "rgba(255,255,255,0.82)",
                fontSize: "1.05rem",
                lineHeight: 1.9,
                whiteSpace: "pre-line"
              }}
            >
              {
                data?.contenido ||
                "No hay contenido disponible."
              }
            </div>

          </article>


          {/* ================================= */}
          {/* PIE DE PUBLICACIÓN */}
          {/* ================================= */}

          <div
            className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
            style={{
              marginTop: "25px",
              paddingTop: "25px",
              borderTop:
                `1px solid ${colores.borde}`
            }}
          >

            <div>

              <div
                style={{
                  color: colores.naranja,
                  fontSize: "10px",
                  fontWeight: "900",
                  letterSpacing: "2px",
                  textTransform: "uppercase"
                }}
              >
                USBA
              </div>

              <div
                style={{
                  color:
                    colores.textoSecundario,
                  fontSize: "0.8rem",
                  marginTop: "3px"
                }}
              >
                Unión Santiagueña de
                Básquet Amateur
              </div>

            </div>


            <button
              type="button"
              onClick={() =>
                navigate("/anuncios")
              }
              style={{
                backgroundColor:
                  colores.naranja,
                border: "none",
                color: "#fff",
                padding: "11px 18px",
                borderRadius: "3px",
                fontWeight: "800",
                fontSize: "0.76rem",
                letterSpacing: "1px",
                textTransform: "uppercase"
              }}
            >
              Ver más anuncios →
            </button>

          </div>

        </div>

      </main>

    </div>
  );
};


export default AnuncioDetalle;