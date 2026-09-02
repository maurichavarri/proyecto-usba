import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MisEquipos = () => {
    const navigate = useNavigate();

    const [equipos, setEquipos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [busqueda, setBusqueda] = useState("");
    const equiposPorPagina = 10;

    useEffect(() => {
        obtenerEquipos();
    }, []);

    const obtenerEquipos = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/v1/delegado/equipos", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            setEquipos(data);
        } catch (error) {
            console.error(error);
        }
    };

    const equiposFiltrados = equipos.filter((equipo) => {
        const texto = busqueda.toLowerCase();
        return (equipo.nombre?.toLowerCase().includes(texto));
    });

    const totalPaginas = Math.ceil(equipos.length / equiposPorPagina);
    const indiceInicio = (paginaActual - 1) * equiposPorPagina;
    const indiceFin = indiceInicio + equiposPorPagina;
    const equiposPaginados = equipos.slice(indiceInicio, indiceFin);

    return (
        <div className="container mt-5 mb-5">
            <div className="col-lg-10 mx-auto">

                {/* Breadcrumb */}
                <div className="mb-3">
                    {/* Breadcrumb */}
                    <nav className="mb-1" style={{ fontSize: "0.9rem" }}>
                        <span
                            className="text-muted"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/panel/delegado")}
                        >
                            Panel de Delegado
                        </span>
                        {" > "}
                        <span className="text-muted">
                            Mis Equipos</span>
                    </nav>
                    <div className="d-flex align-items-center mt-1">
                        <h3 className="fw-bold me-2 mb-0">Mis Equipos</h3>
                    </div>
                </div>

                {/* Botón Volver */}
                <div className="mb-4">
                    <button
                        className="btn btn-dark"
                        onClick={() => navigate("/panel/delegado")}
                    >
                        ← Volver
                    </button>
                </div>

                {/* Tarjeta de la Tabla */}
                <div className="card shadow-sm border-0">
                    <div className="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Equipos</h5>

                        {
                            totalPaginas > 1 && (
                                <div className="d-flex justify-content-center align-items-center gap-2">
                                    <button
                                        className="btn btn-outline-light btn-sm"
                                        disabled={paginaActual === 1}
                                        onClick={() => setPaginaActual(paginaActual - 1)}
                                    >
                                        Anterior
                                    </button>

                                    <span className="mx-2 small text-light">
                                        Página {paginaActual} de {totalPaginas}
                                    </span>

                                    <button
                                        className="btn btn-outline-light btn-sm"
                                        disabled={paginaActual === totalPaginas}
                                        onClick={() => setPaginaActual(paginaActual + 1)}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            )
                        }

                        <input
                            type="text"
                            className="form-control w-auto"
                            placeholder="Buscar..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>

                    <div className="card-body p-0">
                        {
                            equipos.length === 0 ? (
                                <div className="p-4">
                                    <div className="alert alert-info mb-0 border-0" style={{ backgroundColor: '#cff4fc', color: '#055160' }}>
                                        No hay equipos registrados.
                                    </div>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="py-3 ps-3">Nombre</th>
                                                <th className="py-3">Descripción</th>
                                                <th className="py-3 text-end pe-3">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {equiposFiltrados.length > 0 ? (
                                                equiposFiltrados.map((equipo) => (
                                                    <tr key={equipo.id}>
                                                        <td className="ps-3 fw-bold">
                                                            {equipo.nombre}
                                                        </td>
                                                        <td>
                                                            {equipo.descripcion || "Sin descripción"}
                                                        </td>
                                                        <td className="text-end pe-3">
                                                            <button
                                                                className="btn btn-sm btn-outline-dark"
                                                                onClick={() => navigate(`/panel/delegado/equipos/${equipo.id}/jugadores`)}
                                                            >
                                                                Ver Jugadores
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="text-center text-muted">
                                                        No se encontraron equipos.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        }
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MisEquipos;