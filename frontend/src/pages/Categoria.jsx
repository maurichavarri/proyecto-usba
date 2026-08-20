import { useFetch } from "../hooks/useFetch";
import img from "../assets/img/pelota-basquet-2.jpeg";


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


const Categoria = () => {

    const { data } = useFetch(
        "http://localhost:3000/api/v1/categorias"
    );


    return (

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

                {/* Decoración */}

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
                        Categorías
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
                        Conocé las distintas categorías que forman
                        parte de las competencias organizadas por USBA.
                    </p>

                </div>

            </section>


            {/* ================================ */}
            {/* CONTENIDO */}
            {/* ================================ */}

            <section className="container mt-5">


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
                        División deportiva
                    </div>


                    <h2
                        style={{
                            fontWeight: "900",
                            letterSpacing: "-1px",
                            marginTop: "4px",
                            marginBottom: 0
                        }}
                    >
                        Categorías disponibles
                    </h2>

                </div>


                {/* SIN CATEGORÍAS */}

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
                                Sin información
                            </div>


                            <h3
                                style={{
                                    fontWeight: "900",
                                    marginTop: "6px"
                                }}
                            >
                                No hay categorías disponibles
                            </h3>


                            <p
                                style={{
                                    color:
                                        colores.textoSecundario,
                                    marginBottom: 0
                                }}
                            >
                                Las categorías aparecerán aquí
                                cuando sean publicadas.
                            </p>

                        </div>

                    ) : (

                        <div className="row g-4">

                            {
                                data.map((categoria) => (

                                    <div
                                        key={categoria.id}
                                        className="col-12 col-md-6 col-lg-4"
                                    >

                                        <div
                                            style={{
                                                backgroundColor:
                                                    colores.superficie,
                                                border:
                                                    `1px solid ${colores.borde}`,
                                                borderRadius: "5px",
                                                overflow: "hidden",
                                                height: "100%",
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
                                                    height: "190px",
                                                    position: "relative",
                                                    overflow: "hidden"
                                                }}
                                            >

                                                <img
                                                    src={img}
                                                    alt={categoria.nombre}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                        filter:
                                                            "brightness(0.55)"
                                                    }}
                                                />


                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        inset: 0,
                                                        background:
                                                            "linear-gradient(to top, #111 0%, rgba(17,17,17,0.25) 65%, transparent 100%)"
                                                    }}
                                                />


                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        bottom: "18px",
                                                        left: "20px",
                                                        right: "20px"
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            color:
                                                                colores.naranja,
                                                            fontSize: "10px",
                                                            fontWeight: "800",
                                                            letterSpacing: "2px",
                                                            textTransform:
                                                                "uppercase",
                                                            marginBottom: "5px"
                                                        }}
                                                    >
                                                        Categoría USBA
                                                    </div>


                                                    <h3
                                                        style={{
                                                            color: "#fff",
                                                            fontWeight: "900",
                                                            letterSpacing:
                                                                "-1px",
                                                            margin: 0
                                                        }}
                                                    >
                                                        {categoria.nombre}
                                                    </h3>

                                                </div>

                                            </div>


                                            {/* CONTENIDO */}

                                            <div
                                                style={{
                                                    padding: "22px"
                                                }}
                                            >

                                                <p
                                                    style={{
                                                        color:
                                                            colores.textoSecundario,
                                                        lineHeight: 1.7,
                                                        marginBottom: 0,
                                                        fontSize: "0.9rem"
                                                    }}
                                                >
                                                    {
                                                        categoria.descripcion ||
                                                        "Categoría disponible para competencias oficiales de USBA."
                                                    }
                                                </p>

                                            </div>


                                            {/* PIE */}

                                            <div
                                                style={{
                                                    padding:
                                                        "14px 22px",
                                                    borderTop:
                                                        `1px solid ${colores.borde}`,
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center"
                                                }}
                                            >

                                                <span
                                                    style={{
                                                        color:
                                                            colores.textoSecundario,
                                                        fontSize: "0.78rem",
                                                        fontWeight: "600"
                                                    }}
                                                >
                                                    Competencia amateur
                                                </span>


                                                <span
                                                    style={{
                                                        color:
                                                            colores.naranja,
                                                        fontWeight: "900"
                                                    }}
                                                >
                                                    🏀
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                ))
                            }

                        </div>

                    )
                }

            </section>

        </div>
    );
};


export default Categoria;