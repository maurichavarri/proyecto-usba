import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MisEquipos = () => {

    const [equipos, setEquipos] = useState([]);

    useEffect(() => {
        obtenerEquipos();
    }, []);

    const obtenerEquipos = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                "http://localhost:3000/api/v1/delegado/equipos",
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
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h2>Mis Equipos</h2>
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
        </div>
    );
};

export default MisEquipos;