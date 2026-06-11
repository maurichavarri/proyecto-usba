import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CrearCategoria = () => {

    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            try {

                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:3000/api/v1/categorias/crear",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },

                        body: JSON.stringify({ nombre, descripcion })
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                    return;
                }

                navigate("/panel/admin/categorias");

            } catch (error) {
                console.error(error);
                setMensaje(error.message);
            }
        };

    return (
        <div className="container mt-5 mb-5 col-md-6">

            <h2 className="mb-4">
                Crear Categoría
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
                        onChange={(e) =>
                            setNombre(e.target.value)
                        }
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
                    Crear
                </button>

            </form>

            {
                mensaje &&
                <div className="alert alert-danger mt-3">
                    {mensaje}
                </div>
            }

        </div>
    );
};

export default CrearCategoria;