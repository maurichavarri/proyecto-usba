import React from "react";
import { Link } from "react-router-dom";
import imgBienvenida from "../assets/img/basquetbolista-1.jpg";

const Bienvenida = () => {
  return (
    <section className="container my-5">
      <div className="row align-items-center">
        <div className="col-12 col-md-4">
          <img
            src={imgBienvenida}
            alt="Bienvenida USBA"
            className="img-fluid bienvenida-img"
          />
        </div>
        <div className="col-12 col-md-8">
          <h2 className="mb-3">Bienvenido a la USBA</h2>
          <p className="mb-4">
            La Unión de Santiago del Estero de Básquet Amateur te invita a
            formar parte de nuestros torneos. Sumate a la comunidad y viví la
            pasión del básquet en un ambiente competitivo y amistoso.
          </p>
          {/* 👇 Este botón redirige a /register */}
          <Link to="/auth/inscribirse" className="btn btn-dark">
            Inscribirse al torneo
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Bienvenida;