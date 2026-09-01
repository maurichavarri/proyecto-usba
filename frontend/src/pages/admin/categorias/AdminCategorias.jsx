import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminCategorias = () => {
    const navigate = useNavigate();
    const [categorias, setCategorias] = useState([]);
    const [showHelp, setShowHelp] = useState(false);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        obtenerCategorias();
    }, []);

    const obtenerCategorias = async () => {
        try {
            const token = localStorage.getItem("token");
<<<<<<< HEAD
            const response = await fetch("http://localhost:3000/api/v1/categorias/admin/todas",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();
            if (response.ok) {
                setCategorias(data);
            } else {
                setCategorias([]);
            }

=======
            const response = await fetch("http://localhost:3000/api/v1/categorias/admin/todas", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            setCategorias(data);
>>>>>>> 63c6e1b (cambios de administrador y delegados)
        } catch (error) {
            console.error(error);
        }
    };

    const cambiarEstado = async (id) => {
        try {
            const token = localStorage.getItem("token");
<<<<<<< HEAD
            await fetch(`http://localhost:3000/api/v1/categorias/${id}/estado`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

=======
            await fetch(`http://localhost:3000/api/v1/categorias/${id}/estado`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            });
>>>>>>> 63c6e1b (cambios de administrador y delegados)
            obtenerCategorias();
        } catch (error) {
            console.error(error);
        }
    };

<<<<<<< HEAD
    const categoriasFiltradas = categorias.filter((categoria) => {
        const texto = busqueda.toLowerCase();
        return (categoria.nombre?.toLowerCase().includes(texto));
    });

    return (
        <div className="container mt-5 mb-5">
            <div className="col-lg-10 mx-auto">
=======
    const categoriasFiltradas = categorias.filter((categoria) =>
        categoria.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="container mt-5 mb-5">
            <div className="col-lg-10 mx-auto">
                <div className="col-md-12 mx-auto">

<<<<<<< HEAD
                {/* Título */}
>>>>>>> 63c6e1b (cambios de administrador y delegados)
                <div className="d-flex align-items-center mb-2">
                    <h2 className="me-2">Gestión de Categorías</h2>
                    <span
                        style={{ cursor: "pointer", fontSize: "1.2rem" }}
                        className="text-primary"
                        onClick={() => setShowHelp(true)}
                    >
                        ❓
                    </span>
                </div>

                {/* Breadcrumb */}
                <nav className="mb-3" style={{ fontSize: "0.9rem" }}>
                    <span
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/panel/admin")}
                    >
                        Panel del Administrador
                    </span>
                    {" > "}
                    <span className="text-muted">Categorías</span>
                </nav>

                {/* Botones */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <button
                        className="btn btn-dark"
                        onClick={() => navigate("/panel/admin")}
                    >
                        ← Regresar al panel
                    </button>
                    <Link to="/panel/admin/categorias/crear" className="btn btn-primary">
                        Crear categoría
                    </Link>
                </div>

                {/* Tabla */}
                <div className="card shadow-sm">
                    <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                        <strong>Categorías registradas</strong>
                        <input
                            type="text"
                            className="form-control w-auto"
                            placeholder="Buscar..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
=======
                    {/* Título */}
                    <div className="d-flex align-items-center mb-2">
                        <h2 className="me-2">Gestión de Categorías</h2>
                        <span
                            style={{ cursor: "pointer", fontSize: "1.2rem" }}
                            className="text-primary"
                            onClick={() => setShowHelp(true)}
                        >
                            ❓
                        </span>
>>>>>>> a738da2 (Puliendo detalles del Front-end)
                    </div>

                    {/* Breadcrumb */}
                    <nav className="mb-3" style={{ fontSize: "0.9rem" }}>
                        <span
                            className="text-primary"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/panel/admin")}
                        >
                            Panel del Administrador
                        </span>
                        {" > "}
                        <span className="text-muted">Categorías</span>
                    </nav>

                    {/* Botones */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <button
                            className="btn btn-dark"
                            onClick={() => navigate("/panel/admin")}
                        >
                            ← Regresar al panel
                        </button>
                        <Link to="/panel/admin/categorias/crear" className="btn btn-primary">
                            + Crear categoría
                        </Link>
                    </div>

                    {/* Tabla */}
                    <div className="card shadow-sm">
                        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                            <strong>Categorías registradas</strong>
                            <input
                                type="text"
                                className="form-control w-auto"
                                placeholder="Buscar..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>

                        <div className="card-body">
                            {categorias.length === 0 ? (
                                <div className="alert alert-info">
                                    No existen categorías registradas.
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table align-middle">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categoriasFiltradas.length > 0 ? (
                                                categoriasFiltradas.map((categoria) => (
                                                    <tr key={categoria.id}>
                                                        <td>{categoria.nombre}</td>
                                                        <td>
                                                            {categoria.estado === "activo" ? (
                                                                <span className="badge bg-success">Activa</span>
                                                            ) : (
                                                                <span className="badge bg-danger">Archivada</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <Link
                                                                    to={`/panel/admin/categorias/editar/${categoria.id}`}
                                                                    className="btn btn-primary btn-sm"
                                                                >
                                                                    Editar
                                                                </Link>
                                                                <button
                                                                    onClick={() => cambiarEstado(categoria.id)}
                                                                    className={categoria.estado === "activo" ? "btn btn-danger btn-sm" : "btn btn-success btn-sm"}
                                                                >
                                                                    {categoria.estado === "activo" ? "Archivar" : "Activar"}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="text-center text-muted">
                                                        No se encontraron categorías.
                                                    </td>
                                                </tr>
<<<<<<< HEAD
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center text-muted">
                                                    No se encontraron categorías.
                                                </td>
                                            </tr>
<<<<<<< HEAD
                                        </thead>

                                        <tbody>
                                            {
                                                categoriasFiltradas.length > 0 ? (
                                                    categoriasFiltradas.map((categoria) => (
                                                        <tr key={categoria.id}>
                                                            <td>
                                                                {categoria.nombre}
                                                            </td>

                                                            <td>
                                                                {
                                                                    categoria.estado === "activo"
                                                                        ? (
                                                                            <span className="badge bg-success">
                                                                                Visible
                                                                            </span>
                                                                        )
                                                                        : (
                                                                            <span className="badge bg-danger">
                                                                                Oculto
                                                                            </span>
                                                                        )
                                                                }
                                                            </td>

                                                            <td>

                                                                <div className="d-flex gap-2">

                                                                    <Link
                                                                        to={`/panel/admin/categorias/editar/${categoria.id}`}
                                                                        className="btn btn-primary btn-sm"
                                                                    >
                                                                        Editar
                                                                    </Link>

                                                                    <button
                                                                        onClick={() =>
                                                                            cambiarEstado(categoria.id)
                                                                        }
                                                                        className={
                                                                            categoria.estado === "activo"
                                                                                ? "btn btn-danger btn-sm"
                                                                                : "btn btn-success btn-sm"
                                                                        }
                                                                    >
                                                                        {
                                                                            categoria.estado === "activo"
                                                                                ? "Ocultar"
                                                                                : "Mostrar"
                                                                        }
                                                                    </button>

                                                                </div>

                                                            </td>

                                                        </tr>
                                                    ))
                                                ) : (

                                                    <tr>

                                                        <td
                                                            colSpan="4"
                                                            className="text-center text-muted"
                                                        >
                                                            No se encontraron categorías.
                                                        </td>

                                                    </tr>
                                                )
                                            }

                                        </tbody>

                                    </table>

                                </div>
                            )
                        }

=======
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
>>>>>>> 63c6e1b (cambios de administrador y delegados)
                    </div>
                </div>
            </div>

<<<<<<< HEAD
            {
                showHelp &&
                (
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                        style={{
                            backgroundColor: "rgba(0,0,0,0.5)"
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
                                    ¿Cómo funciona este apartado?
                                </h5>

                                <button
                                    className="btn-close"
                                    onClick={() =>
                                        setShowHelp(false)
                                    }
                                />

                            </div>

                            <p>
                                Desde aquí podés crear, editar,
                                mostrar u ocultar categorías
                                utilizadas en los torneos.
                            </p>

=======
            {/* Modal ayuda */}
            {showHelp && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="bg-white p-4 rounded shadow" style={{ maxWidth: "500px" }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>¿Cómo funciona este apartado?</h5>
                            <button className="btn-close" onClick={() => setShowHelp(false)} />
>>>>>>> 63c6e1b (cambios de administrador y delegados)
=======
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
>>>>>>> a738da2 (Puliendo detalles del Front-end)
                        </div>
                    </div>
                </div>

                {/* Modal ayuda */}
                {showHelp && (
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    >
                        <div className="bg-white p-4 rounded shadow" style={{ maxWidth: "500px" }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5>¿Cómo funciona este apartado?</h5>
                                <button className="btn-close" onClick={() => setShowHelp(false)} />
                            </div>
                            <p>Desde aquí podés crear, editar, activar o archivar categorías utilizadas en los torneos.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default AdminCategorias;