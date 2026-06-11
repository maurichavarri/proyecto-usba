import { useEffect, useState } from "react";

const AdminInscripciones = () => {

    const [inscripciones, setInscripciones] = useState([]);

    useEffect(() => {
        obtenerInscripciones();
    }, []);

    const obtenerInscripciones = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/v1/admin/inscripciones",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setInscripciones(data);

        } catch (error) {
            console.error(error);
        }
    };

    const cambiarEstado = async (id, estado) => {

        const confirmar = window.confirm(`¿Desea ${estado} esta inscripción?`);

        if (!confirmar) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`http://localhost:3000/api/v1/admin/inscripciones/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ estado })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            obtenerInscripciones();

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-4 mb-5">
            <h2 className="mb-4">
                Gestión de Inscripciones
            </h2>
            {inscripciones.length === 0 ? (<p>No hay inscripciones a gestionar.</p>) : (
                <div className="card shadow-sm">
                    <div className="card-body">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Equipo</th>
                                    <th>Torneo</th>
                                    <th>Categoría</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    inscripciones.map(
                                        (inscripcion) => (
                                            <tr
                                                key={inscripcion.id}
                                            >
                                                <td>
                                                    {
                                                        inscripcion
                                                            .Equipo
                                                            .nombre
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        inscripcion
                                                            .torneoCategoria
                                                            ?.torneo
                                                            ?.nombre
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        inscripcion
                                                            .torneoCategoria
                                                            ?.categoria
                                                            ?.nombre
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        new Date(inscripcion.fecha)
                                                            .toLocaleDateString("es-AR")
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        inscripcion.estado === "pendiente" &&
                                                        <span className="badge bg-warning text-dark">
                                                            Pendiente
                                                        </span>
                                                    }

                                                    {
                                                        inscripcion.estado === "confirmado" &&
                                                        <span className="badge bg-success">
                                                            Confirmado
                                                        </span>
                                                    }

                                                    {
                                                        inscripcion.estado === "rechazado" &&
                                                        <span className="badge bg-danger">
                                                            Rechazado
                                                        </span>
                                                    }
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            disabled={
                                                                inscripcion.estado !== "pendiente"
                                                            }
                                                            onClick={() =>
                                                                cambiarEstado(
                                                                    inscripcion.id,
                                                                    "confirmado"
                                                                )
                                                            }
                                                        >
                                                            Confirmar
                                                        </button>

                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            disabled={
                                                                inscripcion.estado !== "pendiente"
                                                            }
                                                            onClick={() =>
                                                                cambiarEstado(
                                                                    inscripcion.id,
                                                                    "rechazado"
                                                                )
                                                            }
                                                        >
                                                            Rechazar
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
            )}

        </div>
    );
};

export default AdminInscripciones;