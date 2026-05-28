import { useEffect, useState } from "react";

const AdminInscripciones = () => {

    const [inscripciones, setInscripciones] =
        useState([]);

    useEffect(() => {
        obtenerInscripciones();
    }, []);

    const obtenerInscripciones = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:3000/api/v1/admin/inscripciones",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
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

    const cambiarEstado = async (
        id,
        estado
    ) => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:3000/api/v1/admin/inscripciones/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        estado
                    })
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
        <div className="container mt-4">

            <h2 className="mb-4">
                Gestión de Inscripciones
            </h2>

            <div className="card shadow-sm">

                <div className="card-body">

                    <table className="table">

                        <thead>

                            <tr>

                                <th>Equipo</th>

                                <th>Torneo</th>

                                <th>Categoría</th>

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
                                                .TorneoCategoria
                                                .Torneo
                                                .nombre
                                            }
                                        </td>

                                        <td>
                                            {
                                                inscripcion
                                                .TorneoCategoria
                                                .Categoria
                                                .nombre
                                            }
                                        </td>

                                        <td>
                                            {
                                                inscripcion.estado
                                            }
                                        </td>

                                        <td>

                                            <div className="d-flex gap-2">

                                                <button
                                                    className="btn btn-success btn-sm"
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

        </div>
    );
};

export default AdminInscripciones;