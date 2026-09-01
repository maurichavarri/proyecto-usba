import { useState } from "react";
import { Link } from "react-router-dom";

const DashboardDelegado = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const opciones = [
    {
      titulo: "Mis Equipos",
      desc: "Administra la lista de tus equipos registrados y gestiona tus jugadores.",
      link: "/panel/delegado/equipos",
      btnText: "Ver Equipos",
    },
    {
      titulo: "Crear Equipo",
      desc: "Registra un nuevo equipo para inscribirlo en torneos activos.",
      link: "/panel/delegado/equipos/crear",
      btnText: "Nuevo Equipo",
    },
    {
      titulo: "Mis Inscripciones",
      desc: "Consulta el estado de aprobación e inscripciones de tus planteles.",
      link: "/panel/delegado/inscripciones",
      btnText: "Ver Estado",
    },
  ];

  return (
    <div className="main-content">
      {/* Banner / Hero */}
      <section className="dash-hero">
        <div className="container dash-hero-inner">
          <span className="dash-badge">Zona Delegados</span>
          <h1 className="dash-title">Panel del Delegado</h1>
          <p className="dash-subtitle">
            Bienvenido, <strong>{usuario?.correo || "Delegado"}</strong>
          </p>
        </div>
      </section>

      {/* Grid de opciones */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            {opciones.map((item, index) => (
              <div key={index} className="col-12 col-md-4">
                <div className="dash-card">
                  <div>
                    <h2 className="dash-card-title">{item.titulo}</h2>
                    <p className="dash-card-desc">{item.desc}</p>
                  </div>
                  <Link to={item.link} className="dash-btn">
                    <span>{item.btnText}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardDelegado;