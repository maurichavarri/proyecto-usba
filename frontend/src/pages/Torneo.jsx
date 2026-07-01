import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import Card from "../components/Card";
import img from "../assets/img/pelota-basquet.jpeg"

const Torneo = () => {
    const { data } = useFetch("http://localhost:3000/api/v1/torneos");

    const [torneoExpandido, setTorneoExpandido] = useState(null);

    const toggleTorneo = (id) => {
        setTorneoExpandido(
            torneoExpandido === id ? null : id
        );
    };

    return (
        <section className="container mt-3 mb-5">
            <h2 className="mb-3">Torneos</h2>
            {data.length === 0 ? (<p>No hay torneos disponibles.</p>) : (
                <div className="row g-3">
                    {data.map((torneo, i) => (
                        <div className="col-6 col-md-4">
                            <div
                                style={{ cursor: "pointer" }}
                                onClick={() => toggleTorneo(torneo.id)}
                            >
                                <Card
                                    titulo={torneo.nombre}
                                    imagen={img}
                                    descripcion={
                                        torneoExpandido === torneo.id
                                            ? "Ocultar categorías ▲"
                                            : "Ver categorías ▼"
                                    }
                                />
                                {
                                    torneoExpandido === torneo.id && (

                                        <div
                                            className="card mt-2 border-0 shadow-sm"
                                        >

                                            <div className="card-body">

                                                <h6 className="mb-3">
                                                    Categorías
                                                </h6>

                                                {
                                                    torneo.categorias.length === 0 ? (

                                                        <p className="text-muted mb-0">
                                                            No hay categorías disponibles.
                                                        </p>

                                                    ) : (

                                                        <div className="list-group">

                                                            {
                                                                torneo.categorias.map((categoria) => (

                                                                    <Link
                                                                        key={categoria.id}
                                                                        to={`/torneos/${categoria.id}`}
                                                                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                                                    >

                                                                        <div>

                                                                            <strong>
                                                                                {categoria.nombre}
                                                                            </strong>

                                                                            <br />

                                                                            <small className="text-muted">

                                                                                {categoria.equipos} equipos

                                                                                {" • "}

                                                                                {
                                                                                    categoria.formato === "solo_liga"
                                                                                        ? "Liga"

                                                                                        : categoria.formato === "playoff_4"
                                                                                            ? "Play-Off (4)"

                                                                                            : "Play-Off (8)"
                                                                                }

                                                                            </small>

                                                                        </div>

                                                                        <span
                                                                            className={`badge ${categoria.estado === "finalizado"
                                                                                    ? "bg-success"

                                                                                    : categoria.estado === "en_curso"
                                                                                        ? "bg-primary"

                                                                                        : "bg-secondary"
                                                                                }`}
                                                                        >

                                                                            {
                                                                                categoria.estado === "configuracion"
                                                                                    ? "Configuración"

                                                                                    : categoria.estado === "en_curso"
                                                                                        ? "En curso"

                                                                                        : "Finalizado"
                                                                            }

                                                                        </span>

                                                                    </Link>

                                                                ))
                                                            }

                                                        </div>

                                                    )

                                                }

                                            </div>

                                        </div>

                                    )
                                }
                            </div>
                        </div>
                    ))}
                </div>)}
        </section>
    );
};

export default Torneo;