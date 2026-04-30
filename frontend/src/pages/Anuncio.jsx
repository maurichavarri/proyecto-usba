import { useFetch } from "../hooks/useFetch";
import Card from "../components/Card";
import img from "../assets/img/pelota-basquet.jpeg"

const Anuncio = () => {
    const { data } = useFetch("http://localhost:3000/api/v1/anuncios");

    return (
        <section className="container mt-3 mb-5">
            <h2 className="mb-3">Anuncios</h2>
            <div className="row g-3">
                {data.map((anuncio, i) => (
                    <div className="col-md-3">
                        <Card
                            titulo={anuncio.titulo}
                            imagen={img}
                            descripcion={anuncio.descripcion}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Anuncio;