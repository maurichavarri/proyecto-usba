import { useState } from "react";

const CrearEquipo = () => {

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/v1/delegado/equipos",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        nombre,
                        descripcion
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }
            
            console.log(data);
            alert("Equipo creado correctamente");

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <h2>Crear Equipo</h2>
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

                {/* Descripción */}
                <div className="mb-3">
                    <label className="form-label">
                        Descripción
                    </label>
                    <textarea
                        className="form-control"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-dark"
                >
                    Crear equipo
                </button>

            </form>
        </div>
    );
};

export default CrearEquipo;