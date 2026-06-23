import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminAnuncios = () => {

    const navigate = useNavigate();

    const [showHelp, setShowHelp] = useState(false);

    const [anuncios, setAnuncios] = useState([]);

    useEffect(() => {
        obtenerAnuncios();
    }, []);

    const obtenerAnuncios = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response =
                await fetch(
                    "http://localhost:3000/api/v1/anuncios/admin/todos",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            const data =
                await response.json();

            setAnuncios(data);

        } catch (error) {

            console.error(error);
        }
    };

    const cambiarEstado = async (id) => {

        try {

            const token =
                localStorage.getItem("token");

            await fetch(
                `http://localhost:3000/api/v1/anuncios/${id}/estado`,
                {
                    method: "PATCH",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            obtenerAnuncios();

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
                        Gestión de Anuncios
                    </h2>

                    <span
                        className="text-primary"
                        style={{
                            cursor: "pointer",
                            fontSize: "1.2rem"
                        }}
                        title="Ayuda"
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
                        Anuncios
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
                        to="/panel/admin/anuncios/crear"
                        className="btn btn-dark"
                    >
                        Crear anuncio
                    </Link>

                </div>

                <div className="card shadow-sm">

                    <div className="card-header bg-dark">

                        <strong className="text-white">
                            Listado de anuncios
                        </strong>

                    </div>

                    <div className="card-body">

                        {
                            anuncios.length === 0 ? (

                                <div className="alert alert-info mb-0">
                                    No existen anuncios registrados.
                                </div>

                            ) : (

                                <div className="table-responsive">

                                    <table className="table align-middle">

                                        <thead>

                                            <tr>
                                                <th>Título</th>
                                                <th>Contenido</th>
                                                <th>Estado</th>
                                                <th>Fecha</th>
                                                <th>Acciones</th>
                                            </tr>

                                        </thead>

                                        <tbody>

                                            {
                                                anuncios.map((anuncio) => (

                                                    <tr key={anuncio.id}>

                                                        <td>
                                                            <strong>
                                                                {anuncio.titulo}
                                                            </strong>
                                                        </td>

                                                        <td>
                                                            {
                                                                anuncio.contenido?.length > 80
                                                                    ? anuncio.contenido.substring(0, 80) + "..."
                                                                    : anuncio.contenido
                                                            }
                                                        </td>

                                                        <td>

                                                            {
                                                                anuncio.estado === "activo"
                                                                    ? (
                                                                        <span className="badge bg-success">
                                                                            Activo
                                                                        </span>
                                                                    )
                                                                    : (
                                                                        <span className="badge bg-danger">
                                                                            Archivado
                                                                        </span>
                                                                    )
                                                            }

                                                        </td>

                                                        <td>
                                                            {
                                                                new Date(
                                                                    anuncio.createdAt
                                                                ).toLocaleDateString()
                                                            }
                                                        </td>

                                                        <td>

                                                            <div className="d-flex gap-2">

                                                                <Link
                                                                    to={`/panel/admin/anuncios/editar/${anuncio.id}`}
                                                                    className="btn btn-black btn-sm"
                                                                >
                                                                    Editar
                                                                </Link>

                                                                <button
                                                                    className={
                                                                        anuncio.estado === "activo"
                                                                            ? "btn btn-danger btn-sm"
                                                                            : "btn btn-success btn-sm"
                                                                    }
                                                                    onClick={() =>
                                                                        cambiarEstado(anuncio.id)
                                                                    }
                                                                >
                                                                    {
                                                                        anuncio.estado === "activo"
                                                                            ? "Archivar"
                                                                            : "Activar"
                                                                    }
                                                                </button>

                                                            </div>

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
                                    Desde aquí podés administrar los anuncios
                                    publicados en la plataforma. También podés
                                    crear nuevos anuncios, editarlos o archivarlos.
                                </p>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default AdminAnuncios;