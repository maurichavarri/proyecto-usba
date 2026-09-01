import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

const estiloEtiqueta = {
    color: "#e8500a",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "2.5px",
    textTransform: "uppercase"
};

const CompetenciaPublica = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [detalle, setDetalle] = useState(null);
    const [resumen, setResumen] = useState(null);
    const [fixture, setFixture] = useState([]);
    const [tabla, setTabla] = useState([]);

    const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
    const [mostrarEquipo, setMostrarEquipo] = useState(false);
    const [cargandoEquipo, setCargandoEquipo] = useState(false);

    useEffect(() => {
        obtenerFixture();
        obtenerTabla();
        obtenerResumen();
        obtenerDetalle();
    }, []);

    // ================================
    // OBTENER FIXTURE
    // ================================

    const obtenerFixture = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/torneo-categorias/${id}/fixture`);
            const data = await response.json();
            setFixture(data);
        } catch (error) {
            console.error(error);
        }
    };

    // ================================
    // VER EQUIPO
    // ================================

    const verEquipo = async (equipoId) => {
        try {
            setCargandoEquipo(true);
            const response = await fetch(`http://localhost:3000/api/v1/torneo-categorias/${id}/equipos/${equipoId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "No fue posible obtener el equipo"
                );
            }

            setEquipoSeleccionado(data);
            setMostrarEquipo(true);

        } catch (error) {
            console.error(error);
        } finally {
            setCargandoEquipo(false);
        }
    };

    // ================================
    // OBTENER TABLA
    // ================================

    const obtenerTabla = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/torneo-categorias/${id}/tabla`);
            const data = await response.json();
            setTabla(data);
        } catch (error) {
            console.error(error);
        }
    };

    // ================================
    // OBTENER RESUMEN
    // ================================

    const obtenerResumen = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/torneo-categorias/${id}/resumen`);
            const data = await response.json();
            setResumen(data);
        } catch (error) {
            console.error(error);
        }
    };

    // ================================
    // OBTENER DETALLE
    // ================================

    const obtenerDetalle = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/torneo-categorias/${id}`);

            if (!response.ok) {
                navigate("/torneos");
                return;
            }

            const data = await response.json();
            setDetalle(data);

        } catch (error) {
            console.error(error);
        }
    };

    // ================================
    // FORMATEAR FECHA Y HORA
    // ================================

    const formatearFechaHora = (fecha) => {

        if (!fecha) {
            return "Fecha por definir";
        }

        return new Date(fecha).toLocaleString(
            "es-AR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };

    // ================================
    // ESTADO COMPETENCIA
    // ================================

    const formatearEstadoCompetencia = (estado) => {

        const estados = {
            configuracion: "Configuración",
            en_curso: "En curso",
            finalizado: "Finalizada"
        };

        return estados[estado] || estado;
    };

    // ================================
    // ¿CLASIFICA A PLAYOFF?
    // ================================

    const esClasificado = (index) => {

        if (!resumen) {
            return false;
        }

        if (resumen.formatoCompetencia === "playoff_4" && index < 4) {
            return true;
        }

        if (resumen.formatoCompetencia === "playoff_8" && index < 8) {
            return true;
        }

        return false;
    };

    // ================================
    // RENDER PARTIDOS
    // ================================

    const renderPartidos = (partidos) => (
        <div className="d-flex flex-column gap-2">
            {partidos.map((partido) => (
                <div
                    key={partido.id}
                    style={{
                        backgroundColor: colores.superficieClara,
                        border: `1px solid ${colores.borde}`,
                        padding: "20px",
                        borderRadius: "4px"
                    }}
                >
                    <div className="row align-items-center">

                        {/* EQUIPOS */}
                        <div className="col-md-6">
                            <div
                                className="d-flex justify-content-between align-items-center mb-3"
                                style={{
                                    fontWeight: "800"
                                }}
                            >

                                <span>
                                    {partido.local?.Equipo?.nombre}
                                </span>

                                <span
                                    style={{
                                        fontSize: "1.4rem",
                                        fontWeight: "900",
                                        color:
                                            partido.estado === "jugado"
                                                ? colores.texto
                                                : "rgba(255,255,255,0.3)"
                                    }}
                                >
                                    {
                                        partido.estado === "jugado"
                                            ? partido.puntaje_local
                                            : "-"
                                    }
                                </span>

                            </div>


                            <div
                                className="d-flex justify-content-between align-items-center"
                                style={{
                                    fontWeight: "800"
                                }}
                            >

                                <span>
                                    {partido.visitante?.Equipo?.nombre}
                                </span>

                                <span
                                    style={{
                                        fontSize: "1.4rem",
                                        fontWeight: "900",
                                        color:
                                            partido.estado === "jugado"
                                                ? colores.texto
                                                : "rgba(255,255,255,0.3)"
                                    }}
                                >
                                    {
                                        partido.estado === "jugado"
                                            ? partido.puntaje_visitante
                                            : "-"
                                    }
                                </span>

                            </div>

                        </div>


                        {/* INFORMACIÓN */}
                        <div className="col-md-4 mt-4 mt-md-0">

                            <div
                                style={{
                                    color: colores.textoSecundario,
                                    fontSize: "0.82rem",
                                    lineHeight: 1.9
                                }}
                            >

                                <div>
                                    <span
                                        style={{
                                            color: colores.naranja,
                                            fontWeight: "800"
                                        }}
                                    >
                                        SEDE
                                    </span>
                                    {" · "}
                                    {partido.sede?.nombre || "Por definir"}
                                </div>


                                <div>
                                    <span
                                        style={{
                                            color: colores.naranja,
                                            fontWeight: "800"
                                        }}
                                    >
                                        ÁRBITRO
                                    </span>
                                    {" · "}
                                    {
                                        partido.arbitro
                                            ? `${partido.arbitro.nombre} ${partido.arbitro.apellido}`
                                            : "Por definir"
                                    }
                                </div>


                                <div>
                                    <span
                                        style={{
                                            color: colores.naranja,
                                            fontWeight: "800"
                                        }}
                                    >
                                        FECHA
                                    </span>
                                    {" · "}
                                    {formatearFechaHora(partido.fecha)}
                                </div>

                            </div>

                        </div>


                        {/* ESTADO */}
                        <div className="col-md-2 mt-4 mt-md-0 text-md-end">

                            <span
                                style={{
                                    color:
                                        partido.estado === "jugado"
                                            ? "#69db7c"
                                            : partido.estado === "suspendido"
                                                ? "#ff6b6b"
                                                : "#ffd43b",

                                    fontSize: "11px",
                                    fontWeight: "900",
                                    letterSpacing: "1px",
                                    textTransform: "uppercase"
                                }}
                            >
                                ● {partido.estado}
                            </span>

                        </div>

                    </div>

                </div>

            ))}

        </div>
    );


    // ================================
    // AGRUPAR PARTIDOS
    // ================================

    const jornadasRegular = {};
    const fasesPlayoff = {};


    fixture.forEach((partido) => {

        const fase = partido.fase || "regular";

        if (fase === "regular") {

            if (!jornadasRegular[partido.jornada]) {
                jornadasRegular[partido.jornada] = [];
            }

            jornadasRegular[partido.jornada].push(partido);

        } else {

            if (!fasesPlayoff[fase]) {
                fasesPlayoff[fase] = [];
            }

            fasesPlayoff[fase].push(partido);
        }
    });


    // ================================
    // RETURN
    // ================================

    return (

        <div
            style={{
                minHeight: "100vh",
                backgroundColor: colores.fondo,
                color: colores.texto,
                paddingBottom: "80px"
            }}
        >


            {/* ================================= */}
            {/* HERO */}
            {/* ================================= */}

            <div
                style={{
                    position: "relative",
                    overflow: "hidden",
                    background:
                        "linear-gradient(135deg, #e8500a 0%, #9e3507 35%, #111 75%)",
                    borderBottom: `1px solid ${colores.borde}`
                }}
            >

                {/* Decoración */}

                <div
                    style={{
                        position: "absolute",
                        width: "450px",
                        height: "450px",
                        borderRadius: "50%",
                        border: "70px solid rgba(255,255,255,0.035)",
                        right: "-100px",
                        top: "-190px",
                        pointerEvents: "none"
                    }}
                />


                <div className="container py-5 position-relative">

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={{
                            background: "rgba(0,0,0,0.25)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            color: "#fff",
                            padding: "8px 14px",
                            borderRadius: "4px",
                            fontSize: "13px",
                            fontWeight: "600",
                            marginBottom: "45px"
                        }}
                    >
                        ← Volver
                    </button>


                    {resumen && (

                        <>

                            <div
                                style={{
                                    fontSize: "11px",
                                    fontWeight: "800",
                                    letterSpacing: "3px",
                                    textTransform: "uppercase",
                                    marginBottom: "12px",
                                    opacity: 0.75
                                }}
                            >
                                USBA · Competencia oficial
                            </div>


                            <h1
                                style={{
                                    fontWeight: "900",
                                    fontSize:
                                        "clamp(2.3rem, 5vw, 4.5rem)",
                                    letterSpacing: "-2px",
                                    marginBottom: "7px",
                                    lineHeight: 1
                                }}
                            >
                                {resumen.torneo}
                            </h1>


                            <div
                                style={{
                                    fontSize: "1.3rem",
                                    fontWeight: "600",
                                    opacity: 0.8,
                                    marginBottom: "30px"
                                }}
                            >
                                {resumen.categoria}
                            </div>


                            <div className="d-flex flex-wrap gap-2">

                                {/* FORMATO */}

                                <span
                                    style={{
                                        background: "#fff",
                                        color: "#111",
                                        padding: "7px 12px",
                                        borderRadius: "3px",
                                        fontWeight: "800",
                                        fontSize: "12px",
                                        textTransform: "uppercase"
                                    }}
                                >
                                    {{
                                        solo_liga: "Liga",
                                        playoff_4: "Liga + Play-Off (4)",
                                        playoff_8: "Liga + Play-Off (8)"
                                    }[resumen.formatoCompetencia] || "-"}
                                </span>


                                {/* ESTADO */}

                                {detalle?.estado_competencia && (

                                    <span
                                        style={{
                                            background:
                                                "rgba(0,0,0,0.35)",
                                            color: "#fff",
                                            border:
                                                "1px solid rgba(255,255,255,0.2)",
                                            padding: "7px 12px",
                                            borderRadius: "3px",
                                            fontWeight: "800",
                                            fontSize: "12px",
                                            textTransform: "uppercase"
                                        }}
                                    >
                                        ●{" "}
                                        {formatearEstadoCompetencia(
                                            detalle.estado_competencia
                                        )}
                                    </span>

                                )}

                            </div>

                        </>

                    )}

                </div>

            </div>


            {/* ================================= */}
            {/* CONTENIDO */}
            {/* ================================= */}

            <div className="container">


                {/* ================================= */}
                {/* ESTADÍSTICAS */}
                {/* ================================= */}

                {resumen && (

                    <div
                        className="row g-0"
                        style={{
                            backgroundColor: colores.superficie,
                            border: `1px solid ${colores.borde}`
                        }}
                    >

                        {[
                            [
                                "Equipos",
                                resumen.equipos
                            ],
                            [
                                "Partidos",
                                resumen.partidos
                            ],
                            [
                                "Jugados",
                                resumen.partidosJugados
                            ],
                            [
                                "Restantes",
                                Math.max(
                                    0,
                                    Number(resumen.partidos) -
                                    Number(resumen.partidosJugados)
                                )
                            ]
                        ].map(([label, valor]) => (

                            <div
                                key={label}
                                className="col-6 col-md-3 text-center py-4"
                                style={{
                                    borderRight:
                                        `1px solid ${colores.borde}`
                                }}
                            >

                                <div style={estiloEtiqueta}>
                                    {label}
                                </div>

                                <div
                                    style={{
                                        fontSize: "2rem",
                                        fontWeight: "900",
                                        marginTop: "4px"
                                    }}
                                >
                                    {valor}
                                </div>

                            </div>

                        ))}

                    </div>

                )}


                {/* ================================= */}
                {/* CAMPEÓN / SUBCAMPEÓN */}
                {/* ================================= */}

                {
                    detalle?.estado_competencia === "finalizado" &&
                    detalle?.campeon &&
                    detalle?.subcampeon && (

                        <div
                            className="my-5"
                            style={{
                                background:
                                    "linear-gradient(135deg, #181818, #111)",
                                border: `1px solid ${colores.borde}`,
                                borderLeft:
                                    `5px solid ${colores.naranja}`,
                                padding: "35px"
                            }}
                        >

                            <div style={estiloEtiqueta}>
                                Resultado final
                            </div>

                            <h2
                                style={{
                                    fontWeight: "900",
                                    letterSpacing: "-1px",
                                    marginTop: "5px",
                                    marginBottom: "30px"
                                }}
                            >
                                Podio de la competencia
                            </h2>


                            <div className="row g-3">

                                {/* CAMPEÓN */}

                                <div className="col-md-7">

                                    <div
                                        style={{
                                            backgroundColor:
                                                colores.naranja,
                                            padding: "30px",
                                            height: "100%",
                                            borderRadius: "3px"
                                        }}
                                    >
                                        {/* 
                                        <div
                                            style={{
                                                fontSize: "2rem",
                                                marginBottom: "10px"
                                            }}
                                        >
                                            🏆
                                        </div>
                                        */}

                                        <div
                                            style={{
                                                fontSize: "11px",
                                                letterSpacing: "2px",
                                                fontWeight: "800",
                                                textTransform: "uppercase",
                                                opacity: 0.75
                                            }}
                                        >
                                            Campeón
                                        </div>

                                        <div
                                            style={{
                                                fontSize: "2rem",
                                                fontWeight: "900"
                                            }}
                                        >
                                            {detalle.campeon.nombre}
                                        </div>

                                    </div>

                                </div>


                                {/* SUBCAMPEÓN */}

                                <div className="col-md-5">

                                    <div
                                        style={{
                                            backgroundColor: "#222",
                                            padding: "30px",
                                            height: "100%",
                                            border:
                                                `1px solid ${colores.borde}`,
                                            borderRadius: "3px"
                                        }}
                                    >

                                        {/* 
                                        <div
                                            style={{
                                                fontSize: "2rem",
                                                marginBottom: "10px"
                                            }}
                                        >
                                            🥈
                                        </div>
                                        */}

                                        <div style={estiloEtiqueta}>
                                            Subcampeón
                                        </div>

                                        <div
                                            style={{
                                                fontSize: "1.5rem",
                                                fontWeight: "900"
                                            }}
                                        >
                                            {detalle.subcampeon.nombre}
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    )
                }


                {/* ================================= */}
                {/* TABLA DE POSICIONES */}
                {/* ================================= */}

                {tabla.length > 0 && (

                    <section className="mt-5">

                        <div className="mb-3">

                            <div style={estiloEtiqueta}>
                                Clasificación
                            </div>

                            <h2
                                style={{
                                    fontWeight: "900",
                                    letterSpacing: "-1px"
                                }}
                            >
                                Tabla de posiciones
                            </h2>

                        </div>


                        <div
                            style={{
                                backgroundColor: colores.superficie,
                                border: `1px solid ${colores.borde}`,
                                overflow: "hidden",
                                borderRadius: "4px"
                            }}
                        >

                            <div className="table-responsive">

                                <table className="table table-dark table-hover mb-0 align-middle">

                                    <thead>

                                        <tr>
                                            <th>#</th>
                                            <th>Equipo</th>
                                            <th>PJ</th>
                                            <th>PG</th>
                                            <th>PE</th>
                                            <th>PP</th>
                                            <th>GF</th>
                                            <th>GC</th>
                                            <th>DG</th>
                                            <th>PTS</th>
                                        </tr>

                                    </thead>


                                    <tbody>

                                        {tabla.map((equipo, index) => (

                                            <tr
                                                key={equipo.equipo_id}
                                                style={{
                                                    borderLeft:
                                                        esClasificado(index)
                                                            ? `3px solid ${colores.naranja}`
                                                            : "3px solid transparent"
                                                }}
                                            >

                                                <td
                                                    style={{
                                                        color:
                                                            esClasificado(index)
                                                                ? colores.naranja
                                                                : colores.textoSecundario,
                                                        fontWeight: "900"
                                                    }}
                                                >
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            verEquipo(equipo.equipo_id)
                                                        }
                                                        disabled={cargandoEquipo}
                                                        style={{
                                                            border: "none",
                                                            background: "transparent",
                                                            padding: 0,
                                                            color: "#fff",
                                                            fontWeight: "900",
                                                            textAlign: "left",
                                                            cursor: "pointer"
                                                        }}
                                                        onMouseEnter={(e) =>
                                                            e.currentTarget.style.color =
                                                            colores.naranja
                                                        }
                                                        onMouseLeave={(e) =>
                                                            e.currentTarget.style.color =
                                                            "#fff"
                                                        }
                                                    >
                                                        {equipo.nombre}
                                                    </button>
                                                </td>

                                                <td>{equipo.pj}</td>
                                                <td>{equipo.pg}</td>
                                                <td>{equipo.pe}</td>
                                                <td>{equipo.pp}</td>
                                                <td>{equipo.gf}</td>
                                                <td>{equipo.gc}</td>

                                                <td>
                                                    {
                                                        equipo.dg > 0
                                                            ? `+${equipo.dg}`
                                                            : equipo.dg
                                                    }
                                                </td>

                                                <td>

                                                    <span
                                                        style={{
                                                            backgroundColor:
                                                                colores.naranja,
                                                            color: "#fff",
                                                            padding: "6px 10px",
                                                            fontWeight: "900",
                                                            borderRadius: "3px"
                                                        }}
                                                    >
                                                        {equipo.pts}
                                                    </span>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>


                        {/* REFERENCIA CLASIFICACIÓN */}

                        {
                            resumen?.formatoCompetencia !== "solo_liga" && (

                                <div
                                    className="mt-2"
                                    style={{
                                        color: colores.textoSecundario,
                                        fontSize: "0.78rem"
                                    }}
                                >
                                    <span
                                        style={{
                                            color: colores.naranja,
                                            fontWeight: "900"
                                        }}
                                    >
                                        ▌
                                    </span>
                                    {" "}
                                    Zona de clasificación a Play-Off
                                </div>

                            )
                        }

                    </section>

                )}


                {/* ================================= */}
                {/* SIN FIXTURE */}
                {/* ================================= */}

                {fixture.length === 0 && (

                    <div
                        className="text-center my-5 py-5"
                        style={{
                            backgroundColor: colores.superficie,
                            border: `1px solid ${colores.borde}`,
                            borderRadius: "4px"
                        }}
                    >

                        <div
                            style={{
                                fontSize: "2.5rem",
                                marginBottom: "15px"
                            }}
                        >
                            🏀
                        </div>

                        <div style={estiloEtiqueta}>
                            Próximamente
                        </div>

                        <h3
                            style={{
                                fontWeight: "900",
                                marginTop: "5px"
                            }}
                        >
                            La competencia aún no comenzó
                        </h3>

                        <p
                            style={{
                                color: colores.textoSecundario,
                                marginBottom: 0
                            }}
                        >
                            El fixture será publicado cuando se encuentre
                            disponible.
                        </p>

                    </div>

                )}


                {/* ================================= */}
                {/* FASE REGULAR */}
                {/* ================================= */}

                {
                    Object.keys(jornadasRegular).length > 0 && (

                        <section className="mt-5">

                            <div className="mb-3">

                                <div style={estiloEtiqueta}>
                                    Calendario
                                </div>

                                <h2
                                    style={{
                                        fontWeight: "900",
                                        letterSpacing: "-1px"
                                    }}
                                >
                                    Fase Regular
                                </h2>

                            </div>


                            <div
                                className="accordion"
                                id="accordionFixtureRegular"
                                data-bs-theme="dark"
                            >

                                {
                                    Object.entries(jornadasRegular).map(
                                        ([jornada, partidos], index) => (

                                            <div
                                                key={jornada}
                                                className="accordion-item"
                                                style={{
                                                    backgroundColor:
                                                        colores.superficie,
                                                    borderColor:
                                                        colores.borde
                                                }}
                                            >

                                                <h2 className="accordion-header">

                                                    <button
                                                        className={
                                                            `accordion-button ${index !== 0
                                                                ? "collapsed"
                                                                : ""
                                                            }`
                                                        }
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={
                                                            `#regular-${jornada}`
                                                        }
                                                        style={{
                                                            fontWeight: "800"
                                                        }}
                                                    >
                                                        Jornada {jornada}
                                                    </button>

                                                </h2>


                                                <div
                                                    id={`regular-${jornada}`}
                                                    className={
                                                        `accordion-collapse collapse ${index === 0
                                                            ? "show"
                                                            : ""
                                                        }`
                                                    }
                                                    data-bs-parent="#accordionFixtureRegular"
                                                >

                                                    <div
                                                        className="accordion-body"
                                                        style={{
                                                            backgroundColor:
                                                                colores.fondo
                                                        }}
                                                    >
                                                        {renderPartidos(partidos)}
                                                    </div>

                                                </div>

                                            </div>

                                        )
                                    )
                                }

                            </div>

                        </section>

                    )
                }


                {/* ================================= */}
                {/* PLAYOFFS */}
                {/* ================================= */}

                {
                    Object.keys(fasesPlayoff).length > 0 && (

                        <section
                            className="mt-5 pt-5"
                            style={{
                                borderTop:
                                    `1px solid ${colores.borde}`
                            }}
                        >

                            <div style={estiloEtiqueta}>
                                Camino al título
                            </div>

                            <h2
                                style={{
                                    fontWeight: "900",
                                    fontSize: "2.3rem",
                                    letterSpacing: "-1px",
                                    marginBottom: "25px"
                                }}
                            >
                                Play-Offs
                            </h2>


                            <div
                                className="accordion"
                                id="accordionPlayoffs"
                                data-bs-theme="dark"
                            >

                                {
                                    Object.entries(fasesPlayoff).map(
                                        ([fase, partidos], index) => {

                                            const tituloFase =
                                                fase === "cuartos"
                                                    ? "Cuartos de Final"
                                                    : fase === "semifinal"
                                                        ? "Semifinales"
                                                        : fase === "final"
                                                            ? "Final"
                                                            : fase;

                                            return (

                                                <div
                                                    key={fase}
                                                    className="accordion-item"
                                                    style={{
                                                        backgroundColor:
                                                            colores.superficie,
                                                        borderColor:
                                                            colores.borde
                                                    }}
                                                >

                                                    <h2 className="accordion-header">

                                                        <button
                                                            className={
                                                                `accordion-button ${index !== 0
                                                                    ? "collapsed"
                                                                    : ""
                                                                }`
                                                            }
                                                            type="button"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target={
                                                                `#playoff-${fase}`
                                                            }
                                                            style={{
                                                                fontWeight: "800"
                                                            }}
                                                        >

                                                            {tituloFase}

                                                        </button>

                                                    </h2>


                                                    <div
                                                        id={`playoff-${fase}`}
                                                        className={
                                                            `accordion-collapse collapse ${index === 0
                                                                ? "show"
                                                                : ""
                                                            }`
                                                        }
                                                        data-bs-parent="#accordionPlayoffs"
                                                    >

                                                        <div
                                                            className="accordion-body"
                                                            style={{
                                                                backgroundColor:
                                                                    colores.fondo
                                                            }}
                                                        >
                                                            {renderPartidos(partidos)}
                                                        </div>

                                                    </div>

                                                </div>

                                            );
                                        }
                                    )
                                }

                            </div>

                        </section>

                    )
                }

                {
                    mostrarEquipo &&
                    equipoSeleccionado && (

                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor:
                                    "rgba(0,0,0,0.75)",
                                zIndex: 1050,
                                padding: "20px"
                            }}
                        >

                            <div
                                style={{
                                    width: "100%",
                                    maxWidth: "800px",
                                    maxHeight: "85vh",
                                    overflowY: "auto",
                                    backgroundColor:
                                        colores.superficie,
                                    border:
                                        `1px solid ${colores.borde}`,
                                    borderRadius: "5px"
                                }}
                            >


                                {/* CABECERA */}

                                <div
                                    className="d-flex justify-content-between align-items-start"
                                    style={{
                                        padding: "25px",
                                        borderBottom:
                                            `1px solid ${colores.borde}`
                                    }}
                                >

                                    <div>

                                        <div
                                            style={{
                                                color:
                                                    colores.naranja,
                                                fontSize: "10px",
                                                fontWeight: "800",
                                                letterSpacing: "2.5px",
                                                textTransform:
                                                    "uppercase",
                                                marginBottom: "5px"
                                            }}
                                        >
                                            Plantel de la competencia
                                        </div>

                                        <h2
                                            style={{
                                                color: "#fff",
                                                fontWeight: "900",
                                                letterSpacing: "-1px",
                                                marginBottom: "5px"
                                            }}
                                        >
                                            {
                                                equipoSeleccionado.nombre
                                            }
                                        </h2>

                                        <div
                                            style={{
                                                color:
                                                    colores.textoSecundario,
                                                fontSize: "0.85rem"
                                            }}
                                        >
                                            Plantel{" "}
                                            {
                                                equipoSeleccionado.creado_en
                                            }
                                            {" · "}
                                            {
                                                equipoSeleccionado
                                                    .jugadores
                                                    ?.length || 0
                                            }
                                            {" jugadores"}
                                        </div>

                                    </div>


                                    <button
                                        type="button"
                                        onClick={() => {

                                            setMostrarEquipo(false);
                                            setEquipoSeleccionado(null);
                                        }}
                                        style={{
                                            background:
                                                "transparent",
                                            border: "none",
                                            color:
                                                "rgba(255,255,255,0.6)",
                                            fontSize: "1.4rem"
                                        }}
                                    >
                                        ×
                                    </button>

                                </div>


                                {/* JUGADORES */}

                                <div style={{ padding: "25px" }}>

                                    {
                                        !equipoSeleccionado.jugadores ||
                                            equipoSeleccionado.jugadores.length === 0
                                            ? (

                                                <div
                                                    style={{
                                                        color:
                                                            colores.textoSecundario
                                                    }}
                                                >
                                                    No existen jugadores registrados.
                                                </div>

                                            )
                                            : (

                                                <div className="d-flex flex-column gap-2">

                                                    {
                                                        equipoSeleccionado
                                                            .jugadores
                                                            .map((jugador) => {

                                                                const sanciones =
                                                                    jugador.sanciones ||
                                                                    [];

                                                                const suspendido =
                                                                    sanciones.length > 0;

                                                                return (

                                                                    <div
                                                                        key={
                                                                            jugador.id
                                                                        }
                                                                        style={{
                                                                            backgroundColor:
                                                                                colores
                                                                                    .superficieClara,
                                                                            border:
                                                                                `1px solid ${colores.borde}`,
                                                                            padding:
                                                                                "18px 20px",
                                                                            borderLeft:
                                                                                suspendido
                                                                                    ? "4px solid #ff6b6b"
                                                                                    : `4px solid ${colores.naranja}`
                                                                        }}
                                                                    >

                                                                        <div className="row align-items-start">

                                                                            {/* DORSAL */}

                                                                            <div className="col-2 col-md-1">

                                                                                <div
                                                                                    style={{
                                                                                        color:
                                                                                            colores.naranja,
                                                                                        fontSize:
                                                                                            "1.3rem",
                                                                                        fontWeight:
                                                                                            "900"
                                                                                    }}
                                                                                >
                                                                                    #
                                                                                    {
                                                                                        jugador.dorsal
                                                                                    }
                                                                                </div>

                                                                            </div>


                                                                            {/* JUGADOR */}

                                                                            <div className="col-10 col-md-4">

                                                                                <div
                                                                                    style={{
                                                                                        color:
                                                                                            "#fff",
                                                                                        fontWeight:
                                                                                            "900"
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        jugador.nombre
                                                                                    }{" "}
                                                                                    {
                                                                                        jugador.apellido
                                                                                    }
                                                                                </div>

                                                                                <div
                                                                                    style={{
                                                                                        color:
                                                                                            suspendido
                                                                                                ? "#ff6b6b"
                                                                                                : "#69db7c",
                                                                                        fontSize:
                                                                                            "10px",
                                                                                        fontWeight:
                                                                                            "900",
                                                                                        letterSpacing:
                                                                                            "1px",
                                                                                        textTransform:
                                                                                            "uppercase",
                                                                                        marginTop:
                                                                                            "4px"
                                                                                    }}
                                                                                >
                                                                                    ●{" "}
                                                                                    {
                                                                                        suspendido
                                                                                            ? "Suspendido"
                                                                                            : "Disponible"
                                                                                    }
                                                                                </div>

                                                                            </div>


                                                                            {/* DISCIPLINA */}

                                                                            <div className="col-12 col-md-7 mt-3 mt-md-0">

                                                                                {
                                                                                    sanciones.length ===
                                                                                        0 ? (

                                                                                        <div
                                                                                            style={{
                                                                                                color:
                                                                                                    colores.textoSecundario,
                                                                                                fontSize:
                                                                                                    "0.82rem"
                                                                                            }}
                                                                                        >
                                                                                            Sin sanciones activas
                                                                                        </div>

                                                                                    ) : (

                                                                                        sanciones.map(
                                                                                            (
                                                                                                sancion
                                                                                            ) => {

                                                                                                const restantes =
                                                                                                    sancion.fechas_suspension -
                                                                                                    sancion.fechas_cumplidas;

                                                                                                return (

                                                                                                    <div
                                                                                                        key={
                                                                                                            sancion.id
                                                                                                        }
                                                                                                        style={{
                                                                                                            marginBottom:
                                                                                                                "8px"
                                                                                                        }}
                                                                                                    >

                                                                                                        <div
                                                                                                            style={{
                                                                                                                color:
                                                                                                                    "#fff",
                                                                                                                fontWeight:
                                                                                                                    "800",
                                                                                                                fontSize:
                                                                                                                    "0.85rem"
                                                                                                            }}
                                                                                                        >
                                                                                                            {
                                                                                                                sancion.falta
                                                                                                            }
                                                                                                        </div>


                                                                                                        <div
                                                                                                            style={{
                                                                                                                color:
                                                                                                                    colores.textoSecundario,
                                                                                                                fontSize:
                                                                                                                    "0.78rem",
                                                                                                                marginTop:
                                                                                                                    "2px"
                                                                                                            }}
                                                                                                        >
                                                                                                            {
                                                                                                                sancion.tipo
                                                                                                            }

                                                                                                            {
                                                                                                                sancion.fechas_suspension >
                                                                                                                0 &&
                                                                                                                (
                                                                                                                    <>
                                                                                                                        {" · "}
                                                                                                                        {
                                                                                                                            sancion.fechas_cumplidas
                                                                                                                        }
                                                                                                                        /
                                                                                                                        {
                                                                                                                            sancion.fechas_suspension
                                                                                                                        }
                                                                                                                        {" fechas cumplidas"}
                                                                                                                        {" · "}
                                                                                                                        {
                                                                                                                            restantes
                                                                                                                        }
                                                                                                                        {" restante(s)"}
                                                                                                                    </>
                                                                                                                )
                                                                                                            }
                                                                                                        </div>

                                                                                                    </div>

                                                                                                );
                                                                                            }
                                                                                        )

                                                                                    )
                                                                                }

                                                                            </div>

                                                                        </div>

                                                                    </div>

                                                                );
                                                            })
                                                    }

                                                </div>

                                            )
                                    }

                                </div>


                                {/* PIE */}

                                <div
                                    className="text-end"
                                    style={{
                                        padding: "18px 25px",
                                        borderTop:
                                            `1px solid ${colores.borde}`
                                    }}
                                >

                                    <button
                                        type="button"
                                        onClick={() => {

                                            setMostrarEquipo(false);
                                            setEquipoSeleccionado(null);
                                        }}
                                        style={{
                                            backgroundColor:
                                                colores.naranja,
                                            color: "#fff",
                                            border: "none",
                                            padding: "10px 18px",
                                            borderRadius: "3px",
                                            fontWeight: "800",
                                            fontSize: "0.8rem",
                                            letterSpacing: "1px",
                                            textTransform: "uppercase"
                                        }}
                                    >
                                        Cerrar
                                    </button>

                                </div>

                            </div>

                        </div>

                    )
                }

            </div>

        </div>
    );
};

export default CompetenciaPublica;