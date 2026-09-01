import { Link } from "react-router-dom";

const DashboardAdmin = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const opciones = [
    { titulo: "Bienvenida", desc: "Editar texto e imagen de la sección de bienvenida.", link: "/panel/admin/bienvenida" },
    { titulo: "Carrusel", desc: "Administrar imágenes del carrusel de inicio.", link: "/panel/admin/carrusel" },
    { titulo: "Torneos", desc: "Crear y administrar torneos.", link: "/panel/admin/torneos" },
    { titulo: "Categorías", desc: "Crear y administrar categorías.", link: "/panel/admin/categorias" },
    { titulo: "Fixtures", desc: "Asignar categorías a torneos y administrar fixtures.", link: "/panel/admin/torneo-categorias" },
    { titulo: "Anuncios", desc: "Crear y administrar anuncios informativos.", link: "/panel/admin/anuncios" },
    { titulo: "Sedes", desc: "Crear y administrar sedes y canchas.", link: "/panel/admin/sedes" },
    { titulo: "Árbitros", desc: "Registrar y administrar cuerpo arbitral.", link: "/panel/admin/arbitros" },
    { titulo: "Inscripciones", desc: "Aprobar o rechazar solicitudes de equipos.", link: "/panel/admin/inscripciones" },
  ];

<<<<<<< HEAD
    return (
        <div className="container mt-5 mb-5">
            <div className="col-lg-10 mx-auto">
                <div className="mb-4">
                    <h2>
                        Administrador Dashboard
                    </h2>
                    <p className="text-muted">
                        Bienvenido {usuario?.correo}
                    </p>
                </div>

                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5>Bienvenida</h5>
                                <p>Editar texto e imagen de la sección de bienvenida.</p>
                                <Link to="/panel/admin/bienvenida" className="btn btn-dark">Gestionar</Link>
                            </div>
                        </div>
                    </div>
                    {/* Carrusel */}
                    <div className="col-md-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5>Carrusel</h5>
                                <p>
                                    Administrar imágenes del carrusel de inicio.
                                </p>
                                <Link
                                    to="/panel/admin/carrusel"
                                    className="btn btn-dark"
                                >
                                    Gestionar
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Torneos */}
                    <div className="col-md-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5>Torneos</h5>
                                <p>
                                    Crear y administrar torneos.
                                </p>
                                <Link
                                    to="/panel/admin/torneos"
                                    className="btn btn-dark"
                                >
                                    Gestionar
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Categorías */}
                    <div className="col-md-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5>Categorías</h5>
                                <p>
                                    Crear y administrar categorías.
                                </p>
                                <Link
                                    to="/panel/admin/categorias"
                                    className="btn btn-dark"
                                >
                                    Gestionar
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Torneo-Categorías */}
                    <div className="col-md-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5>Torneo-Categorías / Fixtures</h5>
                                <p>
                                    Asignar categorías a torneos. Administración de fixture.
                                </p>
                                <Link
                                    to="/panel/admin/torneo-categorias"
                                    className="btn btn-dark"
                                >
                                    Gestionar
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Anuncios */}
                    <div className="col-md-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5>Anuncios</h5>
                                <p>
                                    Crear y administrar anuncios.
                                </p>
                                <Link
                                    to="/panel/admin/anuncios"
                                    className="btn btn-dark"
                                >
                                    Gestionar
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Sedes */}
                    <div className="col-md-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5>Sedes</h5>
                                <p>
                                    Crear y administrar sedes.
                                </p>
                                <Link
                                    to="/panel/admin/sedes"
                                    className="btn btn-dark"
                                >
                                    Gestionar
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Arbitros */}
                    <div className="col-md-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5>Arbitros</h5>
                                <p>
                                    Registrar y administrar arbitros.
                                </p>
                                <Link
                                    to="/panel/admin/arbitros"
                                    className="btn btn-dark"
                                >
                                    Gestionar
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Inscripciones */}
                    <div className="col-md-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5>Inscripciones</h5>
                                <p>
                                    Aprobar o rechazar equipos.
                                </p>
                                <Link
                                    to="/panel/admin/inscripciones"
                                    className="btn btn-dark"
                                >
                                    Gestionar
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
=======
  return (
    <div className="main-content">
      {/* Banner / Hero */}
      <section className="dash-hero">
        <div className="container dash-hero-inner">
          <span className="dash-badge">Modo Administrador</span>
          <h1 className="dash-title">Panel de Control</h1>
          <p className="dash-subtitle">
            Bienvenido, <strong>{usuario?.correo || "Administrador"}</strong>
          </p>
        </div>
      </section>

      {/* Grid de opciones */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            {opciones.map((item, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-4">
                <div className="dash-card">
                  <div>
                    <h2 className="dash-card-title">{item.titulo}</h2>
                    <p className="dash-card-desc">{item.desc}</p>
                  </div>
                  <Link to={item.link} className="dash-btn">
                    <span>Gestionar</span>
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
>>>>>>> 63c6e1b (cambios de administrador y delegados)
};

export default DashboardAdmin;