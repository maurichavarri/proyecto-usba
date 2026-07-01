import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CompetenciaPublica = () => {

    const { id } = useParams();
    const [detalle, setDetalle] = useState(null);
    const [tabActiva, setTabActiva] = useState("fixture");
    const [fixture, setFixture] = useState([]);

    const partidosRegular = fixture.filter(partido => partido.fase === "regular");

    const partidosPlayoff = fixture.filter(partido => partido.fase !== "regular");

    const jornadasRegular = partidosRegular.reduce((acc, partido) => {
        if (!acc[partido.jornada]) {
            acc[partido.jornada] = [];
        }
        acc[partido.jornada].push(partido);
        return acc;
    }, {});

    const fasesPlayoff = partidosPlayoff.reduce((acc, partido) => {
        if (!acc[partido.fase]) {
            acc[partido.fase] = [];
        }
        acc[partido.fase].push(partido);
        return acc;
    }, {});

    useEffect(() => {
        obtenerDetalle();
        obtenerFixture();
    }, [id]);

    const obtenerDetalle = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/torneo-categorias/${id}`);
            const data = await response.json();
            setDetalle(data);
        } catch (error) {
            console.error(error);
        }
    };

    const obtenerFixture = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/torneo-categorias/${id}/fixture`);
            const data = await response.json();
            setFixture(data);
        } catch (error) {
            console.error(error);
        }
    };

    if (!detalle) {
        return (
            <div className="container mt-5">
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <>
            <section className="container my-4">
                <h2>
                    {detalle.torneo.nombre}
                </h2>
                <h4 className="text-muted mb-4">
                    Categoría {detalle.categoria.nombre}
                </h4>
                <div className="row g-3">

                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body text-center">
                                <small className="text-muted">
                                    Equipos
                                </small>
                                <h3>
                                    {detalle.equipos_inscriptos}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body text-center">
                                <small className="text-muted">
                                    Partidos
                                </small>
                                <h3>
                                    {detalle.partidos_generados}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body text-center">
                                <small className="text-muted">
                                    Jugados
                                </small>
                                <h3>
                                    {detalle.partidos_jugados}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body text-center">
                                <small className="text-muted">
                                    Formato
                                </small>
                                <h5>
                                    {{
                                        solo_liga: "Liga",
                                        playoff_4: "Liga + Play-Off (4)",
                                        playoff_8: "Liga + Play-Off (8)"
                                    }[detalle.formato_competencia]}
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-5">

                    <ul className="nav nav-tabs">

                        <li className="nav-item">

                            <button
                                className={`nav-link ${tabActiva === "fixture"
                                    ? "active"
                                    : ""
                                    }`}
                                onClick={() => setTabActiva("fixture")}
                            >
                                Fixture
                            </button>

                        </li>

                        <li className="nav-item">

                            <button
                                className={`nav-link ${tabActiva === "tabla"
                                    ? "active"
                                    : ""
                                    }`}
                                onClick={() => setTabActiva("tabla")}
                            >
                                Tabla
                            </button>

                        </li>

                        <li className="nav-item">

                            <button
                                className={`nav-link ${tabActiva === "equipos"
                                    ? "active"
                                    : ""
                                    }`}
                                onClick={() => setTabActiva("equipos")}
                            >
                                Equipos
                            </button>

                        </li>

                    </ul>

                </div>

                <div className="mt-4">

                    {
                        tabActiva === "fixture" &&

                        <div>

                            <h4>Fixture</h4>

                            <p>Próximamente...</p>

                        </div>
                    }

                    {
                        tabActiva === "tabla" &&

                        <div>

                            <h4>Tabla de posiciones</h4>

                            <p>Próximamente...</p>

                        </div>
                    }

                    {
                        tabActiva === "equipos" &&

                        <div>

                            <h4>Equipos participantes</h4>

                            <p>Próximamente...</p>

                        </div>
                    }

                </div>
            </section>
        </>
    );
};

export default CompetenciaPublica;