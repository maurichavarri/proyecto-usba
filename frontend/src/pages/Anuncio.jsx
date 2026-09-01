import { useFetch } from "../hooks/useFetch";
import { Link } from "react-router-dom";

const truncate = (text, max) => {
    if (!text) return "";
    return text.length > max ? text.substring(0, max) + "..." : text;
};

const Anuncio = () => {

    const { data = [] } = useFetch(
        "http://localhost:3000/api/v1/anuncios"
    );


    return (
        <>
            {/* HERO DEPORTIVO */}
            <section className="anu-hero">
                <div className="container anu-hero-inner">
                    <span className="anu-hero-eyebrow">USBA · Básquet Amateur</span>
                    <h1 className="anu-hero-title">Anuncios</h1>
                    <p className="anu-hero-sub">
                        Novedades del torneo, fixtures, resultados y comunicados
                        oficiales de la liga.
                    </p>
                </div>
            </section>

            {/* GRID */}
            <section className="anu-section">
                <div className="container">
                    {data.length === 0 ? (
                        <p className="text-muted">No hay anuncios disponibles.</p>
                    ) : (
                        <div className="row g-4">
                            {data.map((anuncio) => (
                                <div className="col-6 col-md-4 col-lg-3" key={anuncio.id}>
                                    <Link to={`/anuncios/${anuncio.id}`} className="anu-card">
                                        <div className="anu-card-img-wrap">
                                            {anuncio.imagen ? (
                                                <img
                                                    src={`http://localhost:3000${anuncio.imagen}`}
                                                    alt={anuncio.titulo}
                                                />
                                            ) : (
                                                <div className="anu-card-no-img">🏀</div>
                                            )}
                                            <span className="anu-card-tag">Comunicado</span>
                                        </div>
                                        <div className="anu-card-body">
                                            <h3 className="anu-card-title">{anuncio.titulo}</h3>
                                            <p className="anu-card-desc">
                                                {truncate(anuncio.contenido, 90)}
                                            </p>
                                            <span className="anu-card-link">
                                                Leer más <span className="arrow">→</span>
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};


export default Anuncio;