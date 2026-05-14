import React, { useState } from "react";

const Register = () => {
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/api/v1/auth/inscribirse", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // 👇 el backend espera exactamente estos nombres
                body: JSON.stringify({ correo, contraseña }),
            });

            if (!response.ok) {
                setMensaje(`❌ ${data.message || "Error en el registro"}`);
                return;
            }


            const data = await response.json();
            setMensaje("Registro exitoso ✅");
            console.log("Registro exitoso:", data);

            // Ejemplo: redirigir al login
            // navigate("/login");
        } catch (error) {
            setMensaje("❌ No se pudo registrar");
            console.error("Error:", error.message);
        }
    };

    return (
        <div className="container mt-5 mb-5 col-12 col-md-6">
            <form onSubmit={handleSubmit}>
                <h3>Inscribirse</h3>
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
                    Crear cuenta
                </button>
            </form>

            {mensaje && <p className="mt-3">{mensaje}</p>}
        </div>
    );
};

export default Register;
