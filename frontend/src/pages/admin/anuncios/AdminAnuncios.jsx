import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminAnuncios = () => {
  const [anuncios, setAnuncios] = useState([]);

  useEffect(() => {
    obtenerAnuncios();
  }, []);

  const obtenerAnuncios = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/v1/anuncios/admin/todos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      setAnuncios(data);
    } catch (error) {
      console.error(error);
    }
  };

  const cambiarEstado = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:3000/api/v1/anuncios/${id}/estado`, {
        method: "PATCH",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      obtenerAnuncios();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Anuncios</h2>

        <Link to="/panel/admin/anuncios/crear" className="btn btn-dark">
          Crear anuncio
        </Link>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {anuncios.map((anuncio) => (
            <tr key={anuncio.id}>
              <td>{anuncio.id}</td>

              <td>{anuncio.titulo}</td>

              <td>{anuncio.estado}</td>

              <td>{new Date(anuncio.createdAt).toLocaleDateString()}</td>

              <td className="d-flex gap-2">
                <Link
                  to={`/panel/admin/anuncios/editar/${anuncio.id}`}
                  className="btn btn-warning btn-sm"
                >
                  Editar
                </Link>
                <Link to="/panel/admin/carrusel">Carrusel</Link>
                <button
                  onClick={() => cambiarEstado(anuncio.id)}
                  className="btn btn-secondary btn-sm"
                >
                  {anuncio.estado === "activo" ? "Archivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAnuncios;
