import { useFetch } from "../hooks/useFetch";
import Card from "../components/Card";
import { Link } from "react-router-dom";

const Anuncio = () => {
    const { data = [] } = useFetch("http://localhost:3000/api/v1/anuncios");

    return (
<<<<<<< HEAD
        <section className="container mt-3 mb-5">
            <h2 className="mb-3">Anuncios</h2>
            {data.length === 0 ? (<p>No hay anuncios disponibles.</p>) : (
                <div className="row g-3">
                    {data.map((anuncio, i) => (
                        <div className="col-6 col-md-4">
                            <Card
                                titulo={anuncio.titulo}
                                imagen={img}
                                descripcion={anuncio.contenido}
                            />
=======
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
>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Anuncio;