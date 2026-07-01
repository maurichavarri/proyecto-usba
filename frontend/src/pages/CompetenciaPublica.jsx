import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const AdminFixture = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [detalle, setDetalle] = useState(null);
    const [resumen, setResumen] = useState(null);
    const [fixture, setFixture] = useState([]);
    const [tabla, setTabla] = useState([]);
    const [mensaje, setMensaje] = useState("");

    const todosJugados = fixture.length > 0 && fixture.every(partido => partido.estado === "jugado");

    useEffect(() => {
        obtenerFixture();
        obtenerTabla();
        obtenerResumen();
        obtenerDetalle();
    }, []);

    const obtenerFixture = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/torneo-categorias/${id}/fixture`);
            const data = await response.json();
            setFixture(data);
        } catch (error) {
            console.error(error);
        }
    };

    const obtenerTabla = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/torneo-categorias/${id}/tabla`);
            const data = await response.json();
            setTabla(data);
        } catch (error) {
            console.error(error);
        }
    };

    const obtenerResumen = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/torneo-categorias/${id}/resumen`);
            const data = await response.json();
            setResumen(data);
        } catch (error) {
            console.error(error);
        }
    };

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

    const renderTablaPartidos = (partidos) => (
        <table className="table table-bordered table-hover">
            <thead className="table-light">
                <tr>
                    <th>Local</th>
                    <th>Visitante</th>
                    <th>Resultado</th>
                    <th>Sede</th>
                    <th>Árbitro</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                {
                    partidos.map((partido) => (
                        <tr key={partido.id}>
                            <td>
                                {
                                    partido.local?.Equipo?.nombre
                                }
                            </td>
                            <td>
                                {
                                    partido.visitante?.Equipo?.nombre
                                }
                            </td>
                            <td>
                                {
                                    partido.estado === "jugado" ? `${partido.puntaje_local} - ${partido.puntaje_visitante}` : "-"
                                }
                            </td>
                            <td>
                                {
                                    partido.sede?.nombre || "Sin asignar"
                                }
                            </td>
                            <td>
                                {
                                    partido.arbitro ? `${partido.arbitro.nombre} ${partido.arbitro.apellido}` : "Sin asignar"
                                }
                            </td>
                            <td>
                                {
                                    partido.fecha ? new Date(partido.fecha).toLocaleDateString("es-AR") : "-"
                                }
                            </td>
                            <td>
                                {
                                    partido.estado === "pendiente" &&
                                    <span className="badge bg-warning text-dark">
                                        Pendiente
                                    </span>
                                }
                                {
                                    partido.estado === "jugado" &&
                                    <span className="badge bg-success">
                                        Jugado
                                    </span>
                                }
                                {
                                    partido.estado === "suspendido" &&
                                    <span className="badge bg-danger">
                                        Suspendido
                                    </span>
                                }
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );

    const partidosRegulares = fixture.filter(partido => !partido.fase || partido.fase === 'regular');
    const faseRegularFinalizada = partidosRegulares.length > 0 && partidosRegulares.every(partido => partido.estado === 'jugado');

    // Agrupar por jornada
    const jornadasRegular = {};
    const fasesPlayoff = {};

    fixture.forEach((partido) => {

        const fase = partido.fase || 'regular';

        // FASE REGULAR
        if (fase === 'regular') {

            if (!jornadasRegular[partido.jornada]) {
                jornadasRegular[partido.jornada] = [];
            }

            jornadasRegular[partido.jornada].push(partido);
        }

        // PLAYOFFS
        else {
            if (!fasesPlayoff[fase]) {
                fasesPlayoff[fase] = [];
            }

            fasesPlayoff[fase].push(partido);
        }
    });

    return (
        <div className="container mt-5 mb-5">

            {/* Header */}
            <div className="d-flex align-items-center mb-2">
                <h2 className="me-2">
                    Fixture
                </h2>
            </div>

            {/* Boton */}
            <div className="d-flex justify-content-between align-items-center mb-4">

                <button
                    className="btn btn-dark"
                    onClick={() => navigate(-1)}
                >
                    Volver
                </button>

            </div>

            {/* Información Resumen Encabezado */}
            {
                resumen &&

                <div className="row mb-4">

                    <div className="col-md-2">
                        <div className="card shadow-sm">
                            <div className="card-body text-center">
                                <small className="text-muted">
                                    Torneo
                                </small>
                                <h5>
                                    {resumen.torneo}
                                </h5>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="card shadow-sm">
                            <div className="card-body text-center">
                                <small className="text-muted">
                                    Categoría
                                </small>
                                <h5>
                                    {resumen.categoria}
                                </h5>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="card shadow-sm">
                            <div className="card-body text-center">
                                <small className="text-muted">
                                    Formato
                                </small>

                                <h5>
                                    {{
                                        solo_liga: "Liga",
                                        playoff_4: "Play-Off (4)",
                                        playoff_8: "Play-Off (8)"
                                    }[resumen.formatoCompetencia] || "-"}
                                </h5>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="card shadow-sm">
                            <div className="card-body text-center">
                                <small className="text-muted">
                                    Equipos
                                </small>
                                <h5>
                                    {resumen.equipos}
                                </h5>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="card shadow-sm">
                            <div className="card-body text-center">
                                <small className="text-muted">
                                    Partidos
                                </small>
                                <h5>
                                    {resumen.partidos}
                                </h5>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="card shadow-sm">
                            <div className="card-body text-center">
                                <small className="text-muted">
                                    Jugados
                                </small>
                                <h5 className="text-success">
                                    {resumen.partidosJugados}
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* Campeón y Subcampeón */}
            {
                detalle?.estado_competencia === "finalizado" &&
                detalle?.campeon &&
                detalle?.subcampeon && (

                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="card border-success">
                                <div className="card-body text-center">
                                    <h4>
                                        Campeón
                                    </h4>
                                    <h3 className="text-success">
                                        {detalle.campeon.nombre}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="card border-secondary">
                                <div className="card-body text-center">
                                    <h4>
                                        Subcampeón
                                    </h4>
                                    <h3 className="text-secondary">
                                        {detalle.subcampeon.nombre}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Tabla de posiciones */}
            {
                tabla.length > 0 && (
                    <div className="card shadow-sm mb-5">
                        <div className="card-header bg-dark text-white">
                            <strong>
                                Tabla de Posiciones
                            </strong>
                        </div>

                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
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
                                        {
                                            tabla.map((equipo, index) => (

                                                <tr key={equipo.equipo_id}>
                                                    <td>
                                                        {index + 1}
                                                    </td>
                                                    <td>
                                                        <strong>
                                                            {equipo.nombre}
                                                        </strong>
                                                    </td>
                                                    <td>{equipo.pj}</td>
                                                    <td>{equipo.pg}</td>
                                                    <td>{equipo.pe}</td>
                                                    <td>{equipo.pp}</td>
                                                    <td>{equipo.gf}</td>
                                                    <td>{equipo.gc}</td>
                                                    <td>
                                                        {
                                                            equipo.dg > 0 ? `+${equipo.dg}` : equipo.dg
                                                        }
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-success">
                                                            {equipo.pts}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Sin fixture */}
            {
                fixture.length === 0 &&
                <div className="alert alert-secondary">
                    Esta competencia aún no comenzó.
                </div>
            }

            {/* FASE REGULAR */}
            {
                Object.keys(jornadasRegular).length > 0 && (
                    <>
                        <h4 className="mb-3">Fase Regular</h4>

                        <div className="accordion" id="accordionFixtureRegular">

                            {Object.entries(jornadasRegular).map(([jornada, partidos], index) => (

                                <div key={jornada} className="accordion-item">

                                    <h2 className="accordion-header">
                                        <button
                                            className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#regular-${jornada}`}
                                        >
                                            <strong>Jornada {jornada}</strong>
                                        </button>
                                    </h2>

                                    <div
                                        id={`regular-${jornada}`}
                                        className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                                        data-bs-parent="#accordionFixtureRegular"
                                    >

                                        <div className="accordion-body">
                                            {renderTablaPartidos(partidos)}
                                        </div>

                                    </div>
                                </div>
                            )
                            )}
                        </div>
                    </>
                )
            }

            {/* PLAYOFFS */}
            {
                Object.keys(fasesPlayoff).length > 0 && (
                    <>
                        <hr className="my-5" />
                        <h4 className="mb-3">
                            Play-offs
                        </h4>

                        <div
                            className="accordion"
                            id="accordionPlayoffs"
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
                                            >

                                                <h2 className="accordion-header">

                                                    <button
                                                        className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={`#playoff-${fase}`}
                                                    >
                                                        <strong>
                                                            {tituloFase}
                                                        </strong>
                                                    </button>

                                                </h2>

                                                <div
                                                    id={`playoff-${fase}`}
                                                    className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                                                    data-bs-parent="#accordionPlayoffs"
                                                >

                                                    <div className="accordion-body">
                                                        {renderTablaPartidos(partidos)}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )
                            }
                        </div>
                    </>
                )
            }
        </div>
    );
};

export default AdminFixture;