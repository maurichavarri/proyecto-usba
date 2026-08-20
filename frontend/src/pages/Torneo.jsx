import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import img from "../assets/img/pelota-basquet.jpeg";


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


const Torneo = () => {

    const { data } = useFetch(
        "http://localhost:3000/api/v1/torneos"
    );

    const [torneoExpandido, setTorneoExpandido] =
        useState(null);


    const toggleTorneo = (id) => {

        setTorneoExpandido(
            torneoExpandido === id
                ? null
                : id
        );
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
    );
};


export default Torneo;