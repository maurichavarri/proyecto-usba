import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminCategorias = () => {

    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        obtenerCategorias();
    }, []);

    const obtenerCategorias = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/v1/categorias/admin/todas",
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
            await fetch(`http://localhost:3000/api/v1/categorias/${id}/estado`,
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
        <div className="container mt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    Categorías
                </h2>
                <Link
                    to="/panel/admin/categorias/crear"
                    className="btn btn-dark"
                >
                    Crear categoría
                </Link>
            </div>

            <table className="table">
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
                        categorias.map((categoria) => (
                            <tr key={categoria.id}>
                                <td>{categoria.id}</td>
                                <td>{categoria.nombre}</td>
                                <td>{categoria.estado}</td>
                                <td className="d-flex gap-2">
                                    <Link
                                        to={`/panel/admin/categorias/editar/${categoria.id}`}
                                        className="btn btn-warning btn-sm"
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() => cambiarEstado(categoria.id)}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        {
                                            categoria.estado === 'activo'
                                                ? 'Archivar'
                                                : 'Activar'
                                        }
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default AdminCategorias;