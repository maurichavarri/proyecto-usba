import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CrearEquipo = () => {
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [mensajeExito, setMensajeExito] = useState(""); // Estado para el cartel en pantalla
    const [showHelp, setShowHelp] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/v1/delegado/equipos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre,
                    descripcion
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            console.log(data);

            // En lugar de alert(), activamos el mensaje visual en pantalla
            setMensajeExito("¡Equipo creado correctamente!");

            // Opcional: Redirigir al panel después de 1.5 segundos para que el usuario llegue a leer el cartel
            setTimeout(() => {
                navigate("/panel/delegado/equipos");
            }, 1500);

        } catch (error) {
            console.error(error);
            alert(error.message); // O puedes usar otro estado para errores si prefieres
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="col-lg-10 mx-auto">

                {/* Breadcrumb y Titulo */}
                <div className="mb-3">
                    <nav className="mb-1" style={{ fontSize: "0.9rem" }}>
                        <span
                            className="text-muted"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/panel/delegado")}
                        >
                            Panel de Delegado
                        </span>

                        {" > "}

                        <span
                            className="text-muted"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/panel/delegado/equipos")}
                        >
                            Mis Equipos
                        </span>

                        {" > "}

                        <span className="text-muted">
                            Crear Equipo
                        </span>
                    </nav>
                    <div className="d-flex align-items-center mb-2">
                        <h3 className="fw-bold me-2 mb-0">Crear Equipo</h3>
                        <span
                            onClick={() => setShowHelp(true)}
                            style={{
                                cursor: "pointer",
                                display: "inline-flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                backgroundColor: "#6c757d", // gris Bootstrap
                                color: "white",
                                fontSize: "1rem",
                                fontWeight: "bold"
                            }}
                        >
                            ?
                        </span>
                    </div>
                </div>

                {/* Cartel de éxito integrado en la pantalla */}
                {mensajeExito && (
                    <div className="alert alert-success shadow-sm" role="alert">
                        {mensajeExito}
                    </div>
                )}

                {/* Botón Volver */}
                <div className="d-flex justify-content-between mb-3">
                    <button className="btn btn-dark" onClick={() => navigate("/panel/delegado/equipos")}>
                        ← Volver
                    </button>
                </div>

                {/* Tarjeta del Formulario */}
                <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                    <form onSubmit={handleSubmit}>
                        {/* Nombre */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold text-secondary">
                                Nombre del Equipo
                            </label>
                            <input
                                type="text"
                                className="form-control"

                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>

                        {/* Descripción */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold text-secondary">
                                Descripción
                            </label>
                            <textarea
                                className="form-control"
                                rows="3"

                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            />
                        </div>

                        {/* Botón de envío */}
                        <div>
                            <button type="submit" className="btn btn-primary px-4">
                                Crear Equipo
                            </button>
                        </div>
                    </form>
                </div>

                {/* Modal ayuda */}
                {showHelp && (
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
                    >
                        <div className="bg-white p-4 rounded shadow" style={{ maxWidth: "550px" }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5>¿Cómo funciona este apartado?</h5>
                                <button className="btn-close" onClick={() => setShowHelp(false)} />
                            </div>
                            <p>Desde esta sección podés crear tu <b>EQUIPO</b>. Podés asignarle un nombre y una descripción
                                <br /><br />
                                (<b>NO</b> puede haber equipos con el mismo nombre).
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CrearEquipo;