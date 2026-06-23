import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminInscripciones = () => {

    const navigate = useNavigate();

    const [showHelp, setShowHelp] = useState(false);
    const [inscripciones, setInscripciones] = useState([]);
    const [mensaje, setMensaje] = useState("");

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

            setMensaje(
                "Error al cargar inscripciones"
            );
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
        <div className="container mt-4 mb-5">

            <div className="col-12">

                {/* Título */}

                <div className="d-flex align-items-center mb-2">

                    <h2 className="me-2">
                        Gestión de Inscripciones
                    </h2>

                    <span
                        className="text-primary"
                        style={{
                            cursor: "pointer",
                            fontSize: "1.2rem"
                        }}
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
                        Inscripciones
                    </span>

                </nav>

                <button
                    className="btn btn-dark mb-3"
                    onClick={() => navigate(-1)}
                >
                    Volver
                </button>

                {
                    mensaje &&
                    <div className="alert alert-danger">
                        {mensaje}
                    </div>
                }

                <div className="card shadow-sm">

                    <div className="card-header bg-dark text-white">

                        <strong>
                            Inscripciones recibidas
                        </strong>

                    </div>

                    <div className="card-body">

                        {
                            inscripciones.length === 0
                                ? (
                                    <div className="alert alert-info mb-0">
                                        No existen inscripciones registradas.
                                    </div>
                                )
                                : (
                                    <div className="table-responsive">

                                        <table className="table align-middle">

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
                                                                key={
                                                                    inscripcion.id
                                                                }
                                                            >

                                                                <td>
                                                                    {
                                                                        inscripcion
                                                                            .Equipo
                                                                            ?.nombre
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
                                                                        inscripcion.estado === "pendiente" &&
                                                                        (
                                                                            <span className="badge bg-warning text-dark">
                                                                                Pendiente
                                                                            </span>
                                                                        )
                                                                    }

                                                                    {
                                                                        inscripcion.estado === "confirmado" &&
                                                                        (
                                                                            <span className="badge bg-success">
                                                                                Confirmado
                                                                            </span>
                                                                        )
                                                                    }

                                                                    {
                                                                        inscripcion.estado === "rechazado" &&
                                                                        (
                                                                            <span className="badge bg-danger">
                                                                                Rechazado
                                                                            </span>
                                                                        )
                                                                    }

                                                                </td>

                                                                <td>

                                                                    {
                                                                        inscripcion.estado === "pendiente" &&
                                                                        (
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
                                                                        )
                                                                    }

                                                                </td>

                                                            </tr>
                                                        )
                                                    )
                                                }

                                            </tbody>

                                        </table>

                                    </div>
                                )
                        }

                    </div>

                </div>

                {/* Modal ayuda */}

                {
                    showHelp && (

                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor:
                                    "rgba(0,0,0,0.5)"
                            }}
                        >

                            <div
                                className="bg-white p-4 rounded shadow"
                                style={{
                                    maxWidth: "500px"
                                }}
                            >

                                <div className="d-flex justify-content-between align-items-center mb-3">

                                    <h5>
                                        ¿Cómo funciona?
                                    </h5>

                                    <button
                                        className="btn-close"
                                        onClick={() =>
                                            setShowHelp(false)
                                        }
                                    />

                                </div>

                                <p>
                                    Desde esta sección el administrador puede
                                    revisar todas las solicitudes de inscripción
                                    enviadas por los delegados.
                                </p>

                                <p>
                                    Las inscripciones pueden aprobarse o rechazarse.
                                    Sólo los equipos confirmados participarán
                                    en la generación del fixture.
                                </p>

                            </div>

                        </div>
                    )
                }

            </div>

        </div>
    );
};

export default AdminInscripciones;