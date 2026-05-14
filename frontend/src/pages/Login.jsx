import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                "http://localhost:3000/api/v1/auth/ingresar",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        correo,
                        contraseña
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error en el login");
            }

            // Guardar token
            localStorage.setItem("token", data.token);
            // Guardar usuario
            localStorage.setItem("usuario", JSON.stringify(data.usuario));

            setMensaje("✅ Login exitoso");
            console.log(data);
            navigate("/");
        } catch (error) {
            console.error(error);
            setMensaje(`❌ ${error.message}`);
        }
    };

    return (
        <div className="container mt-5 mb-5 col-12 col-md-6">
            <form onSubmit={handleSubmit}>
                <h3>Ingresar</h3>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                    className="form-control mb-3"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    required
                    className="form-control mb-3"
                />
                <button type="submit" className="btn btn-dark w-100">
                    Iniciar sesión
                </button>
            </form>
            {
                mensaje &&
                <p className="mt-3">{mensaje}</p>
            }
        </div>
    );
};

export default Login;