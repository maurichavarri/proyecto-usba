import { useFetch } from "../hooks/useFetch";
import { Link } from "react-router-dom";

<<<<<<< HEAD
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
=======
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
const truncate = (text, max) => {
    if (!text) return "";
    return text.length > max ? text.substring(0, max) + "..." : text;
};

<<<<<<< HEAD
>>>>>>> 63c6e1b (cambios de administrador y delegados)
=======
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
const Anuncio = () => {

    const { data = [] } = useFetch(
        "http://localhost:3000/api/v1/anuncios"
    );


    return (
<<<<<<< HEAD
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
                    borderBottom: `1px solid ${colores.borde}`,
                    background:
                        "linear-gradient(135deg, #111 0%, #181818 55%, #3a1607 100%)"
                }}
            >

                <div
                    style={{
                        position: "absolute",
                        width: "420px",
                        height: "420px",
                        borderRadius: "50%",
                        border: "70px solid rgba(232,80,10,0.06)",
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
                        USBA · Comunicación oficial
                    </div>


                    <h1
                        style={{
                            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                            fontWeight: "900",
                            letterSpacing: "-2px",
                            lineHeight: 1,
                            marginBottom: "18px"
                        }}
                    >
                        Anuncios
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
                        Noticias, comunicados y novedades oficiales
                        de la Unión Santiagueña de Básquet Amateur.
                    </p>

                </div>

            </section>


            {/* ================================ */}
            {/* CONTENIDO */}
            {/* ================================ */}

            <section className="container mt-5">


                <div
                    className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4"
                >

                    <div>

                        <div
                            style={{
                                color: colores.naranja,
                                fontSize: "11px",
                                fontWeight: "800",
                                letterSpacing: "2.5px",
                                textTransform: "uppercase",
                                marginBottom: "5px"
                            }}
                        >
                            Actualidad
                        </div>


                        <h2
                            style={{
                                fontWeight: "900",
                                letterSpacing: "-1px",
                                marginBottom: "6px"
                            }}
                        >
                            Últimas publicaciones
                        </h2>


                        <p
                            style={{
                                color: colores.textoSecundario,
                                marginBottom: 0,
                                fontSize: "0.9rem"
                            }}
                        >
                            Toda la información institucional y deportiva.
                        </p>

                    </div>


                    {
                        data.length > 0 && (

                            <div
                                style={{
                                    color: colores.textoSecundario,
                                    fontSize: "0.8rem"
                                }}
                            >
                                {data.length}{" "}
                                {
                                    data.length === 1
                                        ? "publicación"
                                        : "publicaciones"
                                }
                            </div>

                        )
                    }

                </div>


                {/* ================================ */}
                {/* SIN ANUNCIOS */}
                {/* ================================ */}

                {
                    data.length === 0 ? (

                        <div
                            className="text-center py-5"
                            style={{
                                backgroundColor: colores.superficie,
                                border: `1px solid ${colores.borde}`,
                                borderRadius: "4px"
                            }}
                        >

                            {/* 
                            <div
                                style={{
                                    fontSize: "3rem",
                                    marginBottom: "15px"
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
                                    textTransform: "uppercase"
                                }}
                            >
                                Sin novedades
                            </div>


                            <h3
                                style={{
                                    fontWeight: "900",
                                    marginTop: "6px"
                                }}
                            >
                                No hay anuncios disponibles
                            </h3>


                            <p
                                style={{
                                    color: colores.textoSecundario,
                                    marginBottom: 0
                                }}
                            >
                                Las próximas novedades aparecerán
                                publicadas en esta sección.
                            </p>

                        </div>

                    ) : (

                        <div className="row g-4">

                            {
                                data.map((anuncio) => (

                                    <div
                                        className="col-12 col-md-6 col-lg-4"
                                        key={anuncio.id}
                                    >

                                        <Link
                                            to={`/anuncios/${anuncio.id}`}
                                            style={{
                                                textDecoration: "none",
                                                color: "#fff"
                                            }}
                                        >

                                            <article
                                                style={{
                                                    height: "100%",
                                                    backgroundColor:
                                                        colores.superficie,
                                                    border:
                                                        `1px solid ${colores.borde}`,
                                                    borderRadius: "5px",
                                                    overflow: "hidden",
                                                    transition:
                                                        "transform 0.2s, border-color 0.2s"
                                                }}
                                                onMouseEnter={(e) => {

                                                    e.currentTarget.style.transform =
                                                        "translateY(-4px)";

                                                    e.currentTarget.style.borderColor =
                                                        colores.naranja;
                                                }}
                                                onMouseLeave={(e) => {

                                                    e.currentTarget.style.transform =
                                                        "translateY(0)";

                                                    e.currentTarget.style.borderColor =
                                                        colores.borde;
                                                }}
                                            >


                                                {/* IMAGEN */}

                                                <div
                                                    style={{
                                                        height: "220px",
                                                        backgroundColor:
                                                            colores.superficieClara,
                                                        position: "relative",
                                                        overflow: "hidden"
                                                    }}
                                                >

                                                    {
                                                        anuncio.imagen ? (

                                                            <img
                                                                src={
                                                                    `http://localhost:3000${anuncio.imagen}`
                                                                }
                                                                alt={anuncio.titulo}
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit: "cover",
                                                                    filter:
                                                                        "brightness(0.62)"
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
                                                                        "linear-gradient(135deg, #181818, #3a1607)"
                                                                }}
                                                            >

                                                                <span
                                                                    style={{
                                                                        fontSize: "4rem"
                                                                    }}
                                                                >
                                                                    🏀
                                                                </span>

                                                            </div>

                                                        )
                                                    }


                                                    <div
                                                        style={{
                                                            position: "absolute",
                                                            inset: 0,
                                                            background:
                                                                "linear-gradient(to top, #111 0%, rgba(17,17,17,0.15) 70%, transparent 100%)"
                                                        }}
                                                    />


                                                    <div
                                                        style={{
                                                            position: "absolute",
                                                            left: "20px",
                                                            bottom: "18px"
                                                        }}
                                                    >

                                                        <span
                                                            style={{
                                                                backgroundColor:
                                                                    colores.naranja,
                                                                color: "#fff",
                                                                padding:
                                                                    "6px 9px",
                                                                borderRadius:
                                                                    "3px",
                                                                fontSize:
                                                                    "9px",
                                                                fontWeight:
                                                                    "900",
                                                                letterSpacing:
                                                                    "1.5px",
                                                                textTransform:
                                                                    "uppercase"
                                                            }}
                                                        >
                                                            Comunicado
                                                        </span>

                                                    </div>

                                                </div>


                                                {/* TEXTO */}

                                                <div
                                                    style={{
                                                        padding: "24px"
                                                    }}
                                                >

                                                    <h3
                                                        style={{
                                                            fontWeight: "900",
                                                            fontSize: "1.25rem",
                                                            letterSpacing:
                                                                "-0.5px",
                                                            lineHeight: 1.3,
                                                            color: "#fff",
                                                            marginBottom:
                                                                "12px"
                                                        }}
                                                    >
                                                        {anuncio.titulo}
                                                    </h3>


                                                    <p
                                                        style={{
                                                            color:
                                                                colores.textoSecundario,
                                                            fontSize:
                                                                "0.88rem",
                                                            lineHeight: 1.7,
                                                            marginBottom:
                                                                "22px",

                                                            display:
                                                                "-webkit-box",
                                                            WebkitLineClamp: 4,
                                                            WebkitBoxOrient:
                                                                "vertical",
                                                            overflow: "hidden"
                                                        }}
                                                    >
                                                        {
                                                            anuncio.contenido
                                                        }
                                                    </p>


                                                    <div
                                                        style={{
                                                            paddingTop: "15px",
                                                            borderTop:
                                                                `1px solid ${colores.borde}`
                                                        }}
                                                    >

                                                        <span
                                                            style={{
                                                                color:
                                                                    colores.naranja,
                                                                fontSize:
                                                                    "0.75rem",
                                                                fontWeight:
                                                                    "900",
                                                                letterSpacing:
                                                                    "1px",
                                                                textTransform:
                                                                    "uppercase"
                                                            }}
                                                        >
                                                            Leer publicación →
                                                        </span>

                                                    </div>

                                                </div>

                                            </article>

                                        </Link>

                                    </div>

                                ))
                            }

                        </div>

                    )
                }

            </section>

        </div>
=======
        <>
            {/* HERO DEPORTIVO */}
            <section className="anu-hero">
                <div className="container anu-hero-inner">
                    <span className="anu-hero-eyebrow">USBA · Básquet Amateur</span>
                    <h1 className="anu-hero-title">Anuncios</h1>
                    <p className="anu-hero-sub">
                        Novedades del torneo, fixtures, resultados y comunicados
                        oficiales de la liga.
                    </p>
                </div>
=======
        <>
            {/* HERO DEPORTIVO */}
            <section className="anu-hero">
                <div className="container anu-hero-inner">
                    <span className="anu-hero-eyebrow">USBA · Básquet Amateur</span>
                    <h1 className="anu-hero-title">Anuncios</h1>
                    <p className="anu-hero-sub">
                        Novedades del torneo, fixtures, resultados y comunicados
                        oficiales de la liga.
                    </p>
                </div>
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
            </section>

            {/* GRID */}
            <section className="anu-section">
                <div className="container">
                    {data.length === 0 ? (
                        <p className="text-muted">No hay anuncios disponibles.</p>
                    ) : (
                        <div className="row g-4">
                            {data.map((anuncio) => (
                                <div className="col-6 col-md-4 col-lg-3" key={anuncio.id}>
                                    <Link to={`/anuncios/${anuncio.id}`} className="anu-card">
                                        <div className="anu-card-img-wrap">
                                            {anuncio.imagen ? (
                                                <img
                                                    src={`http://localhost:3000${anuncio.imagen}`}
                                                    alt={anuncio.titulo}
                                                />
                                            ) : (
                                                <div className="anu-card-no-img">🏀</div>
                                            )}
                                            <span className="anu-card-tag">Comunicado</span>
                                        </div>
                                        <div className="anu-card-body">
                                            <h3 className="anu-card-title">{anuncio.titulo}</h3>
                                            <p className="anu-card-desc">
                                                {truncate(anuncio.contenido, 90)}
                                            </p>
                                            <span className="anu-card-link">
                                                Leer más <span className="arrow">→</span>
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
<<<<<<< HEAD
>>>>>>> 63c6e1b (cambios de administrador y delegados)
=======
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
    );
};


export default Anuncio;