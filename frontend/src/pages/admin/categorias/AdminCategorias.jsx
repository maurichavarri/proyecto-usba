import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminCategorias = () => {

    const navigate = useNavigate();

    const [categorias, setCategorias] = useState([]);
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        obtenerCategorias();
    }, []);

    const obtenerCategorias = async () => {
        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:3000/api/v1/categorias/admin/todas",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            setCategorias(data);

        } catch (error) {
            console.error(error);
        }
    };

    const cambiarEstado = async (id) => {

        try {

            const token = localStorage.getItem("token");

            await fetch(
                `http://localhost:3000/api/v1/categorias/${id}/estado`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            obtenerCategorias();

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-4 mb-5">

            <div className="col-md-12 mx-auto">

                <div className="d-flex align-items-center mb-2">

                    <h2 className="me-2">
                        Gestión de Categorías
                    </h2>

                    <span
                        style={{
                            cursor: "pointer",
                            fontSize: "1.2rem"
                        }}
                        className="text-primary"
                        onClick={() => setShowHelp(true)}
                    >
                        ❓
                    </span>

                </div>

                <nav
                    className="mb-3"
                    style={{ fontSize: "0.9rem" }}
                >
                    <span
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                            navigate("/panel/admin")
                        }
                    >
                        Admin Dashboard
                    </span>

                    {" > "}

                    <span className="text-muted">
                        Categorías
                    </span>

                </nav>

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <button
                        className="btn btn-dark"
                        onClick={() => navigate(-1)}
                    >
                        Volver
                    </button>

                    <Link
                        to="/panel/admin/categorias/crear"
                        className="btn btn-dark"
                    >
                        Crear categoría
                    </Link>

                </div>

                <div className="card shadow-sm">

                    <div className="card-header bg-dark text-white">

                        <strong>
                            Categorías registradas
                        </strong>

                    </div>

                    <div className="card-body">

                        {
                            categorias.length === 0 &&
                            (
                                <div className="alert alert-info">
                                    No existen categorías registradas.
                                </div>
                            )
                        }

                        {
                            categorias.length > 0 &&
                            (
                                <div className="table-responsive">

                                    <table className="table align-middle">

                                        <thead>

                                            <tr>

                                                <th>ID</th>
                                                <th>Nombre</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {
                                                categorias.map(
                                                    (categoria) => (

                                                        <tr key={categoria.id}>

                                                            <td>
                                                                {categoria.id}
                                                            </td>

                                                            <td>
                                                                {categoria.nombre}
                                                            </td>

                                                            <td>

                                                                {
                                                                    categoria.estado === "activo"
                                                                        ? (
                                                                            <span className="badge bg-success">
                                                                                Activa
                                                                            </span>
                                                                        )
                                                                        : (
                                                                            <span className="badge bg-danger">
                                                                                Archivada
                                                                            </span>
                                                                        )
                                                                }

                                                            </td>

                                                            <td>

                                                                <div className="d-flex gap-2">

                                                                    <Link
                                                                        to={`/panel/admin/categorias/editar/${categoria.id}`}
                                                                        className="btn btn-dark btn-sm"
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
                                                                                ? "Archivar"
                                                                                : "Activar"
                                                                        }
                                                                    </button>

                                                                </div>

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

            </div>

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
                                activar o archivar categorías
                                utilizadas en los torneos.
                            </p>

                        </div>

                    </div>
                )
            }

        </div>
    );
};

export default AdminCategorias;