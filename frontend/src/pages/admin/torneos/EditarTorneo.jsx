import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditarTorneo = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [showHelp, setShowHelp] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        nombre: "",
        fechaInicio: "",
        cierreInscripcion: "",
        fechaFin: ""
    });

    useEffect(() => {
        obtenerTorneo();
    }, []);

    const obtenerTorneo = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/torneos/${id}`);
            const data = await response.json();
            setFormData({
                nombre: data.nombre || "",
                fechaInicio: data.fecha_inicio || "",
                fechaFin: data.fecha_fin || "",
                cierreInscripcion: data.fecha_cierre_inscripcion || ""
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
            return "El nombre del torneo es obligatorio.";
        }

        if (!formData.fechaInicio || !formData.fechaFin) {
            return "Debes ingresar fecha de inicio y fecha fin.";
        }

        if (formData.fechaInicio > formData.fechaFin) {
            return "La fecha de inicio no puede ser posterior a la fecha fin.";
        }

        if (formData.cierreInscripcion) {
            if (formData.cierreInscripcion >= formData.fechaInicio) {
                return "El cierre de inscripción debe ser anterior a la fecha de inicio.";
            }
        }

        return "";
    };

    const handleUpdate = async (e) => {

        e.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`http://localhost:3000/api/v1/torneos/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        nombre: formData.nombre,
                        fecha_inicio: formData.fechaInicio,
                        fecha_fin: formData.fechaFin,
                        fecha_cierre_inscripcion: formData.cierreInscripcion
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Error al actualizar torneo");
                return;
            }

            navigate("/panel/admin/torneos");

        } catch (error) {
            console.error(error);
            setError("Error al actualizar torneo");
        }
    };

    return (
        <div className="container mt-4 mb-5">
            <div className="col-md-8 mx-auto">
                <div className="d-flex align-items-center mb-2">
                    <h2 className="me-2">
                        Editar Torneo
                    </h2>
                    <span
                        style={{ cursor: "pointer", fontSize: "1.2rem" }}
                        className="text-primary"
                        onClick={() =>
                            setShowHelp(true)
                        }
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
                            navigate(
                                "/panel/admin"
                            )
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
                                "/panel/admin/torneos"
                            )
                        }
                    >
                        Torneos
                    </span>

                    {" > "}

                    <span className="text-muted">
                        Editar Torneo
                    </span>

                </nav>

                <button
                    className="btn btn-dark mb-3"
                    onClick={() =>
                        navigate(-1)
                    }
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
                            error &&
                            <div className="alert alert-danger mb-3">
                                {error}
                            </div>
                        }

                        <form onSubmit={handleUpdate}>

                            <div className="mb-2">

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

                            <div className="mb-2">

                                <label className="form-label">
                                    Cierre de inscripción
                                </label>

                                <input
                                    type="date"
                                    name="cierreInscripcion"
                                    className="form-control"
                                    value={formData.cierreInscripcion}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="mb-2">

                                <label className="form-label">
                                    Fecha inicio
                                </label>

                                <input
                                    type="date"
                                    name="fechaInicio"
                                    className="form-control"
                                    value={formData.fechaInicio}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="mb-2">

                                <label className="form-label">
                                    Fecha fin
                                </label>

                                <input
                                    type="date"
                                    name="fechaFin"
                                    className="form-control"
                                    value={formData.fechaFin}
                                    onChange={handleChange}
                                />

                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary mt-2"
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
                                    En este apartado podés modificar los datos de un torneo existente. Una vez realizados los cambios, presioná el botón <strong>Guardar cambios</strong>.
                                </p>

                            </div>

                        </div>
                    )
                }

            </div>

        </div>
    );

};

export default EditarTorneo;