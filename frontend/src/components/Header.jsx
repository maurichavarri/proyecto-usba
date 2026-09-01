import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoUsba from "../assets/img/USBA.png";


const colores = {
    fondo: "#0a0a0a",
    superficie: "#111111",
    borde: "rgba(255,255,255,0.08)",
    naranja: "#e8500a",
    naranjaOscuro: "#c94008",
    texto: "#ffffff",
    textoSecundario: "rgba(255,255,255,0.55)"
};


const Header = () => {

    const [menuAbierto, setMenuAbierto] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );


    const cerrarSesion = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        navigate("/");

        window.location.reload();
    };


    const cerrarMenu = () => {
        setMenuAbierto(false);
    };


    const esRutaActiva = (ruta) => {

        if (ruta === "/") {
            return location.pathname === "/";
        }

        return location.pathname.startsWith(ruta);
    };


    const estiloLink = (ruta) => ({

        color:
            esRutaActiva(ruta)
                ? colores.naranja
                : "rgba(255,255,255,0.72)",

        textDecoration: "none",

        fontSize: "0.82rem",

        fontWeight: "800",

        letterSpacing: "1px",

        textTransform: "uppercase",

        transition: "color 0.2s",

        padding: "10px 12px",

        position: "relative"

    });


    return (

        <header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 1000
            }}
        >


            {/* ================================ */}
            {/* TOP BAR */}
            {/* ================================ */}

            <div
                style={{
                    backgroundColor: colores.naranja,
                    color: "#fff",
                    textAlign: "center",
                    padding: "5px 10px",
                    fontSize: "10px",
                    fontWeight: "800",
                    letterSpacing: "2.5px",
                    textTransform: "uppercase"
                }}
            >
                Santiago del Estero · Básquet Amateur
            </div>


            {/* ================================ */}
            {/* NAVBAR */}
            {/* ================================ */}

            <nav
                className="navbar navbar-expand-lg"
                style={{
                    backgroundColor: "rgba(10,10,10,0.97)",
                    borderBottom:
                        `1px solid ${colores.borde}`,
                    backdropFilter: "blur(10px)",
                    padding: "12px 0"
                }}
            >

                <div className="container">


                    {/* ======================== */}
                    {/* LOGO */}
                    {/* ======================== */}

                    <Link
                        to="/"
                        onClick={cerrarMenu}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            textDecoration: "none"
                        }}
                    >
                        <div
                            style={{
                                width: "72px",
                                height: "72px",
                                borderRadius: "50%",
                                overflow: "hidden",
                                flexShrink: 0
                            }}
                        >
                            <img
                                src={logoUsba}
                                alt="Logo USBA"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover"
                                }}
                            />
                        </div>
                    </Link>


                    {/* ======================== */}
                    {/* HAMBURGUESA */}
                    {/* ======================== */}

                    <button
                        className="navbar-toggler"
                        type="button"
                        aria-controls="navbarNav"
                        aria-expanded={menuAbierto}
                        aria-label="Abrir navegación"
                        onClick={() =>
                            setMenuAbierto(
                                !menuAbierto
                            )
                        }
                        style={{
                            border:
                                `1px solid ${colores.borde}`,
                            boxShadow: "none"
                        }}
                    >

                        <span
                            className="navbar-toggler-icon"
                            style={{
                                filter: "invert(1)"
                            }}
                        />

                    </button>


                    {/* ======================== */}
                    {/* CONTENIDO NAV */}
                    {/* ======================== */}

                    <div
                        id="navbarNav"
                        className={
                            `collapse navbar-collapse ${menuAbierto
                                ? "show"
                                : ""
                            }`
                        }
                    >


                        {/* ==================== */}
                        {/* LINKS CENTRALES */}
                        {/* ==================== */}

                        <ul
                            className="navbar-nav mx-auto mb-3 mb-lg-0 mt-3 mt-lg-0"
                            style={{
                                gap: "4px"
                            }}
                        >

                            <li className="nav-item">

                                <Link
                                    to="/"
                                    onClick={cerrarMenu}
                                    style={estiloLink("/")}
                                    onMouseEnter={(e) =>
                                        e.currentTarget
                                            .style
                                            .color =
                                        colores.naranja
                                    }
                                    onMouseLeave={(e) =>
                                        e.currentTarget
                                            .style
                                            .color =
                                        esRutaActiva("/")
                                            ? colores.naranja
                                            : "rgba(255,255,255,0.72)"
                                    }
                                >
                                    Inicio
                                </Link>

                            </li>


                            <li className="nav-item">

                                <Link
                                    to="/torneos"
                                    onClick={cerrarMenu}
                                    style={
                                        estiloLink(
                                            "/torneos"
                                        )
                                    }
                                    onMouseEnter={(e) =>
                                        e.currentTarget
                                            .style
                                            .color =
                                        colores.naranja
                                    }
                                    onMouseLeave={(e) =>
                                        e.currentTarget
                                            .style
                                            .color =
                                        esRutaActiva(
                                            "/torneos"
                                        )
                                            ? colores.naranja
                                            : "rgba(255,255,255,0.72)"
                                    }
                                >
                                    Torneos
                                </Link>

                            </li>


                            <li className="nav-item">

                                <Link
                                    to="/categorias"
                                    onClick={cerrarMenu}
                                    style={
                                        estiloLink(
                                            "/categorias"
                                        )
                                    }
                                    onMouseEnter={(e) =>
                                        e.currentTarget
                                            .style
                                            .color =
                                        colores.naranja
                                    }
                                    onMouseLeave={(e) =>
                                        e.currentTarget
                                            .style
                                            .color =
                                        esRutaActiva(
                                            "/categorias"
                                        )
                                            ? colores.naranja
                                            : "rgba(255,255,255,0.72)"
                                    }
                                >
                                    Categorías
                                </Link>

                            </li>


                            <li className="nav-item">

                                <Link
                                    to="/anuncios"
                                    onClick={cerrarMenu}
                                    style={
                                        estiloLink(
                                            "/anuncios"
                                        )
                                    }
                                    onMouseEnter={(e) =>
                                        e.currentTarget
                                            .style
                                            .color =
                                        colores.naranja
                                    }
                                    onMouseLeave={(e) =>
                                        e.currentTarget
                                            .style
                                            .color =
                                        esRutaActiva(
                                            "/anuncios"
                                        )
                                            ? colores.naranja
                                            : "rgba(255,255,255,0.72)"
                                    }
                                >
                                    Anuncios
                                </Link>

                            </li>

                        </ul>


                        {/* ==================== */}
                        {/* LADO DERECHO */}
                        {/* ==================== */}

                        <div
                            className="d-flex flex-column flex-lg-row gap-2 align-items-lg-center"
                        >

                            {
                                usuario ? (

                                    <>

                                        {/* USUARIO */}

                                        <div
                                            className="text-lg-end me-lg-2"
                                            style={{
                                                lineHeight: 1.2
                                            }}
                                        >

                                            <div
                                                style={{
                                                    color:
                                                        colores.textoSecundario,
                                                    fontSize:
                                                        "0.65rem",
                                                    textTransform:
                                                        "uppercase",
                                                    letterSpacing:
                                                        "1.5px",
                                                    fontWeight:
                                                        "800"
                                                }}
                                            >
                                                Sesión activa
                                            </div>

                                            <div
                                                style={{
                                                    color:
                                                        "#fff",
                                                    fontSize:
                                                        "0.8rem",
                                                    fontWeight:
                                                        "700",
                                                    marginTop:
                                                        "3px"
                                                }}
                                            >
                                                {
                                                    usuario.correo
                                                }
                                            </div>

                                        </div>


                                        {/* PANEL */}

                                        <Link
                                            to={
                                                `/panel/${usuario.rol}`
                                            }
                                            onClick={cerrarMenu}
                                            style={{
                                                textDecoration:
                                                    "none"
                                            }}
                                        >

                                            <button
                                                type="button"
                                                style={{
                                                    backgroundColor:
                                                        colores.naranja,
                                                    color:
                                                        "#fff",
                                                    border:
                                                        "none",
                                                    padding:
                                                        "10px 16px",
                                                    borderRadius:
                                                        "3px",
                                                    fontSize:
                                                        "0.75rem",
                                                    fontWeight:
                                                        "900",
                                                    letterSpacing:
                                                        "1px",
                                                    textTransform:
                                                        "uppercase",
                                                    whiteSpace:
                                                        "nowrap"
                                                }}
                                                onMouseEnter={(e) =>
                                                    e.currentTarget
                                                        .style
                                                        .backgroundColor =
                                                    colores.naranjaOscuro
                                                }
                                                onMouseLeave={(e) =>
                                                    e.currentTarget
                                                        .style
                                                        .backgroundColor =
                                                    colores.naranja
                                                }
                                            >
                                                Mi panel
                                            </button>

                                        </Link>


                                        {/* SALIR */}

                                        <button
                                            type="button"
                                            onClick={
                                                cerrarSesion
                                            }
                                            style={{
                                                backgroundColor:
                                                    "transparent",
                                                color:
                                                    "rgba(255,255,255,0.72)",
                                                border:
                                                    `1px solid ${colores.borde}`,
                                                padding:
                                                    "10px 15px",
                                                borderRadius:
                                                    "3px",
                                                fontSize:
                                                    "0.75rem",
                                                fontWeight:
                                                    "800",
                                                letterSpacing:
                                                    "1px",
                                                textTransform:
                                                    "uppercase"
                                            }}
                                        >
                                            Salir
                                        </button>

                                    </>

                                ) : (

                                    <>

                                        {/* INGRESAR */}

                                        <Link
                                            to="/auth/ingresar"
                                            onClick={cerrarMenu}
                                            style={{
                                                textDecoration:
                                                    "none"
                                            }}
                                        >

                                            <button
                                                type="button"
                                                style={{
                                                    width:
                                                        "100%",
                                                    backgroundColor:
                                                        "transparent",
                                                    color:
                                                        "#fff",
                                                    border:
                                                        `1px solid ${colores.borde}`,
                                                    padding:
                                                        "10px 16px",
                                                    borderRadius:
                                                        "3px",
                                                    fontSize:
                                                        "0.75rem",
                                                    fontWeight:
                                                        "800",
                                                    letterSpacing:
                                                        "1px",
                                                    textTransform:
                                                        "uppercase"
                                                }}
                                            >
                                                Ingresar
                                            </button>

                                        </Link>


                                        {/* REGISTRO */}

                                        <Link
                                            to="/auth/inscribirse"
                                            onClick={cerrarMenu}
                                            style={{
                                                textDecoration:
                                                    "none"
                                            }}
                                        >

                                            <button
                                                type="button"
                                                style={{
                                                    width:
                                                        "100%",
                                                    backgroundColor:
                                                        colores.naranja,
                                                    color:
                                                        "#fff",
                                                    border:
                                                        "none",
                                                    padding:
                                                        "10px 16px",
                                                    borderRadius:
                                                        "3px",
                                                    fontSize:
                                                        "0.75rem",
                                                    fontWeight:
                                                        "900",
                                                    letterSpacing:
                                                        "1px",
                                                    textTransform:
                                                        "uppercase"
                                                }}
                                                onMouseEnter={(e) =>
                                                    e.currentTarget
                                                        .style
                                                        .backgroundColor =
                                                    colores.naranjaOscuro
                                                }
                                                onMouseLeave={(e) =>
                                                    e.currentTarget
                                                        .style
                                                        .backgroundColor =
                                                    colores.naranja
                                                }
                                            >
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