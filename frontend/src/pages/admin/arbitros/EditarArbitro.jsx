import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditarArbitro = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [showHelp, setShowHelp] = useState(false);

    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        correo: ""
    });

    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        obtenerArbitro();
    }, []);

    const obtenerArbitro = async () => {

        try {

            const response = await fetch(
                `http://localhost:3000/api/v1/arbitros/${id}`
            );

            const data = await response.json();

            setFormData({
                nombre: data.nombre || "",
                apellido: data.apellido || "",
                correo: data.usuario?.correo || ""
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

        setMensaje("");
    };

    const validarFormulario = () => {

        if (!formData.nombre.trim()) {
            return "El nombre es obligatorio.";
        }

        if (!formData.apellido.trim()) {
            return "El apellido es obligatorio.";
        }

        if (!formData.correo.trim()) {
            return "El correo es obligatorio.";
        }

        return "";
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const error = validarFormulario();

        if (error) {
            setMensaje(error);
            return;
        }

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:3000/api/v1/arbitros/${id}`,
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

                setMensaje(data.message);

                return;
            }

            navigate("/panel/admin/arbitros");

        } catch (error) {

            console.error(error);

            setMensaje(
                "Error al actualizar el árbitro."
            );
        }
    };

    return (
        <div className="container mt-4 mb-5">

            <div className="col-md-8 mx-auto">

                <div className="d-flex align-items-center mb-2">

                    <h2 className="me-2">
                        Editar Árbitro
                    </h2>

                    <span
                        className="text-primary"
                        style={{
                            cursor: "pointer",
                            fontSize: "1.2rem"
                        }}
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

                    <span
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                            navigate("/panel/admin/arbitros")
                        }
                    >
                        Árbitros
                    </span>

                    {" > "}

                    <span className="text-muted">
                        Editar Árbitro
                    </span>

                </nav>

                <button
                    className="btn btn-dark mb-3"
                    onClick={() => navigate(-1)}
                >
                    Volver
                </button>

                <div className="card shadow-sm">

                    <div className="card-header bg-dark text-white">
                        <strong>
                            Formulario de edición
                        </strong>
                    </div>

                    <div className="card-body">

                        {
                            mensaje &&
                            <div className="alert alert-danger">
                                {mensaje}
                            </div>
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
                                    Apellido
                                </label>

                                <input
                                    type="text"
                                    name="apellido"
                                    className="form-control"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Correo
                                </label>

                                <input
                                    type="email"
                                    name="correo"
                                    className="form-control"
                                    value={formData.correo}
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
                    showHelp && (

                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor: "rgba(0,0,0,0.5)",
                                zIndex: 1050
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
                                    Desde aquí podés modificar los
                                    datos de un árbitro registrado.
                                </p>

                                <p>
                                    Realizá los cambios necesarios y
                                    luego presioná
                                    <strong className="text-primary">
                                        {" "}Guardar cambios
                                    </strong>.
                                </p>

                            </div>

                        </div>
                    )
                }

            </div>

        </div>
    );

};

export default EditarArbitro;