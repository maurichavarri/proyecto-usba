import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminAnuncios = () => {
    const navigate = useNavigate();
    const [anuncios, setAnuncios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        obtenerAnuncios();
    }, []);

    const obtenerAnuncios = async () => {
        try {
            setCargando(true);
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/v1/anuncios/admin/todos", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            setAnuncios(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setAnuncios([]);
        } finally {
            setCargando(false);
        }
    };

    const cambiarEstado = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await fetch(`http://localhost:3000/api/v1/anuncios/${id}/estado`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            });
            obtenerAnuncios();
        } catch (error) {
            console.error(error);
        }
    };

    const anunciosFiltrados = anuncios.filter((anuncio) => {
        const texto = busqueda.toLowerCase();
        return (
            anuncio.titulo?.toLowerCase().includes(texto) ||
            anuncio.contenido?.toLowerCase().includes(texto)
        );
    });

    return (
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        <div className="container mt-5 mb-5">
            <div className="col-lg-10 mx-auto">
                {/* Encabezado */}
                <div className="d-flex align-items-center mb-1">
                    <h2>Gestión de Anuncios</h2>
                    <span style={{ cursor: "pointer", fontSize: "1.2rem" }} className="text-primary" onClick={() => setShowHelp(true)}>
                        ❓
                    </span>
=======
        <div className="container mt-4 mb-5">

            {/* Encabezado */}
            <div className="d-flex align-items-center justify-content-between mb-2">
                <h2>Gestión de Anuncios</h2>
                <Link to="/panel/admin/anuncios/crear" className="btn btn-primary">
                    + Crear anuncio
                </Link>
            </div>

            {/* Breadcrumb */}
            <nav className="mb-4" style={{ fontSize: "0.9rem" }}>
                <span
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/panel/admin")}
                >
                    Panel de Administrador
                </span>
                {" > "}
                <span className="text-muted">Anuncios</span>
            </nav>

            {/* Botón ir al dashboard */}
            <div className="mb-3">
                <button
                    className="btn btn-dark"
                    onClick={() => navigate("/panel/admin")}
                >
                    ← Regresar al panel 
                </button>
            </div>

            <div className="card shadow-sm">
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <strong>Listado de anuncios</strong>
                    <input
                        type="text"
                        className="form-control w-auto"
                        placeholder="Buscar..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
>>>>>>> 63c6e1b (cambios de administrador y delegados)
=======
        <div className="container mt-5 mb-5">
            <div className="col-lg-10 mx-auto">

                {/* Titulo */}
                <div className="d-flex align-items-center justify-content-between mb-2">
                    <h2>Gestión de Anuncios</h2>
>>>>>>> a738da2 (Puliendo detalles del Front-end)
=======
        <div className="container mt-5 mb-5">
            <div className="col-lg-10 mx-auto">

                {/* Titulo */}
                <div className="d-flex align-items-center justify-content-between mb-2">
                    <h2>Gestión de Anuncios</h2>
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
                </div>

                {/* Breadcrumb */}
                <nav className="mb-4" style={{ fontSize: "0.9rem" }}>
                    <span
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/panel/admin")}
                    >
                        Panel de Administrador
                    </span>
                    {" > "}
                    <span className="text-muted">Anuncios</span>
                </nav>

                {/* Botones */}
                <div className="d-flex justify-content-between mb-3">
                    <button
                        className="btn btn-dark"
                        onClick={() => navigate("/panel/admin")}
                    >
                        ← Regresar al panel
                    </button>
                    <Link to="/panel/admin/anuncios/crear" className="btn btn-primary">
                        + Crear anuncio
                    </Link>
                </div>

                <div className="card shadow-sm">
                    <div className="card shadow-sm">
                        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                            <strong>Listado de anuncios</strong>
                            <input
                                type="text"
                                className="form-control w-auto"
                                placeholder="Buscar..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>

                        <div className="card-body p-0">
                            {cargando ? (
                                <p className="text-muted p-3">Cargando anuncios...</p>
                            ) : anuncios.length === 0 ? (
                                <div className="alert alert-info m-3">No existen anuncios registrados.</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th style={{ width: "80px" }}>Imagen</th>
                                                <th>Título</th>
                                                <th>Contenido</th>
                                                <th>Estado</th>
                                                <th>Fecha</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {anunciosFiltrados.length > 0 ? (
                                                anunciosFiltrados.map((anuncio) => (
                                                    <tr key={anuncio.id}>
                                                        <td>
                                                            {anuncio.imagen ? (
                                                                <img
                                                                    src={`http://localhost:3000${anuncio.imagen}`}
                                                                    alt={anuncio.titulo}
                                                                    style={{
                                                                        width: "60px",
                                                                        height: "45px",
                                                                        objectFit: "cover",
                                                                        borderRadius: "6px"
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div
                                                                    style={{
                                                                        width: "60px",
                                                                        height: "45px",
                                                                        borderRadius: "6px",
                                                                        backgroundColor: "#e9ecef",
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        fontSize: "18px"
                                                                    }}
                                                                >
                                                                    📷
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td><strong>{anuncio.titulo}</strong></td>
                                                        <td className="text-muted" style={{ maxWidth: "250px" }}>
                                                            {anuncio.contenido?.length > 80
                                                                ? anuncio.contenido.substring(0, 80) + "..."
                                                                : anuncio.contenido}
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${anuncio.estado === "activo" ? "bg-success" : "bg-danger"}`}>
                                                                {anuncio.estado === "activo" ? "Visible" : "Oculto"}
                                                            </span>
                                                        </td>
                                                        <td className="text-muted" style={{ whiteSpace: "nowrap" }}>
                                                            {new Date(anuncio.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <Link
                                                                    to={`/panel/admin/anuncios/editar/${anuncio.id}`}
                                                                    className="btn btn-primary btn-sm"
                                                                >
                                                                    Editar
                                                                </Link>
                                                                <button
                                                                    className={anuncio.estado === "activo" ? "btn btn-danger btn-sm" : "btn btn-success btn-sm"}
                                                                    onClick={() => cambiarEstado(anuncio.id)}
                                                                >
                                                                    {anuncio.estado === "activo" ? "Ocultar" : "Mostrar"}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center text-muted py-3">
                                                        No se encontraron anuncios.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modal Ayuda */}
                    {
                        showHelp && (
                            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
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
                                        administrar todos los anuncios
                                        de USBA.
                                    </p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default AdminAnuncios;