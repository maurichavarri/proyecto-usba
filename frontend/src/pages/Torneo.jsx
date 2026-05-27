import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import Card from "../components/Card";
import img from "../assets/img/pelota-basquet.jpeg";

const Torneo = () => {
  const navigate = useNavigate();
  const { data: torneos, loading, error } = useFetch("http://localhost:3000/api/v1/torneos");

  const handleClickTorneo = (torneoId) => {
    navigate(`/torneos/${torneoId}/categorias`);
  };

  return (
    <section className="container mt-3 mb-5">
      <h2 className="mb-3">Torneos</h2>
      <div className="row g-3">
        {torneos?.map((torneo) => (
          <div
            key={torneo.id}
            className="col-6 col-md-4"
            onClick={() => handleClickTorneo(torneo.id)}
            style={{ cursor: "pointer" }}
          >
            <Card
              titulo={torneo.nombre}
              imagen={img}
              descripcion={`Inicio: ${torneo.fecha_inicio || "No definida"} - Fin: ${torneo.fecha_fin || "No definida"}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Torneo;