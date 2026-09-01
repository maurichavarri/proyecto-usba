import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ArbitroPartido = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [partido, setPartido] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState("");

    const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);

    const [falta, setFalta] = useState("");
    const [tipo, setTipo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fechasSuspension, setFechasSuspension] = useState(0);

    useEffect(() => {
        obtenerPartido();
    }, [id]);

    const obtenerPartido = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:3000/api/v1/arbitros/mis-partidos/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Error al obtener el partido"
                );
            }

            setPartido(data);
        } catch (error) {
            console.error(error);
            setMensaje(error.message);
        } finally {
            setCargando(false);
        }
    };

    const seleccionarJugador = (jugador) => {
        setJugadorSeleccionado(jugador);
        setFalta("");
        setTipo("");
        setDescripcion("");
        setFechasSuspension(0);
    };

    const cancelarSancion = () => {
        setJugadorSeleccionado(null);
        setFalta("");
        setTipo("");
        setDescripcion("");
        setFechasSuspension(0);
    };

    const registrarSancion = async (e) => {

        e.preventDefault();

        if (!jugadorSeleccionado) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:3000/api/v1/arbitros/partidos/${id}/sanciones`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        jugador_id: jugadorSeleccionado.id,
                        falta,
                        tipo,
                        descripcion,
                        fechas_suspension: Number(fechasSuspension)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Error al registrar la sanción"
                );
            }

            setMensaje(data.message);

            cancelarSancion();
            // Recargar para actualizar el estado del jugador

            obtenerPartido();
        } catch (error) {
            console.error(error);
            setMensaje(error.message);
        }
    };


    const renderEstadoJugador = (estado) => {
        if (estado === "activo") {
            return (
                <span className="badge bg-success">
                    Disponible
                </span>
            );
        }
        return (
            <span className="badge bg-danger">
                Inactivo
            </span>
        );
    };


    const renderJugadores = (equipo) => {
        const jugadores = equipo?.jugadores || [];
        if (jugadores.length === 0) {
            return (
                <p className="text-muted mb-0">
                    No hay jugadores registrados.
                </p>
            );
        }

        return (
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Dorsal</th>
                            <th>Jugador</th>
                            <th>Estado</th>
                            {
                                partido?.estado === "jugado" &&
                                <th>Acciones</th>
                            }
                        </tr>
                    </thead>

                    <tbody>
                        {
                            [...jugadores]
                                .sort((a, b) => a.dorsal - b.dorsal)
                                .map((jugador) => (
                                    <tr key={jugador.id}>
                                        <td>
                                            <strong>
                                                #{jugador.dorsal}
                                            </strong>
                                        </td>
                                        <td>{jugador.nombre} {jugador.apellido}</td>
                                        <td>{renderEstadoJugador(jugador.estado)}</td>
                                        {
                                            partido?.estado === "jugado" &&
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() =>
                                                        seleccionarJugador(jugador)
                                                    }
                                                >
                                                    Registrar falta
                                                </button>
                                            </td>
                                        }
                                    </tr>
                                ))
                        }
                    </tbody>
                </table>
            </div>
        );
    };

    if (cargando) {
        return (
            <div className="container mt-5 text-center">
                <div
                    className="spinner-border"
                    role="status"
                >
                    <span className="visually-hidden">
                        Cargando...
                    </span>
                </div>
            </div>
        );
    }

    if (!partido) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    No fue posible cargar el partido.
                </div>

                <button
                    className="btn btn-dark"
                    onClick={() => navigate(-1)}
                >
                    Volver
                </button>
            </div>
        );
    }

    const equipoLocal = partido.local?.Equipo;
    const equipoVisitante = partido.visitante?.Equipo;

    return (
        <div className="container mt-5 mb-5">
            <div className="col-lg-10 mx-auto">
                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>
                        <h2 className="mb-1">
                            Detalle del Partido
                        </h2>

                        <span className="text-muted">
                            {
                                partido.torneoCategoria?.torneo?.nombre
                            }
                            {" - "}
                            {
                                partido.torneoCategoria?.categoria?.nombre
                            }
                        </span>

                    </div>

                    <button
                        className="btn btn-dark"
                        onClick={() => navigate(-1)}
                    >
                        Volver
                    </button>

                </div>


                {
                    mensaje &&
                    <div className="alert alert-info">
                        {mensaje}
                    </div>
                }


                {/* INFORMACIÓN DEL PARTIDO */}
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <div className="row align-items-center text-center">
                            <div className="col-md-5">
                                <h4>
                                    {equipoLocal?.nombre}
                                </h4>
                            </div>

                            <div className="col-md-2">
                                {
                                    partido.estado === "jugado"
                                        ? (
                                            <h3 className="mb-0">
                                                {partido.puntaje_local}
                                                {" - "}
                                                {partido.puntaje_visitante}
                                            </h3>
                                        )
                                        : (
                                            <h5 className="text-muted mb-0">
                                                VS
                                            </h5>
                                        )
                                }

                            </div>

                            <div className="col-md-5">

                                <h4>
                                    {equipoVisitante?.nombre}
                                </h4>

                            </div>

                        </div>


                        <hr />


                        <div className="row">

                            <div className="col-md-3 mb-2">

                                <strong>Estado:</strong>

                                <div>

                                    {
                                        partido.estado === "jugado"
                                            ? (
                                                <span className="badge bg-success">
                                                    Jugado
                                                </span>
                                            )
                                            : partido.estado === "suspendido"
                                                ? (
                                                    <span className="badge bg-danger">
                                                        Suspendido
                                                    </span>
                                                )
                                                : (
                                                    <span className="badge bg-warning text-dark">
                                                        Pendiente
                                                    </span>
                                                )
                                    }

                                </div>

                            </div>


                            <div className="col-md-3 mb-2">

                                <strong>Fecha:</strong>

                                <div>
                                    {
                                        partido.fecha
                                            ? new Date(partido.fecha).toLocaleString(
                                                "es-AR",
                                                {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false
                                                }
                                            )
                                            : "-"
                                    }
                                </div>

                            </div>


                            <div className="col-md-3 mb-2">

                                <strong>Sede:</strong>

                                <div>
                                    {partido.sede?.nombre || "Sin asignar"}
                                </div>

                            </div>


                            <div className="col-md-3 mb-2">

                                <strong>Fase:</strong>

                                <div>
                                    {
                                        partido.fase === "regular"
                                            ? `Regular - Jornada ${partido.jornada}`
                                            : partido.fase === "cuartos"
                                                ? "Cuartos de final"
                                                : partido.fase === "semifinal"
                                                    ? "Semifinal"
                                                    : "Final"
                                    }
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* JUGADORES LOCAL */}

                <div className="card shadow-sm mb-4">

                    <div className="card-header bg-dark text-white">

                        <strong>
                            {equipoLocal?.nombre}
                        </strong>

                    </div>

                    <div className="card-body">

                        {renderJugadores(equipoLocal)}

                    </div>

                </div>


                {/* JUGADORES VISITANTE */}

                <div className="card shadow-sm mb-4">

                    <div className="card-header bg-dark text-white">

                        <strong>
                            {equipoVisitante?.nombre}
                        </strong>

                    </div>

                    <div className="card-body">

                        {renderJugadores(equipoVisitante)}

                    </div>

                </div>

                {
                    partido?.sanciones?.length > 0 && (
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-dark text-white">
                                <strong>
                                    Sanciones registradas
                                </strong>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Jugador</th>
                                                <th>Falta</th>
                                                <th>Tipo</th>
                                                <th>Suspensión</th>
                                                <th>Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                partido.sanciones.map((sancion) => (
                                                    <tr key={sancion.id}>
                                                        <td>
                                                            <strong>
                                                                #{sancion.jugador?.dorsal}
                                                            </strong>
                                                            {" "}
                                                            {sancion.jugador?.nombre}
                                                            {" "}
                                                            {sancion.jugador?.apellido}
                                                        </td>
                                                        <td>{sancion.falta}</td>
                                                        <td>{sancion.tipo?.charAt(0).toUpperCase() + sancion.tipo?.slice(1)}</td>
                                                        <td>{sancion.fechas_suspension > 0 ? `${sancion.fechas_suspension} fecha(s)` : "Sin suspensión"}</td>
                                                        <td>
                                                            {
                                                                sancion.estado === "activa"
                                                                    ? (
                                                                        <span className="badge bg-danger">
                                                                            Activa
                                                                        </span>
                                                                    )
                                                                    : (
                                                                        <span className="badge bg-success">
                                                                            Cumplida
                                                                        </span>
                                                                    )
                                                            }
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )
                }


                {/* FORMULARIO SANCIÓN */}

                {
                    jugadorSeleccionado && (

                        <div className="card border-danger shadow-sm">

                            <div className="card-header bg-danger text-white">

                                <strong>
                                    Registrar falta
                                </strong>

                            </div>

                            <div className="card-body">

                                <h5 className="mb-3">

                                    #{jugadorSeleccionado.dorsal}{" "}

                                    {jugadorSeleccionado.nombre}{" "}
                                    {jugadorSeleccionado.apellido}

                                </h5>


                                <form onSubmit={registrarSancion}>

                                    <div className="row">


                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Falta
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                value={falta}
                                                onChange={(e) =>
                                                    setFalta(e.target.value)
                                                }
                                                required
                                            />

                                        </div>


                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Tipo
                                            </label>

                                            <select
                                                className="form-select"
                                                value={tipo}
                                                onChange={(e) =>
                                                    setTipo(e.target.value)
                                                }
                                                required
                                            >

                                                <option value="">
                                                    Seleccionar tipo
                                                </option>

                                                <option value="tecnica">
                                                    Técnica
                                                </option>

                                                <option value="antideportiva">
                                                    Antideportiva
                                                </option>

                                                <option value="descalificante">
                                                    Descalificante
                                                </option>

                                                <option value="expulsion">
                                                    Expulsión
                                                </option>

                                                <option value="otra">
                                                    Otra
                                                </option>

                                            </select>

                                        </div>


                                        <div className="col-12 mb-3">

                                            <label className="form-label">
                                                Explicación
                                            </label>

                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={descripcion}
                                                onChange={(e) =>
                                                    setDescripcion(e.target.value)
                                                }
                                                required
                                            />

                                        </div>


                                        <div className="col-md-4 mb-3">

                                            <label className="form-label">
                                                Fechas de suspensión
                                            </label>

                                            <input
                                                type="number"
                                                className="form-control"
                                                min="0"
                                                value={fechasSuspension}
                                                onChange={(e) =>
                                                    setFechasSuspension(e.target.value)
                                                }
                                                required
                                            />

                                        </div>

                                    </div>


                                    <div className="d-flex gap-2">

                                        <button
                                            type="submit"
                                            className="btn btn-danger"
                                        >
                                            Registrar sanción
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={cancelarSancion}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default ArbitroPartido;