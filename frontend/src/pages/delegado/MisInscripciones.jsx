import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MisInscripciones = () => {
    const navigate = useNavigate();

    const [paginaActual, setPaginaActual] = useState(1);
    const inscripcionesPorPagina = 10;

    const [inscripciones, setInscripciones] = useState([]);
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        obtenerInscripciones();
    }, []);

    const obtenerInscripciones = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/v1/delegado/inscripciones",
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

    const totalPaginas = Math.ceil(inscripciones.length / inscripcionesPorPagina);
    const indiceInicio = (paginaActual - 1) * inscripcionesPorPagina;
    const indiceFin = indiceInicio + inscripcionesPorPagina;
    const inscripcionesPaginadas = inscripciones.slice(indiceInicio, indiceFin);

    return (
        <div className="container mt-4 mb-5">
            <div className="col-lg-10 mx-auto">

                {/* Breadcrumb */}
                <div className="mb-3">
                    <small className="text-muted" style={{ cursor: 'pointer' }} onClick={() => navigate("/panel/delegado")}>
                        Delegado Dashboard &gt; Mis Inscripciones
                    </small>
                    <div className="d-flex align-items-center mt-1">
                        <h3 className="fw-bold me-2 mb-0">Mis Inscripciones</h3>
                        <span className="text-dark" style={{ cursor: "pointer", fontSize: "1.1rem" }} onClick={() => setShowHelp(true)}>
                            ❓
                        </span>
                    </div>
                </div>

                {/* Botón Volver y Botón Nueva Inscripción arriba */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <button
                        className="btn btn-dark"
                        onClick={() => navigate("/panel/delegado")}
                    >
                        Volver
                    </button>
                    <button
                        className="btn btn-dark"
                        onClick={() => navigate("/panel/delegado/inscripciones/crear")}
                    >
                        + Nueva Inscripción
                    </button>
                </div>

                {/* TABLA / Tarjeta con header oscuro */}
                <div className="card shadow-sm border-0">
                    <div className="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Inscripciones</h5>

                        {
                            totalPaginas > 1 && (
                                <div className="d-flex justify-content-center align-items-center gap-2">
                                    <button
                                        className="btn btn-outline-light btn-sm"
                                        disabled={paginaActual === 1}
                                        onClick={() =>
                                            setPaginaActual(paginaActual - 1)
                                        }
                                    >
                                        Anterior
                                    </button>

                                    <span className="mx-2 small text-light">
                                        Página {paginaActual} de {totalPaginas}
                                    </span>

                                    <button
                                        className="btn btn-outline-light btn-sm"
                                        disabled={paginaActual === totalPaginas}
                                        onClick={() =>
                                            setPaginaActual(paginaActual + 1)
                                        }
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            )
                        }
                    </div>

                    <div className="card-body p-0">
                        {
                            inscripciones.length === 0 ? (
                                <div className="p-4">
                                    <div className="alert alert-info mb-0 border-0" style={{ backgroundColor: '#cff4fc', color: '#055160' }}>
                                        No hay inscripciones registradas.
                                    </div>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="py-3 ps-3">Equipo</th>
                                                <th className="py-3">Torneo</th>
                                                <th className="py-3">Categoría</th>
                                                <th className="py-3">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                inscripcionesPaginadas.map((inscripcion) => (
                                                    <tr key={inscripcion.id}>
                                                        <td className="ps-3">
                                                            {inscripcion.Equipo?.nombre}
                                                        </td>
                                                        <td>
                                                            {
                                                                inscripcion.torneoCategoria?.torneo?.nombre
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                inscripcion.torneoCategoria?.categoria?.nombre
                                                            }
                                                        </td>
                                                        <td>
                                                            <span
                                                                className={
                                                                    inscripcion.estado === 'confirmado'
                                                                        ? 'badge bg-success'
                                                                        : inscripcion.estado === 'rechazado'
                                                                            ? 'badge bg-danger'
                                                                            : 'badge bg-warning text-dark'
                                                                }
                                                            >
                                                                {inscripcion.estado}
                                                            </span>
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

                {/* Modal ayuda */}
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
                                    maxWidth: "500px"
                                }}
                            >

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0">
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
                                    Desde esta sección el delegado puede inscribir
                                    sus equipos a las competencias.
                                </p>
                                <p className="mb-0">
                                    Más abajo tendrás el listado de las mesmas, con toda
                                    la información correspondiente y su estado.
                                </p>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default MisInscripciones;