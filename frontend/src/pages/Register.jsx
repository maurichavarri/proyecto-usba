import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/v1/auth/inscribirse", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
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
        <div style={{
            minHeight: "calc(100vh - 120px)",
            display: "flex",
            backgroundColor: "#0a0a0a",
        }}>
            {/* Panel izquierdo — decorativo */}
            <div style={{
                flex: 1,
                display: "none",
                position: "relative",
                overflow: "hidden",
            }} className="d-none d-md-block">
                {/* Fondo */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, #e8500a 0%, #c94008 40%, #0a0a0a 100%)",
                }} />
                {/* Texto decorativo */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "60px",
                    color: "#fff",
                }}>
                    <div style={{
                        fontSize: "4rem",
                        marginBottom: "24px",
                    }}>🏀</div>
                    <h1 style={{
                        fontSize: "clamp(2rem, 3vw, 3rem)",
                        fontWeight: "900",
                        lineHeight: 1.1,
                        marginBottom: "16px",
                        letterSpacing: "-1px",
                    }}>
                        El básquet<br />amateur de<br />Santiago.
                    </h1>
                    <p style={{
                        fontSize: "1rem",
                        opacity: 0.75,
                        maxWidth: "320px",
                        lineHeight: 1.7,
                    }}>
                        Registrate para gestionar tu equipo y jugadores. Luego... competir.
                    </p>

                    {/* Líneas decorativas */}
                    <div style={{
                        marginTop: "48px",
                        display: "flex",
                        gap: "8px",
                    }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{
                                height: "4px",
                                width: i === 1 ? "40px" : "12px",
                                backgroundColor: i === 1 ? "#fff" : "rgba(255,255,255,0.3)",
                                borderRadius: "2px",
                            }} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Panel derecho — formulario */}
            <div style={{
                width: "100%",
                maxWidth: "480px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "48px 40px",
                backgroundColor: "#111",
            }}>
                {/* Logo */}
                <div style={{ marginBottom: "40px" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🏀</div>
                    <div style={{
                        color: "#e8500a",
                        fontSize: "11px",
                        fontWeight: "800",
                        letterSpacing: "3px",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                    }}>
                        USBA · Básquet Amateur
                    </div>
                    <h2 style={{
                        color: "#fff",
                        fontWeight: "900",
                        fontSize: "1.8rem",
                        letterSpacing: "-0.5px",
                        margin: 0,
                    }}>
                        Crea tu cuenta
                    </h2>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{
                            display: "block",
                            color: "rgba(255,255,255,0.6)",
                            fontSize: "12px",
                            fontWeight: "700",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            marginBottom: "8px",
                        }}>
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            value={correo}
                            onChange={e => setCorreo(e.target.value)}
                            required
                            placeholder="tu@correo.com"
                            style={{
                                width: "100%",
                                padding: "14px 16px",
                                backgroundColor: "#1a1a1a",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "4px",
                                color: "#fff",
                                fontSize: "0.95rem",
                                outline: "none",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={e => e.target.style.borderColor = "#e8500a"}
                            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                        />
                    </div>

                    <div style={{ marginBottom: "32px" }}>
                        <label style={{
                            display: "block",
                            color: "rgba(255,255,255,0.6)",
                            fontSize: "12px",
                            fontWeight: "700",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            marginBottom: "8px",
                        }}>
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={contraseña}
                            onChange={e => setContraseña(e.target.value)}
                            required
                            placeholder="••••••••"
                            style={{
                                width: "100%",
                                padding: "14px 16px",
                                backgroundColor: "#1a1a1a",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "4px",
                                color: "#fff",
                                fontSize: "0.95rem",
                                outline: "none",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={e => e.target.style.borderColor = "#e8500a"}
                            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                        />
                    </div>

                    {mensaje && (
                        <div style={{
                            backgroundColor: "rgba(220,53,69,0.15)",
                            border: "1px solid rgba(220,53,69,0.3)",
                            color: "#ff6b7a",
                            padding: "12px 16px",
                            borderRadius: "4px",
                            fontSize: "0.85rem",
                            marginBottom: "20px",
                        }}>
                            {mensaje}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "15px",
                            backgroundColor: loading ? "#c94008" : "#e8500a",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            fontWeight: "800",
                            fontSize: "0.9rem",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "background-color 0.2s",
                        }}
                        onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = "#c94008"; }}
                        onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = "#e8500a"; }}
                    >
                        {loading ? "Registrando..." : "Registrar →"}
                    </button>
                </form>

                <p style={{
                    marginTop: "32px",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "0.85rem",
                    textAlign: "center",
                }}>
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/auth/ingresar" style={{ color: "#e8500a", fontWeight: "700" }}>
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;