import { useFetch } from "../hooks/useFetch";
import Card from "../components/Card";
import { Link } from "react-router-dom";

const Anuncio = () => {
    const { data = [] } = useFetch("http://localhost:3000/api/v1/anuncios");

    return (
        <section className="container mt-4 mb-5">
            <h2 className="mb-4">Anuncios</h2>
            {data.length === 0 ? (
                <p>No hay anuncios disponibles.</p>
            ) : (
                <div className="row g-3">
                    {data.map((anuncio) => (
                        <div className="col-6 col-md-4" key={anuncio.id}>
                            <Link to={`/anuncios/${anuncio.id}`} style={{ textDecoration: "none" }}>
                                <Card
                                    titulo={anuncio.titulo}
                                    imagen={anuncio.imagen ? `http://localhost:3000${anuncio.imagen}` : null}
                                    descripcion={anuncio.contenido}
                                />
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Anuncio;