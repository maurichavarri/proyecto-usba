import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DEFAULTS = {
  titulo: "Bienvenido a la USBA",
  texto: "La Unión de Santiago del Estero de Básquet Amateur te invita a formar parte de nuestros torneos. Sumate a la comunidad y viví la pasión del básquet en un ambiente competitivo y amistoso.",
  imagen: null,
};

const Bienvenida = () => {
  const [contenido, setContenido] = useState(DEFAULTS);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/bienvenida");
        if (res.ok) {
          const data = await res.json();
          setContenido({
            titulo: data.titulo || DEFAULTS.titulo,
            texto: data.texto || DEFAULTS.texto,
            imagen: data.imagen || null,
          });
        }
      } catch {
        // usa defaults si falla
      }
    };
    cargar();
  }, []);

  return (
    <section style={{
      backgroundColor: "#0f0f0f",
  color: "#fff",
  padding: "60px 0",
  width: "100vw",
  marginLeft: "calc(-50vw + 50%)",
    }}>
      <div className="container">
        <div className="row align-items-center g-5">

          {/* Imagen */}
          <div className="col-12 col-md-5">
            <div style={{ position: "relative" }}>
              {contenido.imagen ? (
                <img
                  src={`http://localhost:3000${contenido.imagen}`}
                  alt="Bienvenida USBA"
                  style={{
                    width: "100%",
                    height: "340px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              ) : (
                <div style={{
                  width: "100%",
                  height: "340px",
                  backgroundColor: "#1a1a1a",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "5rem",
                }}>
                  🏀
                </div>
              )}
              {/* Acento naranja */}
              <div style={{
                position: "absolute",
                top: "12px", left: "12px",
                width: "60px", height: "60px",
                border: "4px solid #e8500a",
                borderRadius: "2px",
                zIndex: 0,
              }} />
              <div style={{
                position: "absolute",
                bottom: "12px", right: "12px",
                width: "60px", height: "60px",
                border: "4px solid #e8500a",
                borderRadius: "2px",
                zIndex: 0,
              }} />
            </div>
          </div>

          {/* Texto */}
          <div className="col-12 col-md-7">
            <div style={{
              display: "inline-block",
              backgroundColor: "#e8500a",
              color: "#fff",
              fontSize: "11px",
              fontWeight: "800",
              letterSpacing: "3px",
              textTransform: "uppercase",
              padding: "4px 12px",
              marginBottom: "20px",
            }}>
              Sobre nosotros
            </div>
            <h2 style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontWeight: "900",
              lineHeight: 1.1,
              marginBottom: "20px",
              letterSpacing: "-0.5px",
            }}>
              {contenido.titulo}
            </h2>
            <p style={{
              fontSize: "1rem",
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.75)",
              marginBottom: "32px",
              maxWidth: "480px",
            }}>
              {contenido.texto}
            </p>
            <Link to="/auth/inscribirse" style={{
              display: "inline-block",
              backgroundColor: "#e8500a",
              color: "#fff",
              padding: "13px 32px",
              fontWeight: "800",
              fontSize: "0.9rem",
              letterSpacing: "1px",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "0",
              transition: "background-color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#c94008"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#e8500a"}
            >
              Inscribirse al torneo →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bienvenida;