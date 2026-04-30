import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
        <header>
            {/* Top bar */}
            <div className="text-white text-center py-1 small" style={{ backgroundColor: "#f56f02"}}>
                Santiago del Estero
            </div>

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-3">
                <div className="container-fluid">

                    {/* Logo */}
                    <Link className="navbar-brand d-flex align-items-center" to="/">
                        <span className="fs-4 me-2">🏀</span>
                        <div className="d-flex flex-column lh-sm">
                            <strong>U.S.B.A</strong>
                            <small className="text-muted">Básquet Amateur</small>
                        </div>
                    </Link>

                    {/* Botón hamburguesa */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={() => setMenuAbierto(!menuAbierto)}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Contenido colapsable */}
                    <div className={`collapse navbar-collapse ${menuAbierto ? "show" : ""}`}>

                        {/* Links */}
                        <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Inicio</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/torneos">Torneos</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/categorias">Categorías</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/anuncios">Anuncios</Link>
                            </li>
                            {/*<li className="nav-item">
                                <Link className="nav-link" to="/contactos">Contactos</Link>
                            </li>*/}
                        </ul>

                        {/* Botones */}
                        <div className="d-flex gap-2">
                            <Link to="/ingresar">
                                <button className="btn btn-outline-dark">Ingresar</button>
                            </Link>
                            <Link to="/inscribirse">
                                <button className="btn btn-dark">Inscribirse</button>
                            </Link>
                        </div>

                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;