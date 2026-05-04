import React from "react";

const Carrusel = ({ imagenes }) => {
  return (
    <div id="carouselExample" className="carousel slide">
      <div className="carousel-inner">
        {imagenes.map((img, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            {/* Contenedor con fondo difuminado */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "400px",
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(20px)",
              }}
            ></div>

            {/* Imagen principal encima */}
            <img
              src={img}
              alt={`Slide ${index}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "400px",
                objectFit: "contain", // 👈 muestra la imagen completa
                zIndex: 1,
              }}
            />
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  );
};

export default Carrusel;