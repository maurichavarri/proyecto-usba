import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminTorneos = () => {

    const navigate = useNavigate();

    const [torneos, setTorneos] = useState([]);
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        obtenerTorneos();
    }, []);

    const obtenerTorneos = async () => {
        try {

            const token =
                localStorage.getItem("token");

            const response =
                await fetch(
                    "http://localhost:3000/api/v1/torneos/admin/todos",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            const data =
                await response.json();

            setTorneos(data);

        } catch (error) {

            console.error(error);
        }
    };

    const cambiarEstado = async (id) => {

        try {

            const token =
                localStorage.getItem("token");

            await fetch(
                `http://localhost:3000/api/v1/torneos/${id}/estado`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            obtenerTorneos();

        } catch (error) {

            console.error(error);
        }
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return "-";
        return new Date(fecha).toLocaleDateString();
    };

    return (
        <div className="container mt-4 mb-5">

            <div className="col-12">

                {/* Título */}

                <div className="d-flex align-items-center mb-2">

                    <h2 className="me-2">
                        Gestión de Torneos
                    </h2>

                    <span
                        style={{
                            cursor: "pointer",
                            fontSize: "1.2rem"
                        }}
                        className="text-primary"
                        onClick={() =>
                            setShowHelp(true)
                        }
                    >
                        ❓
                    </span>

                </div>

                {/* Breadcrumb */}

                <nav
                    className="mb-3"
                    style={{
                        fontSize: "0.9rem"
                    }}
                >

                    <span
                        className="text-primary"
                        style={{
                            cursor: "pointer"
                        }}
                        onClick={() =>
                            navigate("/panel/admin")
                        }
                    >
                        Admin Dashboard
                    </span>

                    {" > "}

                    <span className="text-muted">
                        Torneos
                    </span>

                </nav>

                {/* Botones */}

                <div className="d-flex justify-content-between mb-3">

                    <button
                        className="btn btn-dark"
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        Volver
                    </button>

                    <Link
                        to="/panel/admin/torneos/crear"
                        className="btn btn-dark"
                    >
                        Crear torneo
                    </Link>

                </div>

                {/* Tabla */}

                <div className="card shadow-sm">

                    <div className="card-header bg-dark text-white">

                        <strong>
                            Torneos registrados
                        </strong>

                    </div>

                    <div className="card-body">

                        {
                            torneos.length === 0 ? (

                                <div className="alert alert-info mb-0">

                                    No existen torneos registrados.

                                </div>

                            ) : (

                                <div className="table-responsive">

                                    <table className="table table-hover align-middle">

                                        <thead>

                                            <tr>

                                                <th>Nombre</th>

                                                <th>Inicio</th>

                                                <th>Cierre inscripción</th>

                                                <th>Fin</th>

                                                <th>Inscripciones</th>

                                                <th>Estado</th>

                                                <th>Acciones</th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {
                                                torneos.map((torneo) => (

                                                    <tr key={torneo.id}>

                                                        <td>
                                                            <strong>
                                                                {torneo.nombre}
                                                            </strong>
                                                        </td>

                                                        <td>
                                                            {
                                                                formatearFecha(
                                                                    torneo.fecha_inicio
                                                                )
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                formatearFecha(
                                                                    torneo.fecha_cierre_inscripcion
                                                                )
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                formatearFecha(
                                                                    torneo.fecha_fin
                                                                )
                                                            }
                                                        </td>

                                                        <td>

                                                            {
                                                                new Date()
                                                                    <=
                                                                new Date(
                                                                    torneo.fecha_cierre_inscripcion
                                                                )

                                                                    ? (
                                                                        <span className="badge bg-success">
                                                                            Abiertas
                                                                        </span>
                                                                    )

                                                                    : (
                                                                        <span className="badge bg-danger">
                                                                            Cerradas
                                                                        </span>
                                                                    )
                                                            }

                                                        </td>

                                                        <td>

                                                            {
                                                                torneo.estado === "activo"
                                                                    ? (
                                                                        <span className="badge bg-success">
                                                                            Activo
                                                                        </span>
                                                                    )
                                                                    : (
                                                                        <span className="badge bg-danger">
                                                                            Archivado
                                                                        </span>
                                                                    )
                                                            }

                                                        </td>

                                                        <td>

                                                            <div className="d-flex gap-2">

                                                                <Link
                                                                    to={`/panel/admin/torneos/editar/${torneo.id}`}
                                                                    className="btn btn-dark btn-sm"
                                                                >
                                                                    Editar
                                                                </Link>

                                                                <button
                                                                    className={
                                                                        torneo.estado === "activo"
                                                                            ? "btn btn-danger btn-sm"
                                                                            : "btn btn-success btn-sm"
                                                                    }
                                                                    onClick={() =>
                                                                        cambiarEstado(
                                                                            torneo.id
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        torneo.estado === "activo"
                                                                            ? "Archivar"
                                                                            : "Activar"
                                                                    }
                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>

                                                ))
                                            }

                                        </tbody>

                                    </table>

                                </div>

                            )
                        }

                    </div>

                </div>

                {/* Modal Ayuda */}

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

                            <div
                                className="bg-white p-4 rounded shadow"
                                style={{
                                    maxWidth: "550px"
                                }}
                            >

                                <div className="d-flex justify-content-between align-items-center mb-3">

                                    <h5>
                                        ¿Cómo funciona este apartado?
                                    </h5>

                                    <button
                                        className="btn-close"
                                        onClick={() =>
                                            setShowHelp(false)
                                        }
                                    />

                                </div>

                                <p>

                                    Desde esta sección podés
                                    administrar todos los torneos
                                    del sistema.

                                </p>

                                <ul>

                                    <li>
                                        Crear nuevos torneos.
                                    </li>

                                    <li>
                                        Modificar torneos existentes.
                                    </li>

                                    <li>
                                        Definir la fecha límite de inscripción.
                                    </li>

                                    <li>
                                        Activar o archivar torneos.
                                    </li>

                                    <li>
                                        Ver rápidamente si las inscripciones se encuentran abiertas o cerradas.
                                    </li>

                                </ul>

                            </div>

                        </div>

                    )
                }

            </div>

        </div>
    );
};

export default AdminTorneos;