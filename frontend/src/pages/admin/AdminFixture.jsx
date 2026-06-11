import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const AdminFixture = () => {

    const { id } = useParams();

    const [fixture, setFixture] = useState([]);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        obtenerFixture();
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

    const generarFixture = async () => {

        const confirmar = window.confirm("¿Desea generar el fixture?");

        if (!confirmar) return;

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

        } catch (error) {
            console.error(error);
            setMensaje("Error al generar fixture");
        }
    };

    // Agrupar por jornada
    const jornadas = {};

    fixture.forEach((partido) => {
        if (!jornadas[partido.jornada]) {
            jornadas[partido.jornada] = [];
        }

        jornadas[partido.jornada].push(partido);
    });

    return (
        <div className="container mt-5 mb-5">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>
                    Fixture
                </h2>

                {
                    fixture.length === 0 &&
                    <button
                        onClick={generarFixture}
                        className="btn btn-dark"
                    >
                        Generar Fixture
                    </button>
                }

            </div>

            {/* Mensajes */}
            {
                mensaje &&
                <div className="alert alert-info">
                    {mensaje}
                </div>
            }

            {/* Sin fixture */}
            {
                fixture.length === 0 &&
                <div className="alert alert-secondary">
                    No hay fixture generado.
                </div>
            }

            {/* Jornadas */}
            {
                Object.entries(jornadas).map(([jornada, partidos]) => (
                    <div
                        key={jornada}
                        className="mb-5"
                    >
                        <h4 className="mb-3">
                            Jornada {jornada}
                        </h4>
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>Local</th>
                                        <th>Visitante</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        partidos.map((partido) => (
                                            <tr
                                                key={partido.id}
                                            >
                                                <td>
                                                    {
                                                        partido.local
                                                            ?.Equipo
                                                            ?.nombre
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        partido.visitante
                                                            ?.Equipo
                                                            ?.nombre
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        partido.fecha
                                                            ? new Date(
                                                                partido.fecha
                                                            ).toLocaleDateString(
                                                                "es-AR"
                                                            )
                                                            : "-"
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
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default AdminFixture;