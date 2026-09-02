import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MisInscripciones = () => {
    const navigate = useNavigate();

    const [paginaActual, setPaginaActual] = useState(1);
    const inscripcionesPorPagina = 10;

    const navigate = useNavigate();

<<<<<<< HEAD
<<<<<<< HEAD
    const [paginaActual, setPaginaActual] = useState(1);
    const inscripcionesPorPagina = 10;

=======
>>>>>>> 63c6e1b (cambios de administrador y delegados)
=======
    const [paginaActual, setPaginaActual] = useState(1);
    const inscripcionesPorPagina = 10;

>>>>>>> a738da2 (Puliendo detalles del Front-end)
    const [inscripciones, setInscripciones] = useState([]);
<<<<<<< HEAD
    const [equipos, setEquipos] = useState([]);
    const [torneoCategorias, setTorneoCategorias] = useState([]);
    const [equipoId, setEquipoId] = useState("");
    const [torneoCategoriaId, setTorneoCategoriaId] = useState("");

    const [showHelp, setShowHelp] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [busqueda, setBusqueda] = useState("");
=======
    const [showHelp, setShowHelp] = useState(false);
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0

    useEffect(() => {
        obtenerInscripciones();
    }, []);

<<<<<<< HEAD
    useEffect(() => {
        setPaginaActual(1);
    }, [busqueda]);

=======
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
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

<<<<<<< HEAD
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

            // Procesar los equipos para formatear la fecha
            const equiposProcesados = data.map(equipo => ({
                ...equipo,
                creado_en_formateado: equipo.creado_en ? new Date(equipo.creado_en).toLocaleDateString('es-AR') : 'Sin fecha'
            }));

            setEquipos(equiposProcesados);


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
=======
    const totalPaginas = Math.ceil(inscripciones.length / inscripcionesPorPagina);
    const indiceInicio = (paginaActual - 1) * inscripcionesPorPagina;
    const indiceFin = indiceInicio + inscripcionesPorPagina;
    const inscripcionesPaginadas = inscripciones.slice(indiceInicio, indiceFin);
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0

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
<<<<<<< HEAD
<<<<<<< HEAD
        <div className="container mt-5 mb-5">
            <div className="col-lg-10 mx-auto">
=======
        <div className="container mt-4 mb-5">
<<<<<<< HEAD
            {/* Botón ir al dashboard */}
            <div className="mb-3">
                <button
                    className="btn btn-dark"
                    onClick={() => navigate("/panel/delegado")}
                >
                    ← Regresar al panel
                </button>
            </div>

            <h2 className="mb-4">
                Mis Inscripciones
            </h2>
>>>>>>> 63c6e1b (cambios de administrador y delegados)
=======
        <div className="container mt-5 mb-5">
            <div className="col-lg-10 mx-auto">
>>>>>>> a738da2 (Puliendo detalles del Front-end)

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
                                                {equipo.nombre} — Plantel {equipo.creado_en_formateado || 'Sin fecha'} · #{numeroPlantel(equipo)} — {equipo.cantidad_jugadores} jugadores — {equipo.cantidad_competencias} competencias
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
=======
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
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0

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

<<<<<<< HEAD
                                    <span className="mx-2">
=======
                                    <span className="mx-2 small text-light">
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
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
<<<<<<< HEAD

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
=======
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
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
<<<<<<< HEAD
                                                inscripcionesFiltradas.length > 0 ? (inscripcionesPaginadas.map((inscripcion) => (
                                                    <tr key={inscripcion.id}>
                                                        <td>
=======
                                                inscripcionesPaginadas.map((inscripcion) => (
                                                    <tr key={inscripcion.id}>
                                                        <td className="ps-3">
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
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
<<<<<<< HEAD
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="text-center text-muted">
                                                            No se encontraron inscripciones.
                                                        </td>
                                                    </tr>
                                                )
=======
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
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
<<<<<<< HEAD
                                    "rgba(0,0,0,0.5)"
=======
                                    "rgba(0,0,0,0.5)",
                                zIndex: 1050
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
                            }}
                        >

                            <div
                                className="bg-white p-4 rounded shadow"
                                style={{
                                    maxWidth: "500px"
                                }}
                            >

                                <div className="d-flex justify-content-between align-items-center mb-3">
<<<<<<< HEAD
                                    <h5>
=======
                                    <h5 className="mb-0">
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
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
<<<<<<< HEAD
                                <p>
                                    Más abajo tendrás el listado de las mismas, con toda
=======
                                <p className="mb-0">
                                    Más abajo tendrás el listado de las mesmas, con toda
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
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