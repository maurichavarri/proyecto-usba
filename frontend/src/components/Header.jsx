import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {

    const [menuAbierto, setMenuAbierto] = useState(false);
    const navigate = useNavigate();

    // Obtener usuario del localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Logout
    const cerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        navigate("/");
        window.location.reload();
    };

    return (
        <header>
            {/* Top bar */}
            <div className="text-white text-center py-1 small" style={{ backgroundColor: "#f56f02" }}>
                Santiago del Estero
            </div>

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom px-3">
                <div className="container-fluid">
                    {/* Logo */}
                    <Link className="navbar-brand d-flex align-items-center text-white" to="/" onClick={() => setMenuAbierto(false)}>
                        <span className="fs-4 me-2">🏀</span>
                        <div className="d-flex flex-column lh-sm">
                            <strong>U.S.B.A</strong>
                            <small className="text-white-50">
                                Básquet Amateur
                            </small>
                        </div>
                    </Link>

                    {/* Botón hamburguesa */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        aria-controls="navbarNav"
                        aria-expanded={menuAbierto}
                        aria-label="Toggle navigation"
                        onClick={() => setMenuAbierto(!menuAbierto)}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Navbar */}
                    <div id="navbarNav" className={`collapse navbar-collapse ${menuAbierto ? "show" : ""}`}>
                        {/* Links */}
                        <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/" onClick={() => setMenuAbierto(false)}>
                                    Inicio
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/torneos" onClick={() => setMenuAbierto(false)}>
                                    Torneos
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/categorias" onClick={() => setMenuAbierto(false)}>
                                    Categorías
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link
                                    className="nav-link text-white"
                                    to="/anuncios"
                                    onClick={() => setMenuAbierto(false)}
                                >
                                    Anuncios
                                </Link>
                            </li>

                        </ul>

                        {/* DERECHA */}
                        <div className="d-flex gap-2 align-items-center">
                            {
                                usuario ? (
                                    <>
                                        {/* Usuario */}
                                        <span className="text-white small">
                                            {usuario.correo}
                                        </span>

                                        {/* Panel */}
                                        <Link to="/panel" onClick={() => setMenuAbierto(false)}>
                                            <button className="btn btn-light">
                                                Panel
                                            </button>
                                        </Link>

                                        {/* Logout */}
                                        <button className="btn btn-outline-light" onClick={cerrarSesion}>
                                            Salir
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/auth/ingresar" onClick={() => setMenuAbierto(false)}>
                                            <button className="btn btn-outline-light">
                                                Ingresar
                                            </button>
                                        </Link>
                                        <Link to="/auth/inscribirse" onClick={() => setMenuAbierto(false)}>
                                            <button className="btn btn-light">
                                                Inscribirse
                                            </button>
                                        </Link>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;