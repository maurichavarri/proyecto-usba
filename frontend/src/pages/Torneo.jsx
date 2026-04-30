import { useFetch } from "../hooks/useFetch";
import Card from "../components/Card";
import img from "../assets/img/pelota-basquet.jpeg"

const Torneo = () => {
    const { data } = useFetch("http://localhost:3000/api/v1/torneos");

    return (
        <section className="container mt-3 mb-5">
            <h2 className="mb-3">Torneos</h2>
            <div className="row g-3">
                {data.map((torneo, i) => (
                    <div className="col-md-3">
                        <Card
                            titulo={torneo.nombre}
                            imagen={img}
                            descripcion="Inscripciones abiertas para el próximo torneo."
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Torneo;