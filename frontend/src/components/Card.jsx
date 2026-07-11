import React from "react";

const Card = ({ titulo, imagen, descripcion }) => {

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div style={{
      borderRadius: "10px",
      overflow: "hidden",
      backgroundColor: "#fff",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      cursor: "pointer",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.14)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
      }}
    >
      {/* Imagen */}
      {imagen ? (
        <div style={{ position: "relative", overflow: "hidden", height: "160px" }}>
          <img
            src={imagen}
            alt={titulo}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          />
          {/* Línea naranja inferior */}
          <div style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: "3px",
            background: "#e8500a",
          }} />
        </div>
      ) : (
        <div style={{
          height: "160px",
          backgroundColor: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.5rem",
          position: "relative",
        }}>
          🏀
          <div style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: "3px",
            background: "#e8500a",
          }} />
        </div>
      )}

      {/* Contenido */}
      <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h6 style={{
          fontWeight: "800",
          fontSize: "0.9rem",
          color: "#111",
          margin: "0 0 6px",
          lineHeight: 1.3,
          letterSpacing: "-0.2px",
        }}>
          {titulo}
        </h6>
        <p style={{
          fontSize: "0.8rem",
          color: "#666",
          margin: 0,
          lineHeight: 1.5,
          flex: 1,
        }}>
          {truncateText(descripcion, 90)}
        </p>
      </div>
    </div>
  );
};

export default Card;