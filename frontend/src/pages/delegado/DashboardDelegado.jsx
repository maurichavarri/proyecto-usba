import { Link } from "react-router-dom";

const DashboardDelegado = () => {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    return (
        <div className="container mt-5 mb-5">

            {/* Bienvenida */}
            <div className="mb-4">
                <h2>Panel del Delegado</h2>
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

                {/* Crear equipo */}
                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Crear Equipo</h5>
                            <p className="card-text">Registra un nuevo equipo.</p>
                            <Link to="/panel/delegado/equipos/crear" className="btn btn-dark">Crear</Link>
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
        </div>
    );
};

export default DashboardDelegado;