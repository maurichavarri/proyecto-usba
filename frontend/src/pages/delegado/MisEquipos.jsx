import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const MisEquipos = () => {

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
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

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
            setEquipos(data);
        } catch (error) {
            console.error(error);
        }
    };

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
            </div>
        </div>
    );
};

export default MisEquipos;