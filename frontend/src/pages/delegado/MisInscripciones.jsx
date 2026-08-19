import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MisInscripciones = () => {

    const navigate = useNavigate();

    const [paginaActual, setPaginaActual] = useState(1);
    const inscripcionesPorPagina = 10;

    const [inscripciones, setInscripciones] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [torneoCategorias, setTorneoCategorias] = useState([]);
    const [equipoId, setEquipoId] = useState("");
    const [torneoCategoriaId, setTorneoCategoriaId] = useState("");

    const [showHelp, setShowHelp] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        obtenerInscripciones();
        obtenerEquipos();
        obtenerTorneoCategorias();
    }, []);

    useEffect(() => {
        setPaginaActual(1);
    }, [busqueda]);

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

    const obtenerEquipos = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/v1/delegado/equipos",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();
            setEquipos(data);

        } catch (error) {
            console.error(error);
        }
    };

    const obtenerTorneoCategorias = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/v1/torneo-categorias/disponibles",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error al obtener torneos");
            }

            setTorneoCategorias(data);

        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/v1/delegado/inscripciones",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        equipo_id: equipoId,
                        torneo_categoria_id: torneoCategoriaId
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setMensaje("Inscripción creada correctamente");
            setEquipoId("");
            setTorneoCategoriaId("");
            obtenerInscripciones();

        } catch (error) {
            setMensaje(error.message);
        }
    };

    const inscripcionesFiltradas = inscripciones.filter((inscripcion) => {
        const texto = busqueda.toLowerCase();

        const nombreEquipo = inscripcion.Equipo?.nombre?.toLowerCase() || "";
        const nombreTorneo = inscripcion.torneoCategoria?.torneo?.nombre?.toLowerCase() || "";
        const nombreCategoria = inscripcion.torneoCategoria?.categoria?.nombre?.toLowerCase() || "";

        return (
            nombreEquipo.includes(texto) ||
            nombreTorneo.includes(texto) ||
            nombreCategoria.includes(texto)
        );
    });

    const numeroPlantel = (equipo) => {
        const equiposMismoNombre = equipos.filter(e => e.nombre.toLowerCase() === equipo.nombre.toLowerCase());
        return equiposMismoNombre.findIndex(e => e.id === equipo.id) + 1;
    };

    const totalPaginas = Math.ceil(inscripcionesFiltradas.length / inscripcionesPorPagina);
    const indiceInicio = (paginaActual - 1) * inscripcionesPorPagina;
    const indiceFin = indiceInicio + inscripcionesPorPagina;
    const inscripcionesPaginadas = inscripcionesFiltradas.slice(indiceInicio, indiceFin);

    return (
        <div className="container mt-5 mb-5">
            <div className="col-lg-10 mx-auto">

                {/* Título */}
                <div className="d-flex align-items-center mb-1">
                    <h2 className="me-2">
                        Mis Inscripciones
                    </h2>
                    <span className="text-primary" style={{ cursor: "pointer", fontSize: "1.2rem" }} onClick={() => setShowHelp(true)}>
                        ❓
                    </span>
                </div>

                {/* Breadcrumb */}
                <nav className="mb-3" style={{ fontSize: "0.9rem" }}>
                    <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/panel/delegado")}>
                        Delegado Dashboard
                    </span>
                    {" > "}
                    <span className="text-muted">
                        Mis Inscripciones
                    </span>
                </nav>

                {/* Boton */}
                <button className="btn btn-dark mb-3" onClick={() => navigate(-1)}>
                    Volver
                </button>

                {/* FORMULARIO */}
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h5 className="mb-3">
                            Nueva Inscripción
                        </h5>
                        {
                            mensaje && (
                                <div className="alert alert-info">
                                    {mensaje}
                                </div>
                            )
                        }

                        <form onSubmit={handleSubmit}>

                            {/* EQUIPO */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Equipo
                                </label>
                                <select
                                    className="form-select"
                                    value={equipoId}
                                    onChange={(e) =>
                                        setEquipoId(e.target.value)
                                    }
                                    required
                                >
                                    <option value="">
                                        Seleccionar equipo
                                    </option>

                                    {
                                        equipos.map((equipo) => (
                                            <option
                                                key={equipo.id}
                                                value={equipo.id}
                                            >
                                                {equipo.nombre} — Plantel {equipo.creado_en} · #{numeroPlantel(equipo)} — {equipo.cantidad_jugadores} jugadores — {equipo.cantidad_competencias} competencias
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* TORNEO CATEGORÍA */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Torneo / Categoría
                                </label>
                                <select className="form-select" value={torneoCategoriaId} onChange={(e) => setTorneoCategoriaId(e.target.value)} required>
                                    <option value="">
                                        Seleccionar torneo
                                    </option>
                                    {
                                        torneoCategorias.map((tc) => (
                                            <option key={tc.id} value={tc.id}>
                                                {tc.torneo?.nombre} - {tc.categoria?.nombre}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            <button className="btn btn-primary">
                                Inscribirse
                            </button>
                        </form>
                    </div>
                </div>

                {/* TABLA */}
                <div className="card shadow-sm">
                    <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                        <strong>
                            Inscripciones
                        </strong>

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

                                    <span className="mx-2">
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

                        <input
                            type="text"
                            className="form-control w-auto"
                            placeholder="Buscar..."
                            value={busqueda}
                            onChange={(e) =>
                                setBusqueda(e.target.value)
                            }
                        />
                    </div>

                    <div className="card-body">
                        {
                            inscripciones.length === 0 ? (
                                <div className="alert alert-info mb-0">
                                    No hay inscripciones registradas.
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
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
                                                inscripcionesFiltradas.length > 0 ? (inscripcionesPaginadas.map((inscripcion) => (
                                                    <tr key={inscripcion.id}>
                                                        <td>
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
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="text-center text-muted">
                                                            No se encontraron inscripciones.
                                                        </td>
                                                    </tr>
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
                                    Desde esta sección el delegado puede inscribir
                                    sus equipos a las competencias.
                                </p>
                                <p>
                                    Más abajo tendrás el listado de las mismas, con toda
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