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
    }, 400);
  }, [animando]);

  const anterior = () => {
    const nuevoIndex = (actual - 1 + imagenes.length) % imagenes.length;
    cambiar(nuevoIndex);
  };

  const siguiente = () => {
    const nuevoIndex = (actual + 1) % imagenes.length;
    cambiar(nuevoIndex);
  };

  // Auto-play cada 5 segundos
  useEffect(() => {
    if (imagenes.length <= 1) return;
    const intervalo = setInterval(() => {
      setActual((prev) => (prev + 1) % imagenes.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, [imagenes.length]);

  if (!imagenes || imagenes.length === 0) return null;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "400px",
        overflow: "hidden",
        borderRadius: "12px",
        backgroundColor: "#000",
      }}
    >
      {/* Slides */}
      {imagenes.map((img, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            inset: 0,
            opacity: index === actual ? 1 : 0,
            transition: "opacity 0.6s ease-in-out",
            zIndex: index === actual ? 1 : 0,
          }}
        >
          {/* Fondo difuminado */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(18px) brightness(0.6)",
              transform: "scale(1.05)",
            }}
          />
          {/* Imagen principal */}
          <img
            src={img}
            alt={`Slide ${index + 1}`}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              zIndex: 1,
            }}
          />
        </div>
      ))}

      {/* Botón anterior */}
      {imagenes.length > 1 && (
        <>
          <button
            onClick={anterior}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "rgba(0,0,0,0.55)",
              color: "#fff",
              fontSize: "22px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.85)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.55)"}
            aria-label="Anterior"
          >
            ‹
          </button>

          {/* Botón siguiente */}
          <button
            onClick={siguiente}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "rgba(0,0,0,0.55)",
              color: "#fff",
              fontSize: "22px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.85)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.55)"}
            aria-label="Siguiente"
          >
            ›
          </button>

          {/* Indicadores (puntos) */}
          <div
            style={{
              position: "absolute",
              bottom: "14px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              display: "flex",
              gap: "8px",
            }}
          >
            {imagenes.map((_, index) => (
              <button
                key={index}
                onClick={() => cambiar(index)}
                style={{
                  width: index === actual ? "24px" : "10px",
                  height: "10px",
                  borderRadius: "999px",
                  border: "none",
                  backgroundColor: index === actual ? "#fff" : "rgba(255,255,255,0.45)",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.3s ease",
                }}
                aria-label={`Ir a slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carrusel;