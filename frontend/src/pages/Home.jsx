import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import Carrusel from '../components/Carrusel';
import Bienvenida from "../components/Bienvenida";
import Card from "../components/Card";
import { Link } from "react-router-dom";

const Home = () => {
  const { data: anuncios = [] } = useFetch("http://localhost:3000/api/v1/anuncios");
  const [imagenesCarrusel, setImagenesCarrusel] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/carrusel");
        if (!res.ok) throw new Error();
        const data = await res.json();
        const imagenes = Array.isArray(data) ? data : [];
        setImagenesCarrusel(imagenes.map(img => `http://localhost:3000${img.url}`));
      } catch {
        setImagenesCarrusel([]);
      }
    };
    cargar();
  }, []);

  return (
    <div>
      {/* Carrusel - full width sin container */}
      {imagenesCarrusel === null ? (
        <div style={{
          height: "480px",
          backgroundColor: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>Cargando...</span>
        </div>
      ) : imagenesCarrusel.length > 0 ? (
        <Carrusel imagenes={imagenesCarrusel} />
      ) : null}

      {/* Bienvenida - full width oscuro */}
      <Bienvenida />

      {/* Anuncios */}
      <div className="container mt-5 mb-5">
        <div className="d-flex align-items-baseline justify-content-between mb-4">
          <h2 style={{ fontWeight: "900", letterSpacing: "-0.5px" }}>
            Últimos anuncios
          </h2>
          <Link to="/anuncios" style={{
            color: "#e8500a",
            fontWeight: "700",
            fontSize: "0.85rem",
            textDecoration: "none",
            letterSpacing: "0.5px",
          }}>
            Ver todos →
          </Link>
        </div>

        {anuncios.length === 0 ? (
          <p style={{ color: "#999" }}>No hay anuncios disponibles.</p>
        ) : (
          <div className="row g-3">
            {anuncios.slice(0, 8).map((anuncio) => (
              <div className="col-6 col-md-3" key={anuncio.id}>
                <Link to={`/anuncios/${anuncio.id}`} style={{ textDecoration: "none" }}>
                  <Card
                    titulo={anuncio.titulo}
                    imagen={anuncio.imagen ? `http://localhost:3000${anuncio.imagen}` : null}
                    descripcion={anuncio.contenido}
                  />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;