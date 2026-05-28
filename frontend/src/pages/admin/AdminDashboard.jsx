import { Link } from "react-router-dom";

const DashboardAdmin = () => {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    return (
        <div className="container mt-5 mb-5">
            <div className="mb-4">
                <h2>
                    Panel Administrador
                </h2>
                <p className="text-muted">
                    Bienvenido {usuario?.correo}
                </p>
            </div>

            <div className="row g-4">

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
                                Ver
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
                                Crear y Administrar categorías.
                            </p>
                            <Link
                                to="/panel/admin/categorias"
                                className="btn btn-dark"
                            >
                                Ver
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Torneo-Categorías */}
                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5>Torneo-Categorías</h5>
                            <p>
                                Asignar Categorías a Torneos.
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
                                Anuncios
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
    );
};

export default DashboardAdmin;