import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";

const AnuncioDetalle = () => {
  const { id } = useParams();
  const { data } = useFetch(`http://localhost:3000/api/v1/anuncios/${id}`);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm mb-5">
        {data?.imagen && (
          <img
            src={`http://localhost:3000${data.imagen}`}
            className="card-img-top"
            alt={data.titulo}
            style={{ objectFit: "cover", height: "300px" }}
          />
        )}
        <div className="card-body">
<<<<<<< HEAD
          <h3 className="card-title">{data.titulo}</h3>
          <small className="text-muted">{data.fecha}</small>
          <p className="card-text">{data.contenido}</p>
=======
          <h3 className="card-title">{data?.titulo}</h3>
          <small className="text-muted">{data?.fecha}</small>
          <p className="card-text">{data?.contenido}</p>
>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91
        </div>
      </div>
    </div>
  );
};

export default AnuncioDetalle;