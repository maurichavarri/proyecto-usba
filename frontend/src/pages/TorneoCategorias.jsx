import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import imgCategoria from "../assets/img/pelota-basquet.jpeg"; // Podés cambiar la imagen

const TorneoCategorias = () => {
  const { torneoId } = useParams();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [torneoNombre, setTorneoNombre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        // Obtener categorías del torneo
        const resCats = await fetch(`http://localhost:3000/api/v1/torneos/${torneoId}/categorias`);
        const dataCats = await resCats.json();
        setCategorias(dataCats);

        // Obtener nombre del torneo (opcional, para mostrar en el título)
        const resTorneo = await fetch(`http://localhost:3000/api/v1/torneos/${torneoId}`);
        const dataTorneo = await resTorneo.json();
        setTorneoNombre(dataTorneo.nombre);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, [torneoId]);

  const handleClickCategoria = (categoriaId) => {
    navigate(`/torneos/${torneoId}/categorias/${categoriaId}`);
  };

  return (
    <section className="container mt-3 mb-5">
      <button 
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate("/torneos")}
      >
        ← Volver a torneos
      </button>

      <h2 className="mb-3">
        Categorías de {torneoNombre || `Torneo #${torneoId}`}
      </h2>

      {categorias.length === 0 ? (
        <div className="alert alert-info">
          Este torneo no tiene categorías asociadas.
        </div>
      ) : (
        <div className="row g-3">
          {categorias.map((categoria) => (
            <div
              key={categoria.id}
              className="col-6 col-md-4"
              onClick={() => handleClickCategoria(categoria.id)}
              style={{ cursor: "pointer" }}
            >
              <Card
                titulo={categoria.nombre}
                imagen={imgCategoria}
                descripcion={categoria.descripcion || "Sin descripción"}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default TorneoCategorias;