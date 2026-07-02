import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import Carrusel from '../components/Carrusel';
import Bienvenida from "../components/Bienvenida";
import Card from "../components/Card";
import imgFallback from "../assets/img/USBA.png";
import { Link } from "react-router-dom";

const Home = () => {
  const { data: anuncios = [] } = useFetch("http://localhost:3000/api/v1/anuncios");

  // Imágenes del carrusel desde el backend (solo las activas)
  const [imagenesCarrusel, setImagenesCarrusel] = useState([]);

  useEffect(() => {
    const cargarImagenesCarrusel = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/carrusel");
        if (!res.ok) throw new Error("Error al cargar carrusel");
        const data = await res.json();
        const imagenes = Array.isArray(data) ? data : data.imagenes ?? [];
        // Convertir URLs relativas a absolutas
        setImagenesCarrusel(
          imagenes.map((img) => `http://localhost:3000${img.url}`)
        );
      } catch (error) {
        console.error("Error carrusel:", error);
        // Si falla la API, usa la imagen de fallback
        setImagenesCarrusel([imgFallback]);
      }
    };

    cargarImagenesCarrusel();
  }, []);

  return (
    <div className="container mt-4 mb-5">

      {/* Carrusel dinámico */}
      <div className="mb-5">
        {imagenesCarrusel.length > 0 ? (
          <Carrusel imagenes={imagenesCarrusel} />
        ) : (
          // Placeholder mientras carga
          <div
            className="bg-secondary rounded d-flex align-items-center justify-content-center"
            style={{ height: "300px" }}
          >
            <span className="text-white">Cargando carrusel...</span>
          </div>
        )}
      </div>

      {/* Bienvenida */}
      <Bienvenida />

      {/* Anuncios */}
      <section className="mb-5">
        <h2 className="mb-3">Últimos anuncios</h2>
        {anuncios.length === 0 ? (
          <p>No hay anuncios disponibles.</p>
        ) : (
          <div className="row g-4">
            {anuncios.slice(0, 10).map((anuncio) => (
              <div className="col-6 col-md-3" key={anuncio.id}>
                <Link to={`/anuncios/${anuncio.id}`}>
                  <Card
                    titulo={anuncio.titulo}
                    // Si el anuncio tiene imagen propia la usa, sino el fallback
                    imagen={
                      anuncio.imagen
                        ? `http://localhost:3000${anuncio.imagen}`
                        : imgFallback
                    }
                    descripcion={anuncio.contenido}
                  />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;