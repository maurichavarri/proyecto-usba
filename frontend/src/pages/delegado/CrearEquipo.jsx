import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CrearEquipo = () => {
    const navigate = useNavigate();

    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [mensajeExito, setMensajeExito] = useState(""); // Estado para el cartel en pantalla

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
                navigate("/panel/delegado");
            }, 1500);

        } catch (error) {
            console.error(error);
            alert(error.message); // O puedes usar otro estado para errores si prefieres
        }
    };

    return (
<<<<<<< HEAD
        <div className="container mt-5 mb-5">
            <h2>Crear Equipo</h2>
             {/* Botón ir al dashboard */}
            <div className="mb-3">
                <button
                    className="btn btn-dark"
                    onClick={() => navigate("/panel/delegado")}
                >
                    ← Regresar al panel
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                {/* Nombre */}
                <div className="mb-3">
                    <label className="form-label">
                        Nombre
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
=======
        <div className="container mt-4 mb-5" style={{ maxWidth: "800px" }}>
            {/* Migas de pan / Navegación superior */}
            <div className="text-muted small mb-2">
                Delegado Dashboard &gt; Mis Equipos &gt; Crear Equipo
            </div>
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0

            {/* Título Principal */}
            <h2 className="fw-bold mb-4">Creación de Equipos</h2>

            {/* Cartel de éxito integrado en la pantalla */}
            {mensajeExito && (
                <div className="alert alert-success shadow-sm" role="alert">
                    {mensajeExito}
                </div>
            )}

            {/* Botón Volver */}
            <div className="mb-4">
                <button
                    className="btn btn-dark px-4"
                    onClick={() => navigate("/panel/delegado")}
                >
                    Volver
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
                        <button
                            type="submit"
                            className="btn btn-dark px-4"
                        >
                            + Crear Equipo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearEquipo;