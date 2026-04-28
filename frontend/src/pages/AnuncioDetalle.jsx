import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import img from "../assets/img/pelota-basquet.jpeg";

const AnuncioDetalle = () => {
  const { id } = useParams(); // obtenemos el :id de la URL
  const { data } = useFetch(`http://localhost:3000/api/v1/anuncios/${id}`)

  return (
    <div className="container mt-4">
      <div className="card shadow-sm mb-5">
        {img && (
          <img
            src={img}
            className="card-img-top"
            alt={data.titulo}
            style={{ objectFit: "cover", height: "300px" }}
          />
        )}
        <div className="card-body">
          <h3 className="card-title">{data.titulo}</h3>
          <small className="text-muted">{data.fecha}</small>
          <p className="card-text">{data.descripcion}</p>
        </div>
      </div>
    </div>
  );
};

export default AnuncioDetalle;