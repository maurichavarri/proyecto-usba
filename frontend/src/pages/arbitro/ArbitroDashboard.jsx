import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ArbitroDashboard = () => {

    const [partidos, setPartidos] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        obtenerPartidos();
    }, []);

    const obtenerPartidos = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/v1/arbitros/mis-partidos",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Error al obtener los partidos"
                );
            }

            setPartidos(data);

        } catch (error) {
            console.error(error);
            setMensaje(error.message || "Error al cargar los partidos");
        } finally {
            setCargando(false);
        }
    };

    const obtenerEstado = (estado) => {
        if (estado === "jugado") {
            return (
                <span className="badge bg-success">
                    Jugado
                </span>
            );
        }

        if (estado === "suspendido") {
            return (
                <span className="badge bg-danger">
                    Suspendido
                </span>
            );
        }

        return (
            <span className="badge bg-warning text-dark">
                Pendiente
            </span>
        );

    };

    return (
        <div className="container mt-5 mb-5">
            <div className="col-lg-10 mx-auto">
                <div className="mb-4">
                    <h2 className="mb-1">
                        Panel del Árbitro
                    </h2>
                    <p className="text-muted mb-0">
                        Partidos asignados
                    </p>
                </div>

                {
                    mensaje &&
                    <div className="alert alert-danger">
                        {mensaje}
                    </div>
                }

                {
                    cargando ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">
                                    Cargando...
                                </span>
                            </div>
                        </div>
                    ) : partidos.length === 0 ? (
                        <div className="alert alert-info">
                            No tienes partidos asignados.
                        </div>
                    ) : (
                        <div className="row g-3">
                            {
                                partidos.map((partido) => (
                                    <div className="col-12 col-lg-6" key={partido.id}>
                                        <div className="card shadow-sm h-100">
                                            <div className="card-header d-flex justify-content-between align-items-center">
                                                <strong>
                                                    {
                                                        partido
                                                            .torneoCategoria
                                                            ?.torneo
                                                            ?.nombre
                                                    }
                                                    {" - "}
                                                    {
                                                        partido
                                                            .torneoCategoria
                                                            ?.categoria
                                                            ?.nombre
                                                    }
                                                </strong>

                                                {obtenerEstado(partido.estado)}
                                            </div>

                                            <div className="card-body">
                                                <div className="text-center mb-3">
                                                    <h5 className="mb-1">
                                                        {partido.local?.Equipo?.nombre}
                                                        {" vs "}
                                                        {partido.visitante?.Equipo?.nombre}
                                                    </h5>

                                                    {
                                                        partido.estado === "jugado" && (
                                                            <h4 className="mt-2 mb-0">
                                                                {partido.puntaje_local}
                                                                {" - "}
                                                                {partido.puntaje_visitante}
                                                            </h4>
                                                        )
                                                    }
                                                </div>

                                                <hr />

                                                <p className="mb-2">

                                                    <strong>
                                                        Fecha:
                                                    </strong>

                                                    {" "}

                                                    {
                                                        partido.fecha
                                                            ? new Date(
                                                                partido.fecha
                                                            ).toLocaleString(
                                                                "es-AR"
                                                            )
                                                            : "Sin asignar"
                                                    }

                                                </p>

                                                <p className="mb-2">

                                                    <strong>
                                                        Sede:
                                                    </strong>

                                                    {" "}

                                                    {
                                                        partido.sede?.nombre ||
                                                        "Sin asignar"
                                                    }

                                                </p>

                                                <p className="mb-3">
                                                    <strong>
                                                        Fase:
                                                    </strong>

                                                    {" "}

                                                    {
                                                        partido.fase === "regular"
                                                            ? `Regular - Jornada ${partido.jornada}`
                                                            : partido.fase === "cuartos"
                                                                ? "Cuartos de final"
                                                                : partido.fase === "semifinal"
                                                                    ? "Semifinal"
                                                                    : partido.fase === "final"
                                                                        ? "Final"
                                                                        : partido.fase
                                                    }
                                                </p>

                                                <div className="d-flex justify-content-end">
                                                    <Link
                                                        to={`/panel/arbitro/partidos/${partido.id}`}
                                                        className="btn btn-dark"
                                                    >
                                                        Ver partido
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default ArbitroDashboard;