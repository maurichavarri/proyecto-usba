import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CrearTorneo = () => {
    const navigate = useNavigate();
    const [showHelp, setShowHelp] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        fechaInicio: "",
        cierreInscripcion: "",
        fechaFin: ""
    });
    const [error, setError] = useState("");

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

    const handleCreate = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }
        setError("");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/v1/torneos/crear", {
                method: "POST",
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
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Error al crear torneo");
            } else {
                navigate("/panel/admin/torneos");
            }
        } catch (error) {
            console.error(error);
            setError("Error al crear torneo");
        }
    };


    return (
        <div className="container mt-4 mb-5">
            <div className="col-md-8 mx-auto">
                {/* Título con icono de ayuda */}
                <div className="d-flex align-items-center mb-2">
                    <h2 className="me-2">Crear Torneo</h2>
                    <span
                        style={{ cursor: "pointer", fontSize: "1.2rem" }}
                        className="text-primary"
                        onClick={() => setShowHelp(true)}
                        title="Ayuda"
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
                        Admin Dashboard
                    </span>
                    {" > "}
                    <span
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/panel/admin/torneos")}
                    >
                        Torneos
                    </span>
                    {" > "}
                    <span className="text-muted">Crear Torneo</span>
                </nav>

                <button
                    className="btn btn-dark mb-3"
                    onClick={() => navigate(-1)}
                >
                    Volver
                </button>

                {/* Card con header y formulario */}
                <div className="card shadow-sm">
                    <div className="card-header bg-dark">
                        <strong className="text-white">Formulario de creación</strong>
                    </div>
                    <div className="card-body p-3">
                        {error && (
                            <div className="alert alert-danger mb-3">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleCreate}>
                            <div className="mb-2">
                                <label htmlFor="nombre" className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    className="form-control"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-2">
                                <label htmlFor="cierreInscripcion" className="form-label">Cierre de inscripción</label>
                                <input
                                    type="date"
                                    id="cierreInscripcion"
                                    name="cierreInscripcion"
                                    className="form-control"
                                    value={formData.cierreInscripcion}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-2">
                                <label htmlFor="fechaInicio" className="form-label">Fecha inicio</label>
                                <input
                                    type="date"
                                    id="fechaInicio"
                                    name="fechaInicio"
                                    className="form-control"
                                    value={formData.fechaInicio}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-2">
                                <label htmlFor="fechaFin" className="form-label">Fecha fin</label>
                                <input
                                    type="date"
                                    id="fechaFin"
                                    name="fechaFin"
                                    className="form-control"
                                    value={formData.fechaFin}
                                    onChange={handleChange}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary mt-2 mb-0">
                                Crear torneo
                            </button>
                        </form>
                    </div>
                </div>

                {/* Modal de ayuda */}
                {showHelp && (
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    >
                        <div className="bg-white p-4 rounded shadow" style={{ maxWidth: "500px" }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5>¿Cómo funciona este apartado?</h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setShowHelp(false)}
                                ></button>
                            </div>
                            <p>
                                En este apartado podés crear un nuevo torneo.
                                Completá el formulario con los datos requeridos
                                y presioná el botón <strong className="text-primary">“Crear torneo”</strong>.
                                El sistema guardará la información y el torneo quedará disponible en la sección de Torneos.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CrearTorneo;