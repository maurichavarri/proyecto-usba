import { useEffect, useState } from "react";
<<<<<<< HEAD
import { Link, useNavigate } from "react-router-dom";
=======
import { useNavigate } from "react-router-dom";
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0

const MisEquipos = () => {
    const navigate = useNavigate();

    const navigate = useNavigate();
<<<<<<< HEAD
<<<<<<< HEAD

    const [showHelp, setShowHelp] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
=======
>>>>>>> 63c6e1b (cambios de administrador y delegados)
=======

    const [showHelp, setShowHelp] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
>>>>>>> a738da2 (Puliendo detalles del Front-end)
    const [equipos, setEquipos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const equiposPorPagina = 10;

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("success");
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        obtenerEquipos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
<<<<<<< HEAD
            const response = await fetch("http://localhost:3000/api/v1/delegado/equipos",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        nombre,
                        descripcion
                    })
=======
            const response = await fetch("http://localhost:3000/api/v1/delegado/equipos", {
                headers: {
                    Authorization: `Bearer ${token}`
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
<<<<<<< HEAD

            // Limpiar formulario
            setNombre("");
            setDescripcion("");

            // Actualizar tabla de equipos
            await obtenerEquipos();

            // Mostrar modal de éxito
            setShowSuccess(true);

        } catch (error) {
            console.error(error);
            alert(error.message);
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
            if (!response.ok) {
                throw new Error(data.message);
            }
=======
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
            setEquipos(data);
        } catch (error) {
            console.error(error);
        }
    };

<<<<<<< HEAD
    const equiposFiltrados = equipos.filter((equipo) => {
        const texto = busqueda.toLowerCase();

        const nombreEquipo = equipo?.nombre?.toLowerCase() || "";
        const descripcionEquipo = equipo?.descripcion?.toLowerCase() || "";

        return (
            nombreEquipo.includes(texto) ||
            descripcionEquipo.includes(texto)
        );
    });

    const numeroPlantel = (equipo) => {
        const equiposMismoNombre = equipos.filter(e => e.nombre.toLowerCase() === equipo.nombre.toLowerCase());
        return equiposMismoNombre.findIndex(e => e.id === equipo.id) + 1;
    };

    return (
        <div className="container mt-5 mb-5">
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a738da2 (Puliendo detalles del Front-end)
            <div className="col-lg-10 mx-auto">
                {/* Titulo */}
                <div className="d-flex align-items-center mb-1">
                    <h2 className="me-2">
<<<<<<< HEAD
                        Mis Equipos
                    </h2>
                    <span style={{ cursor: "pointer", fontSize: "1.2rem" }} className="text-primary" onClick={() => setShowHelp(true)}>
                        ❓
                    </span>
=======
            {/* Botón ir al dashboard */}
            <div className="mb-3">
                <button
                    className="btn btn-dark"
                    onClick={() => navigate("/panel/delegado")}
                >
                    ← Regresar al panel
                </button>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2">
                <h2>Mis Equipos</h2>
            </div>
            {equipos.length === 0 ? (<p>No tienes equipos creados.</p>) : (
                <div className="row">
                    {
                        equipos.map((equipo) => (
                            <div key={equipo.id} className="col-md-4 mb-3">
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {equipo.nombre}
                                        </h5>
                                        <p className="card-text">
                                            {equipo.descripcion}
                                        </p>
                                        <Link
                                            to={`/panel/delegado/equipos/${equipo.id}/jugadores`}
                                            className="btn btn-dark"
                                        >
                                            Ver jugadores
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
>>>>>>> 63c6e1b (cambios de administrador y delegados)
                </div>

                {/* Breadcrumb */}
                <nav className="mb-3" style={{ fontSize: "0.9rem" }}>
                    <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/panel/delegado")}>
                        Delegado Dashboard
                    </span>
                    {" > "}
                    <span className="text-muted">
                        Mis Equipos
                    </span>
                </nav>

                {/* Botones */}
                <div className="d-flex justify-content-between mb-3">
                    <button className="btn btn-dark" onClick={() => navigate(-1)}>
                        Volver
                    </button>
                </div>

=======
                        Mis Equipos
                    </h2>
                    <span style={{ cursor: "pointer", fontSize: "1.2rem" }} className="text-primary" onClick={() => setShowHelp(true)}>
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
                        Mis Equipos
                    </span>
                </nav>

                {/* Botones */}
                <div className="d-flex justify-content-between mb-3">
                    <button className="btn btn-dark" onClick={() => navigate(-1)}>
                        Volver
                    </button>
                </div>

>>>>>>> a738da2 (Puliendo detalles del Front-end)
                {/* Crear Equipo */}
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-dark text-white">
                        <strong>
                            Crear Equipo
                        </strong>
                    </div>

                    <div className="card-body">
                        {
                            mensaje &&
                            (
                                <div className={`alert alert-${tipoMensaje} `}>
                                    {mensaje}
                                </div>
                            )
                        }

                        <form onSubmit={handleSubmit}>

                            {/* Nombre */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Nombre
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Descripción */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Descripción
                                </label>

                                <textarea
                                    className="form-control"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Crear equipo
                            </button>

                        </form>
                    </div>
                </div>

                <div className="card shadow-sm">
                    <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                        <strong>
                            Mis Equipos
                        </strong>

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
                            equipos.length === 0 ? (
                                <div className="alert alert-info mb-0">
                                    No existen equipos creados.
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead>
                                            <tr>
                                                <th>Equipo</th>
                                                <th>Plantel</th>
                                                {/* <th>Descripcion</th> */}
                                                <th>Cant. de Jugadores</th>
                                                <th>Competencias Inscriptas</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                equiposFiltrados.length > 0 ? (equiposFiltrados.map((equipo) => (
                                                    <tr key={equipo.id}>
                                                        <td><strong>{equipo.nombre}</strong></td>
<<<<<<< HEAD
                                                        <td>{equipo.creado_en ? new Date(equipo.creado_en).toLocaleDateString('es-AR') : 'Sin fecha'} · #{numeroPlantel(equipo)}</td>
=======
                                                        <td>{equipo.creado_en} · #{numeroPlantel(equipo)}</td>
>>>>>>> a738da2 (Puliendo detalles del Front-end)
                                                        {/* <td>{equipo.descripcion || "-"}</td> */}
                                                        <td>{equipo.cantidad_jugadores}</td>
                                                        <td>{equipo.cantidad_competencias}</td>
                                                        <td>
                                                            <Link to={`/panel/delegado/equipos/${equipo.id}/jugadores`} className="btn btn-dark btn-sm">
                                                                Gestionar
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                )
                                                )
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="text-center text-muted">
                                                            No se encontraron equipos.
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

                {/* Modal Ayuda */}
                {
                    showHelp && (
                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor: "rgba(0,0,0,0.5)",
                                zIndex: 1050
                            }}
                        >
                            <div className="bg-white p-4 rounded shadow" style={{ maxWidth: "550px" }}>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5>¿Cómo funciona este apartado?</h5>
                                    <button className="btn-close" onClick={() => setShowHelp(false)} />
                                </div>
                                <p>
                                    Desde esta sección podés
                                    crear <b>EQUIPOS</b>, y mas abajo, ver la lista
                                    de los mismos.
                                </p>
                            </div>
                        </div>
                    )
                }

                {/* Modal Equipo Creado */}
                {
                    showSuccess && (
                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor: "rgba(0,0,0,0.5)",
                                zIndex: 1050
                            }}
                        >
                            <div
                                className="bg-white p-4 rounded shadow text-center"
                                style={{
                                    width: "90%",
                                    maxWidth: "450px"
                                }}
                            >
                                <div className="mb-3">
                                    <span
                                        className="text-success"
                                        style={{
                                            fontSize: "3rem"
                                        }}
                                    >
                                        ✓
                                    </span>
                                </div>
                                <h4 className="mb-3">
                                    Equipo creado
                                </h4>
                                <p className="text-muted">
                                    El equipo fue creado de manera exitosa.
                                </p>
                                <button
                                    type="button"
                                    className="btn btn-dark"
                                    onClick={() =>
                                        setShowSuccess(false)
                                    }
                                >
                                    Aceptar
                                </button>
                            </div>
                        </div>
                    )
                }
=======
    const totalPaginas = Math.ceil(equipos.length / equiposPorPagina);
    const indiceInicio = (paginaActual - 1) * equiposPorPagina;
    const indiceFin = indiceInicio + equiposPorPagina;
    const equiposPaginados = equipos.slice(indiceInicio, indiceFin);

    return (
        <div className="container mt-4 mb-5">
            <div className="col-lg-10 mx-auto">

                {/* Breadcrumb */}
                <div className="mb-3">
                    <small className="text-muted" style={{ cursor: 'pointer' }} onClick={() => navigate("/panel/delegado")}>
                        Delegado Dashboard &gt; Mis Equipos
                    </small>
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
                        Volver
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
                                            {
                                                equiposPaginados.map((equipo) => (
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
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            )
                        }
                    </div>
                </div>

>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
            </div>
        </div>
    );
};

export default MisEquipos;