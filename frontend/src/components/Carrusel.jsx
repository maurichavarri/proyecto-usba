import React, { useState, useEffect, useCallback } from "react";

const Carrusel = ({ imagenes }) => {
  const [actual, setActual] = useState(0);
  const [animando, setAnimando] = useState(false);

  const cambiar = useCallback((nuevoIndex) => {
    if (animando) return;
    setAnimando(true);
    setTimeout(() => {
      setActual(nuevoIndex);
      setAnimando(false);
    }, 500);
  }, [animando]);

  const anterior = () => cambiar((actual - 1 + imagenes.length) % imagenes.length);
  const siguiente = () => cambiar((actual + 1) % imagenes.length);

  useEffect(() => {
    if (imagenes.length <= 1) return;
    const intervalo = setInterval(() => {
      setActual((prev) => (prev + 1) % imagenes.length);
    }, 6000);
    return () => clearInterval(intervalo);
  }, [imagenes.length]);

  if (!imagenes || imagenes.length === 0) return null;

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "480px",
      maxWidth: "100vw",
      overflow: "hidden",
      borderRadius: "0",
      backgroundColor: "#0a0a0a",
    }}>
      {/* Slides */}
      {imagenes.map((img, index) => (
        <div key={index} style={{
          position: "absolute",
          inset: 0,
          opacity: index === actual ? 1 : 0,
          transition: "opacity 0.7s ease-in-out",
          zIndex: index === actual ? 1 : 0,
        }}>
          {/* Imagen de fondo con zoom */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: index === actual ? "scale(1.04)" : "scale(1)",
            transition: "transform 6s ease-out",
          }} />

          {/* Overlay degradado oscuro */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.05) 100%)",
            zIndex: 1,
          }} />

          {/* Línea naranja decorativa */}
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "5px",
            background: "#e8500a",
            zIndex: 2,
          }} />

          {/* Texto superpuesto */}
          <div style={{
            position: "absolute",
            left: "60px",
            bottom: "80px",
            zIndex: 3,
            color: "#fff",
            maxWidth: "480px",
          }}>
            <div style={{
              display: "inline-block",
              backgroundColor: "#e8500a",
              color: "#fff",
              fontSize: "11px",
              fontWeight: "800",
              letterSpacing: "3px",
              textTransform: "uppercase",
              padding: "4px 12px",
              marginBottom: "14px",
            }}>
              USBA · Básquet Amateur
            </div>
            <h2 style={{
              fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
              fontWeight: "900",
              lineHeight: 1.1,
              margin: "0 0 12px",
              textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              letterSpacing: "-0.5px",
            }}>
              Santiago del Estero<br />juega en serio.
            </h2>
            <p style={{
              fontSize: "0.95rem",
              opacity: 0.85,
              margin: 0,
              fontWeight: "400",
            }}>
              Torneos · Equipos · Pasión
            </p>
          </div>
        </div>
      ))}

      {/* Botones navegación */}
      {imagenes.length > 1 && (
        <>
          <button onClick={anterior} aria-label="Anterior" style={{
            position: "absolute", left: "20px", top: "50%",
            transform: "translateY(-50%)", zIndex: 10,
            width: "46px", height: "46px", borderRadius: "0",
            border: "2px solid rgba(255,255,255,0.4)",
            backgroundColor: "rgba(0,0,0,0.4)",
            color: "#fff", fontSize: "20px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#e8500a"; e.currentTarget.style.borderColor = "#e8500a"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
          >‹</button>

          <button onClick={siguiente} aria-label="Siguiente" style={{
            position: "absolute", right: "20px", top: "50%",
            transform: "translateY(-50%)", zIndex: 10,
            width: "46px", height: "46px", borderRadius: "0",
            border: "2px solid rgba(255,255,255,0.4)",
            backgroundColor: "rgba(0,0,0,0.4)",
            color: "#fff", fontSize: "20px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#e8500a"; e.currentTarget.style.borderColor = "#e8500a"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
          >›</button>

          {/* Indicadores */}
          <div style={{
            position: "absolute", bottom: "24px", left: "60px",
            zIndex: 10, display: "flex", gap: "8px",
          }}>
            {imagenes.map((_, i) => (
              <button key={i} onClick={() => cambiar(i)} aria-label={`Slide ${i + 1}`} style={{
                width: i === actual ? "32px" : "8px",
                height: "4px", borderRadius: "2px", border: "none", padding: 0,
                backgroundColor: i === actual ? "#e8500a" : "rgba(255,255,255,0.4)",
                cursor: "pointer", transition: "all 0.35s ease",
              }} />
            ))}
          </div>

          {/* Contador */}
          <div style={{
            position: "absolute", bottom: "24px", right: "20px",
            zIndex: 10, color: "rgba(255,255,255,0.6)",
            fontSize: "13px", fontWeight: "600", letterSpacing: "1px",
          }}>
            {String(actual + 1).padStart(2, "0")} / {String(imagenes.length).padStart(2, "0")}
          </div>
        </>
      )}
    </div>
  );
};

export default Carrusel;