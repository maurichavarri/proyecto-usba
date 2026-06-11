import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminTorneos = () => {

    const [torneos, setTorneos] = useState([]);

    useEffect(() => {
        obtenerTorneos();
    }, []);

    const obtenerTorneos = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/v1/torneos/admin/todos",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            setTorneos(data);
        } catch (error) {
            console.error(error);
        }
    };

    const cambiarEstado = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await fetch(`http://localhost:3000/api/v1/torneos/${id}/estado`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            obtenerTorneos();

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-5 mb-5">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>
                    Gestión de Torneos
                </h2>

                <Link
                    to="/panel/admin/torneos/crear"
                    className="btn btn-dark"
                >
                    Crear torneo
                </Link>

            </div>

            {/* Tabla */}
            <div className="card shadow-sm">

                <div className="card-body">

                    <table className="table">

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

                                        <td>{torneo.nombre}</td>

                                        <td>{torneo.fecha_inicio}</td>

                                        <td>
                                            {torneo.fecha_cierre_inscripcion}
                                        </td>

                                        <td>{torneo.fecha_fin}</td>

                                        <td>
                                            {
                                                new Date() <=
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

                                        <td>{torneo.estado}</td>

                                        <td>

                                            <div className="d-flex gap-2">

                                                <Link
                                                    to={`/panel/admin/torneos/editar/${torneo.id}`}
                                                    className="btn btn-warning btn-sm"
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
                                                        cambiarEstado(torneo.id)
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

            </div>

        </div>
    );
};

export default AdminTorneos;