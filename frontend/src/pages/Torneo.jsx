import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import Card from "../components/Card";
import img from "../assets/img/pelota-basquet.jpeg";

const Torneo = () => {
  const navigate = useNavigate();
  const { data: torneos, loading, error } = useFetch("http://localhost:3000/api/v1/torneos");

    return (
        <section className="container mt-3 mb-5">
            <h2 className="mb-3">Torneos</h2>
            {data.length === 0 ? (<p>No hay torneos disponibles.</p>) : (
                <div className="row g-3">
                    {data.map((torneo, i) => (
                        <div className="col-6 col-md-4">
                            <Card
                                titulo={torneo.nombre}
                                imagen={img}
                                descripcion="Ver detalles de este torneo."
                            />
                        </div>
                    ))}
                </div>)}
        </section>
    );
};

export default Torneo;