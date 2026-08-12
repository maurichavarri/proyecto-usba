import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const MisEquipos = () => {

    const navigate = useNavigate();
    const [showHelp, setShowHelp] = useState(false);
    const [equipos, setEquipos] = useState([]);

    useEffect(() => {
        obtenerEquipos();
    }, []);

    const obtenerEquipos = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/v1/delegado/equipos",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            setEquipos(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-5 mb-5">

            {/* Titulo */}
            <div className="d-flex align-items-center mb-1">
                <h2 className="me-2">
                    Mis Equipos
                </h2>
                <span style={{ cursor: "pointer", fontSize: "1.2rem" }} className="text-primary" onClick={() => setShowHelp(true)}>
                    ❓
                </span>
            </div>

            {/* Breadcrumb */}
            <nav className="mb-3" style={{ fontSize: "0.9rem" }}>
                <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/panel/delegado")}>
                    Delegado Dashboard
                </span>
                {" > "}
                <span className="text-muted">
                    Mis Equipos
                </span>
            </nav>

            {/* Botones */}
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-dark" onClick={() => navigate(-1)}>
                    Volver
                </button>
            </div>

            {equipos.length === 0 ? (<p>No tienes equipos creados.</p>) : (
                <div className="row">
                    {
                        equipos.map((equipo) => (
                            <div key={equipo.id} className="col-md-4 mb-3">
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {equipo.nombre}
                                        </h5>
                                        <p className="card-text">
                                            {equipo.descripcion}
                                        </p>
                                        <Link
                                            to={`/panel/delegado/equipos/${equipo.id}/jugadores`}
                                            className="btn btn-dark"
                                        >
                                            Ver jugadores
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            )
            }

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
    );
};

export default MisEquipos;