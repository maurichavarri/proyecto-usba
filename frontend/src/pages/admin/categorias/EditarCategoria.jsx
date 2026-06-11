import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditarCategoria = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        obtenerCategoria();
    }, []);

    const obtenerCategoria = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/categorias/${id}`);
            const data = await response.json();
            if (data) {
                setNombre(data.nombre);
                setDescripcion(data.descripcion);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit =
        async (e) => {
            e.preventDefault();
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:3000/api/v1/categorias/${id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },

                        body: JSON.stringify({ nombre, descripcion })
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setMensaje(data.message);
                    return;
                }

                navigate("/panel/admin/categorias");

            } catch (error) {
                console.error(error);
            }
        };

    return (
        <div className="container mt-5 mb-5 col-md-6">
            <h2 className="mb-4">
                Editar Categoría
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>
                        Nombre
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={nombre}
                        onChange={(e) => {
                            setNombre(e.target.value);
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label>
                        Descripción
                    </label>
                    <textarea
                        className="form-control"
                        rows="4"
                        value={descripcion}
                        onChange={(e) =>
                            setDescripcion(e.target.value)
                        }
                    />
                </div>

                <button className="btn btn-dark">
                    Guardar cambios
                </button>

                {
                    mensaje &&
                    <div className="alert alert-danger mt-3">
                        {mensaje}
                    </div>
                }
            </form>
        </div>
    );
};

export default EditarCategoria;