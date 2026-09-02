import { useState } from "react";
import { Link } from "react-router-dom";

const DashboardDelegado = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
<<<<<<< HEAD

<<<<<<< HEAD
    const [showHelp, setShowHelp] = useState(false);
=======
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0

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

<<<<<<< HEAD
    return (
        <div className="container mt-5 mb-5">
            <div className="col-lg-10 mx-auto">
                {/* Titulo */}
                <div className="d-flex align-items-center mb-1">
                    <h2 className="me-2">Delegado Dashboard</h2>
                    <span style={{ cursor: "pointer", fontSize: "1.2rem" }} className="text-primary" onClick={() => setShowHelp(true)}>
                        ❓
                    </span>
                </div>

                {/* Bienvenida */}
                <div className="mb-3">
                    <p className="text-muted">Bienvenido {usuario?.correo}</p>
                </div>

                {/* Cards */}
                <div className="row g-4">

                    {/* Mis equipos */}
                    <div className="col-md-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5 className="card-title">Mis Equipos</h5>
                                <p className="card-text">Administra tus equipos y jugadores.</p>
                                <Link to="/panel/delegado/equipos" className="btn btn-dark">Ver equipos</Link>
                            </div>
                        </div>
                    </div>

                    {/* Inscripciones */}
                    <div className="col-md-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5 className="card-title">
                                    Mis Inscripciones
                                </h5>
                                <p className="card-text">
                                    Consulta tus inscripciones.
                                </p>
                                <Link
                                    to="/panel/delegado/inscripciones"
                                    className="btn btn-dark"
                                >
                                    Ver
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Ayuda */}
                {
                    showHelp && (
                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor: "rgba(0,0,0,0.5)",
                                zIndex: 1050
                            }}
                        >
                            <div className="bg-white p-4 rounded shadow" style={{ maxWidth: "550px" }}>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5>¿Cómo funciona este apartado?</h5>
                                    <button className="btn-close" onClick={() => setShowHelp(false)} />
                                </div>
                                <p>
                                    Desde esta sección podés
                                    administrar toda la información referente al delegado:
                                    Equipos, Jugadores e Inscripciones.
                                    <br /><br />
                                    Reglas de USBA:
                                    <ul>
                                        <li>Podés crear la cantidad de equipos que desees.</li>
                                        <li>Podés registrar desde <b>5</b> a <b>12</b> jugadores por <b>EQUIPO</b>.</li>
                                        <li>Dos equipos o más, que estén bajo tu mando, pueden participar en la misma competencia siempre y cuando <b>no haya jugadores repetidos</b>.</li>
                                        <li>Un <b>EQUIPO</b> puede inscribirse en muchas competencias.</li>
                                        <li>Si en un <b>EQUIPO</b> hubo recambio de <b>JUGADORES</b>, ya compitieron alguna vez y quieren hacerlo nuevamente, deberás crear un equipo <b>nuevo</b> (con el mismo nombre o diferente) y asignar nuevamente los jugadores.</li>
                                    </ul>
                                </p>
                            </div>
                        </div>
                    )
                }
            </div>
=======
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

=======
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
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
<<<<<<< HEAD
>>>>>>> 63c6e1b (cambios de administrador y delegados)
=======
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
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