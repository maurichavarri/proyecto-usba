import { useEffect, useState } from "react";

const MisInscripciones = () => {
    const [inscripciones, setInscripciones] = useState([]);

    useEffect(() => {
        obtenerInscripciones();
    }, []);

    const obtenerInscripciones = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/v1/delegado/inscripciones",
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

    return (
        <div className="container mt-4">
            <h2 className="mb-4">
                Mis Inscripciones
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
                            </tr>
                        </thead>
                        <tbody>
                            {
                                inscripciones.map(
                                    (inscripcion) => (
                                        <tr key={inscripcion.id}><td>
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
                                            <td>{inscripcion.estado}</td>
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

export default MisInscripciones;