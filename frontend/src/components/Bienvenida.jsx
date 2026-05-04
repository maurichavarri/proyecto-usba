import React from "react";
import { Link } from "react-router-dom";
import imgBienvenida from "../assets/img/basquetbolista-1.jpg"; // 👈 tu imagen local

const Bienvenida = () => {
  return (
    <section className="container my-5">
      <div className="row align-items-center">
        {/* Columna izquierda: imagen */}
        <div className="col-12 col-md-4">
          <img
            src={imgBienvenida}
            alt="Bienvenida USBA"
            className="img-fluid rounded shadow-sm"
          />
        </div>

        {/* Columna derecha: texto */}
        <div className="col-12 col-md-8">
          <h2 className="mb-3">Bienvenido a la USBA</h2>
          <p className="mb-4">
            La Unión de Santiago del Estero de Básquet Amateur te invita a
            formar parte de nuestros torneos. Sumate a la comunidad y viví la
            pasión del básquet en un ambiente competitivo y amistoso.
          </p>
          <Link to="/inscribirse">
            <button className="btn btn-dark">Inscribirse al torneo</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Bienvenida;