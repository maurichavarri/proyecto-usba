import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const AdminFixture = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [detalle, setDetalle] = useState(null);
    const [resumen, setResumen] = useState(null);
    const [showHelp, setShowHelp] = useState(false);
    const [mostrarModalFixture, setMostrarModalFixture] = useState(false);
    const [fixture, setFixture] = useState([]);
    const [tabla, setTabla] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [mostrarModalPlayoff, setMostrarModalPlayoff] = useState(false);
    const [mostrarModalFinalizar, setMostrarModalFinalizar] = useState(false);

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

    const generarFixture = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:3000/api/v1/torneo-categorias/${id}/fixture`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMensaje(data.message);
                return;
            }

            setMensaje("Fixture generado correctamente");
            obtenerFixture();
            obtenerTabla();

        } catch (error) {
            console.error(error);
            setMensaje("Error al generar fixture");
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
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:3000/api/v1/admin/torneo-categorias/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(
                    data.message || "Error al obtener la competencia"
                );
            }
            setDetalle(data);
        } catch (error) {
            console.error(error);
        }
    };

    const generarPlayoffs = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:3000/api/v1/torneo-categorias/${id}/playoffs`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMensaje(data.message);
                return;
            }

            setMensaje("Playoffs generados correctamente");
            obtenerFixture();

        } catch (error) {
            console.error(error);
            setMensaje("Error al generar playoffs");
        }
    };

    const finalizarCompetencia = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:3000/api/v1/torneo-categorias/${id}/finalizar`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMensaje(data.message);
                return;
            }

            setMensaje(data.message);

            await obtenerDetalle();
            await obtenerFixture();

        } catch (error) {
            console.error(error);
            setMensaje("Error al finalizar la competencia");
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
                    <th>Acciones</th>
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
                            <td>
                                <Link
                                    to={`/panel/admin/partidos/${partido.id}`}
                                    className="btn btn-dark btn-sm"
                                >
                                    Gestionar
                                </Link>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );

    const partidosRegulares = fixture.filter(partido => !partido.fase || partido.fase === 'regular');
    const faseRegularFinalizada = partidosRegulares.length > 0 && partidosRegulares.every(partido => partido.estado === 'jugado');
    const existeFinal = fixture.some(partido => partido.fase === "final");
    const finalJugada = fixture.some(partido => partido.fase === "final" && partido.estado === "jugado");
    const puedeFinalizarCompetencia = detalle?.formato_competencia === "solo_liga" ? todosJugados : existeFinal && finalJugada;

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
            <div className="col-lg-10 mx-auto">
                {/* Header */}
                <div className="d-flex align-items-center mb-2">

                    <h2 className="me-2">
                        Fixture
                    </h2>

                    <span
                        className="text-primary"
                        style={{
                            cursor: "pointer",
                            fontSize: "1.2rem"
                        }}
                        onClick={() => setShowHelp(true)}
                        title="Ayuda"
                    >
                        ❓
                    </span>

                </div>

                <nav
                    className="mb-3"
                    style={{
                        fontSize: "0.9rem"
                    }}
                >

                    <Link
                        to="/panel/admin"
                        className="text-primary"
                    >
                        Admin Dashboard
                    </Link>

                    {" > "}

<<<<<<< HEAD
                    <Link
                        to="/panel/admin/torneo-categorias"
                        className="text-primary"
                    >
                        Torneos - Categorías
                    </Link>
=======
                <Link
                    to="/panel/admin"
                    className="text-primary"
                >
                    Panel del Administrador
                </Link>
>>>>>>> 63c6e1b (cambios de administrador y delegados)

                    {" > "}

                    <span className="text-muted">
                        Fixture
                    </span>

                </nav>

                {/* Botones */}
                <div className="d-flex justify-content-between align-items-center mb-4">

                    <button
                        className="btn btn-dark"
                        onClick={() => navigate(-1)}
                    >
                        Volver
                    </button>

                    <div className="d-flex gap-2">

<<<<<<< HEAD
                        {
                            fixture.length === 0 &&
=======
                <button
                    className="btn btn-dark"
                    onClick={() => navigate("/panel/admin/torneo-categorias")}
                >
                    ← Regresar a Torneos y Categorias
                </button> 
>>>>>>> 63c6e1b (cambios de administrador y delegados)

                            <button
                                onClick={() => setMostrarModalFixture(true)}
                                className="btn btn-primary"
                            >
                                Generar Fixture
                            </button>
                        }

                        {
                            detalle &&
                            detalle.formato_competencia !== "solo_liga" &&
                            faseRegularFinalizada &&
                            !fixture.some(
                                partido =>
                                    partido.fase === "cuartos" ||
                                    partido.fase === "semifinal" ||
                                    partido.fase === "final"
                            ) &&

                            <button
                                onClick={() => setMostrarModalPlayoff(true)}
                                className="btn btn-success"
                            >
                                Generar Playoffs
                            </button>
                        }

                        {
                            puedeFinalizarCompetencia &&
                            detalle?.estado_competencia !== "finalizado" &&

                            <button
                                className="btn btn-danger"
                                onClick={() => setMostrarModalFinalizar(true)}
                            >
                                Finalizar Competencia
                            </button>
                        }
                    </div>

                </div>

                {/* Mensajes */}
                {
                    mensaje &&
                    <div className="alert alert-info">
                        {mensaje}
                    </div>
                }

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
                                            playoff_4: "Liga + Play-Off (4)",
                                            playoff_8: "Liga + Play-Off (8)"
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
                                                tabla.map(
                                                    (
                                                        equipo,
                                                        index
                                                    ) => (

                                                        <tr
                                                            key={equipo.equipo_id}
                                                        >

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
                                                                    equipo.dg > 0
                                                                        ? `+${equipo.dg}`
                                                                        : equipo.dg
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
                        No hay fixture generado.
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

                {
                    showHelp && (

                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor:
                                    "rgba(0,0,0,0.5)",
                                zIndex: 1050
                            }}
                        >

                            <div className="bg-white p-4 rounded shadow" style={{ maxWidth: "600px" }}>

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5>¿Cómo funciona este apartado?</h5>
                                    <button className="btn-close" onClick={() => setShowHelp(false)} />
                                </div>

                                <p>Desde aquí podés visualizar y administrar el fixture generado para esta categoría del torneo.</p>

                                <ul>
                                    <li>Consultar la tabla de posiciones.</li>
                                    <li>Ver los partidos agrupados por jornada.</li>
                                    <li>Gestionar cada partido.</li>
                                    <li>Asignar árbitros, sedes y fechas.</li>
                                    <li>Registrar resultados.</li>
                                </ul>

                                <p className="mb-0">Una vez generados los partidos, las posiciones se actualizarán automáticamente a medida que se carguen los resultados.</p>
                            </div>
                        </div>
                    )
                }

                {/* Modal de Generar Fixture */}
                {
                    mostrarModalFixture && (

                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor: "rgba(0,0,0,0.5)",
                                zIndex: 1050
                            }}
                        >

                            <div
                                className="bg-white p-4 rounded shadow"
                                style={{
                                    width: "90%",
                                    maxWidth: "500px"
                                }}
                            >

                                <div className="text-center mb-3">

                                    <div
                                        className="text-warning"
                                        style={{
                                            fontSize: "3rem"
                                        }}
                                    >
                                        ⚠
                                    </div>

                                    <h4>
                                        Generar Fixture
                                    </h4>

                                </div>

                                <p className="text-center">
                                    ¿Estás seguro de que deseas generar el Fixture?
                                </p>

                                <div className="alert alert-warning">

                                    <strong>Advertencia:</strong>

                                    <br />

                                    Una vez generado el Fixture, esta acción no podrá deshacerse.

                                    <br /><br />

                                    La información del torneo vinculado tampoco podrá modificarse.

                                </div>

                                <div className="d-flex justify-content-center gap-2">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            setMostrarModalFixture(false)
                                        }
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => {
                                            setMostrarModalFixture(false);
                                            generarFixture();
                                        }}
                                    >
                                        Aceptar y generar
                                    </button>

                                </div>

                            </div>

                        </div>

                    )
                }

                {
                    mostrarModalPlayoff && (

                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor: "rgba(0,0,0,0.5)",
                                zIndex: 1050
                            }}
                        >

                            <div
                                className="bg-white p-4 rounded shadow"
                                style={{
                                    width: "90%",
                                    maxWidth: "500px"
                                }}
                            >

                                <div className="text-center">

                                    <div
                                        className="text-warning mb-2"
                                        style={{ fontSize: "3rem" }}
                                    >
                                        ⚠
                                    </div>

                                    <h4>
                                        Generar Play-Off
                                    </h4>

                                    <p>
                                        ¿Estás seguro de que deseas generar la fase de Play-Off?
                                    </p>

                                </div>

                                <div className="alert alert-warning">
                                    Una vez generado el Play-Off, los equipos clasificados
                                    quedarán definidos según la tabla de posiciones de la
                                    fase regular.
                                </div>

                                <div className="d-flex justify-content-center gap-2">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            setMostrarModalPlayoff(false)
                                        }
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={async () => {

                                            setMostrarModalPlayoff(false);

                                            await generarPlayoffs();
                                        }}
                                    >
                                        Aceptar y generar
                                    </button>

                                </div>

                            </div>

                        </div>
                    )
                }

                {
                    mostrarModalFinalizar && (

                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor: "rgba(0,0,0,0.5)",
                                zIndex: 1050
                            }}
                        >

                            <div
                                className="bg-white p-4 rounded shadow"
                                style={{
                                    width: "90%",
                                    maxWidth: "500px"
                                }}
                            >

                                <div className="text-center">

                                    <div
                                        className="text-danger mb-2"
                                        style={{ fontSize: "3rem" }}
                                    >
                                        ⚠
                                    </div>

                                    <h4>
                                        Finalizar Competencia
                                    </h4>

                                    <p>
                                        ¿Estás seguro de que deseas finalizar la competencia?
                                    </p>

                                </div>

                                <div className="alert alert-danger">
                                    Esta acción marcará la competencia como finalizada.
                                    El campeón y subcampeón quedarán definidos y ya no
                                    se podrán realizar cambios deportivos sobre la competencia.
                                </div>

                                <div className="d-flex justify-content-center gap-2">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            setMostrarModalFinalizar(false)
                                        }
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={async () => {

                                            setMostrarModalFinalizar(false);

                                            await finalizarCompetencia();
                                        }}
                                    >
                                        Aceptar y finalizar
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

export default AdminFixture;