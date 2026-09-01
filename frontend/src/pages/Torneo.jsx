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

    const { data } = useFetch(
        "http://localhost:3000/api/v1/torneos"
    );

    const [torneoExpandido, setTorneoExpandido] =
        useState(null);


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
                    <span className="tor-hero-eyebrow">USBA · Básquet Amateur</span>
                    <h1 className="tor-hero-title">Torneos en competencia</h1>
                    <p className="tor-hero-sub">
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
};


export default Torneo;