import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fecha_nacimiento: "",
    sexo: "",
    correo: "",
    contraseña: "",
    confirmarContraseña: "",
  });

  const [mensaje, setMensaje] = useState("");

  const [tipoMensaje, setTipoMensaje] = useState("error");

  const [loading, setLoading] = useState(false);

  // =========================
  // ESTILOS
  // =========================

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    backgroundColor: "#1a1a1a",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "4px",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    color: "rgba(255,255,255,0.6)",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "8px",
  };

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,

      [name]: name === "dni" ? value.replace(/\D/g, "") : value,
    });
  };

  // =========================
  // VALIDAR
  // =========================

  const validarFormulario = () => {
    if (!formData.nombre.trim()) {
      return "El nombre es obligatorio.";
    }

    if (!formData.apellido.trim()) {
      return "El apellido es obligatorio.";
    }

    if (!/^\d{7,8}$/.test(formData.dni)) {
      return "El DNI debe contener 7 u 8 números.";
    }

    if (!formData.fecha_nacimiento) {
      return "La fecha de nacimiento es obligatoria.";
    }

    if (!formData.sexo) {
      return "Debés seleccionar tu sexo.";
    }

    if (!formData.correo.trim()) {
      return "El correo electrónico es obligatorio.";
    }

    if (formData.contraseña.length < 6) {
      return "La contraseña debe contener al menos 6 caracteres.";
    }

    if (formData.contraseña !== formData.confirmarContraseña) {
      return "Las contraseñas no coinciden.";
    }

    return "";
  };

  // =========================
  // REGISTRAR
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorValidacion = validarFormulario();

    if (errorValidacion) {
      setTipoMensaje("error");
      setMensaje(errorValidacion);
      return;
    }

    try {
      setLoading(true);
      setMensaje("");
      const response = await fetch("http://localhost:3000/api/v1/auth/inscribirse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: formData.nombre.trim(),
            apellido: formData.apellido.trim(),
            dni: formData.dni,
            fecha_nacimiento: formData.fecha_nacimiento,
            sexo: formData.sexo,
            correo: formData.correo.trim().toLowerCase(),
            contraseña: formData.contraseña,
          }),
        },
      );

      // IMPORTANTE:
      // primero obtenemos data
      const data = await response.json();

      if (!response.ok) {
        setTipoMensaje("error");
        setMensaje(data.message || "Error en el registro");
        return;
      }

      setTipoMensaje("exito");
      setMensaje("Registro exitoso. Ya podés iniciar sesión.");

      // Esperar brevemente y mandar al login

      setTimeout(() => {
        navigate("/auth/ingresar");
      }, 1200);
    } catch (error) {
      console.error("Error:", error);
      setTipoMensaje("error");
      setMensaje("No se pudo completar el registro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        backgroundColor: "#0a0a0a",
      }}
    >
      {/* ========================= */}
      {/* PANEL IZQUIERDO */}
      {/* ========================= */}

      <div
        style={{
          flex: 1,
          display: "none",
          position: "relative",
          overflow: "hidden",
        }}
        className="d-none d-md-block"
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #e8500a 0%, #c94008 40%, #0a0a0a 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            //justifyContent: "center",
            padding: "60px",
            color: "#fff",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(2rem, 3vw, 3rem)",
              fontWeight: "900",
              lineHeight: 1.1,
              marginBottom: "16px",
              letterSpacing: "-1px",
            }}
          >
            El básquet
            <br />
            amateur de
            <br />
            Santiago.
          </h1>

          <p
            style={{
              fontSize: "1rem",

              opacity: 0.75,

              maxWidth: "340px",

              lineHeight: 1.7,
            }}
          >
            Registrate como delegado, creá tu equipo, conformá tu plantel y
            participá de las competencias de USBA.
          </p>

          <div
            style={{
              marginTop: "48px",

              display: "flex",

              gap: "8px",
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: "4px",
                  width: i === 1 ? "40px" : "12px",
                  backgroundColor: i === 1 ? "#fff" : "rgba(255,255,255,0.3)",
                  borderRadius: "2px",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* FORMULARIO */}
      {/* ========================= */}

      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          padding: "48px 40px",
          backgroundColor: "#111",
          overflowY: "auto",
        }}
      >
        {/* CABECERA */}

        <div
          style={{
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              color: "#e8500a",
              fontSize: "11px",
              fontWeight: "800",
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            USBA · Básquet Amateur
          </div>

          <h2
            style={{
              color: "#fff",
              fontWeight: "900",
              fontSize: "1.8rem",
              letterSpacing: "-0.5px",
              margin: 0,
            }}
          >
            Crea tu cuenta
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,0.45)",
              marginTop: "8px",
              marginBottom: 0,
              fontSize: "0.9rem",
            }}
          >
            Estos datos también identificarán al delegado como jugador de sus
            equipos. Asegurate de colocarlos correctamente, luego no podrás cambiarlos.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* NOMBRE / APELLIDO */}

          <div className="row">
            <div className="col-md-6 mb-3">
              <label style={labelStyle}>Nombre</label>

              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label style={labelStyle}>Apellido</label>

              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>
          </div>

          {/* DNI */}

          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <label style={labelStyle}>DNI</label>

            <input
              type="text"
              inputMode="numeric"
              name="dni"
              maxLength="8"
              value={formData.dni}
              onChange={handleChange}
              placeholder="40123456"
              style={inputStyle}
              required
            />
          </div>

          {/* NACIMIENTO / SEXO */}

          <div className="row">
            <div className="col-md-6 mb-3">
              <label style={labelStyle}>Fecha de nacimiento</label>

              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  colorScheme: "dark",
                }}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label style={labelStyle}>Sexo</label>

              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                style={inputStyle}
                required
              >
                <option value="">Seleccionar</option>

                <option value="masculino">Masculino</option>

                <option value="femenino">Femenino</option>
              </select>
            </div>
          </div>

          <hr
            style={{
              borderColor: "rgba(255,255,255,0.1)",

              margin: "12px 0 24px",
            }}
          />

          {/* CORREO */}

          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <label style={labelStyle}>Correo electrónico</label>

            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="tu@correo.com"
              style={inputStyle}
              required
            />
          </div>

          {/* CONTRASEÑA */}

          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <label style={labelStyle}>Contraseña</label>

            <input
              type="password"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              placeholder="••••••••"
              style={inputStyle}
              required
            />

            <small
              style={{
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Mínimo 6 caracteres.
            </small>
          </div>

          {/* CONFIRMAR */}

          <div
            style={{
              marginBottom: "28px",
            }}
          >
            <label style={labelStyle}>Confirmar contraseña</label>

            <input
              type="password"
              name="confirmarContraseña"
              value={formData.confirmarContraseña}
              onChange={handleChange}
              placeholder="••••••••"
              style={inputStyle}
              required
            />
          </div>

          {/* MENSAJE */}

          {mensaje && (
            <div
              style={{
                backgroundColor:
                  tipoMensaje === "exito"
                    ? "rgba(25,135,84,0.15)"
                    : "rgba(220,53,69,0.15)",

                border:
                  tipoMensaje === "exito"
                    ? "1px solid rgba(25,135,84,0.3)"
                    : "1px solid rgba(220,53,69,0.3)",

                color: tipoMensaje === "exito" ? "#75d69c" : "#ff6b7a",
                padding: "12px 16px",
                borderRadius: "4px",
                fontSize: "0.85rem",
                marginBottom: "20px",
              }}
            >
              {mensaje}
            </div>
          )}

          {/* BOTÓN */}

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
            }}
          >
            {loading ? "Registrando..." : "Registrar →"}
          </button>
        </form>

        <p
          style={{
            marginTop: "32px",

            color: "rgba(255,255,255,0.4)",

            fontSize: "0.85rem",

            textAlign: "center",
          }}
        >
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/auth/ingresar"
            style={{
              color: "#e8500a",

              fontWeight: "700",
            }}
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;