import React from "react";

const Card = ({ titulo, imagen, descripcion }) => {

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="card shadow-sm h-100">
      {imagen && (
        <img
          src={imagen}
          className="card-img-top"
          alt={titulo}
          style={{ objectFit: "cover", height: "100px" }}
        />
      )}
      <div className="card-body">
        <h5 className="card-title">{titulo}</h5>
        <p className="card-text">{truncateText(descripcion, 100)}</p>
        {/*<button className="btn btn-dark w-100">Ver más</button>*/}
      </div>
    </div>
  );
};

export default Card;