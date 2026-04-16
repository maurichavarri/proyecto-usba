const Home = () => {
  return (
    <div className="container mt-4">

      {/* 🟢 Torneos destacados */}
      <section className="mb-5">
        <h2 className="mb-3">Torneos</h2>

        <div className="row g-3">
          {[1, 2, 3].map((torneo) => (
            <div className="col-md-4" key={torneo}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Torneo Apertura {torneo}</h5>
                  <p className="card-text">
                    Categorías: +18 / +30 / Femenino
                  </p>
                  <button className="btn btn-dark w-100">
                    Ver torneo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🔵 Últimos resultados */}
      <section className="mb-5">
        <h2 className="mb-3">Últimos resultados</h2>

        <div className="card shadow-sm">
          <div className="card-body">
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between">
                <span>Equipo A vs Equipo B</span>
                <strong>72 - 65</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Equipo C vs Equipo D</span>
                <strong>80 - 78</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Equipo E vs Equipo F</span>
                <strong>60 - 55</strong>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 🔴 Anuncios */}
      <section className="mb-5">
        <h2 className="mb-3">Últimos anuncios</h2>

        <div className="row g-3">
          {[1, 2].map((anuncio) => (
            <div className="col-md-6" key={anuncio}>
              <div className="card border-start border-4 border-dark shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    Nuevo torneo disponible
                  </h5>
                  <p className="card-text">
                    Inscripciones abiertas para el próximo torneo.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;