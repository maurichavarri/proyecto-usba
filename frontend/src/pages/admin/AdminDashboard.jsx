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
};

export default DashboardAdmin;