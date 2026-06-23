import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditarCategoria = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [showHelp, setShowHelp] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: ""
    });

    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        obtenerCategoria();
    }, []);

    const obtenerCategoria = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/categorias/${id}`);
            const data = await response.json();
            setFormData({
                nombre: data.nombre || "",
                descripcion: data.descripcion || ""
            });

        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.nombre.trim()) {
            return "El nombre de la categoría es obligatorio.";
        }
        return "";
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        const validationError = validateForm();

        if (validationError) {
            setMensaje(validationError);
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`http://localhost:3000/api/v1/categorias/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMensaje(data.message || "Error al actualizar categoría");
                return;
            }

            navigate("/panel/admin/categorias");

        } catch (error) {
            console.error(error);
            setMensaje("Error al actualizar categoría");
        }
    };

    return (
        <div className="container mt-4 mb-5">

            <div className="col-md-8 mx-auto">

                <div className="d-flex align-items-center mb-2">

                    <h2 className="me-2">
                        Editar Categoría
                    </h2>

                    <span
                        style={{
                            cursor: "pointer",
                            fontSize: "1.2rem"
                        }}
                        className="text-primary"
                        onClick={() => setShowHelp(true)}
                        title="Ayuda"
                    >
                        ❓
                    </span>

                </div>

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

                    <span
                        className="text-primary"
                        style={{
                            cursor: "pointer"
                        }}
                        onClick={() =>
                            navigate(
                                "/panel/admin/categorias"
                            )
                        }
                    >
                        Categorías
                    </span>

                    {" > "}

                    <span className="text-muted">
                        Editar Categoría
                    </span>

                </nav>

                <button
                    className="btn btn-dark mb-3"
                    onClick={() => navigate(-1)}
                >
                    Volver
                </button>

                <div className="card shadow-sm">

                    <div className="card-header bg-dark">

                        <strong className="text-white">
                            Formulario de edición
                        </strong>

                    </div>

                    <div className="card-body p-3">

                        {
                            mensaje &&
                            (
                                <div className="alert alert-danger mb-3">
                                    {mensaje}
                                </div>
                            )
                        }

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">

                                <label className="form-label">
                                    Nombre
                                </label>

                                <input
                                    type="text"
                                    name="nombre"
                                    className="form-control"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Descripción
                                </label>

                                <textarea
                                    name="descripcion"
                                    rows="4"
                                    className="form-control"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                />

                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Guardar cambios
                            </button>

                        </form>

                    </div>

                </div>

                {
                    showHelp &&
                    (
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
                                    Desde aquí podés modificar los datos de una categoría existente. Los cambios se guardarán automáticamente al presionar el botón <strong>Guardar cambios</strong>.
                                </p>

                            </div>

                        </div>
                    )
                }

            </div>

        </div>
    );

};

export default EditarCategoria;