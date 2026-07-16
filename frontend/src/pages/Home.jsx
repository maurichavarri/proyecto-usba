import { useFetch } from "../hooks/useFetch"
import Carrusel from '../components/Carrusel'
import Bienvenida from "../components/Bienvenida";
import Card from "../components/Card"
import img from "../assets/img/USBA.png"
import img1 from "../assets/img/usba-arbitros.jpeg"
import img2 from "../assets/img/pelota-basquet.jpeg"
import { Link } from "react-router-dom"

const Home = () => {
  const { data } = useFetch("http://localhost:3000/api/v1/anuncios")
  const imagenesCarrusel = [img, img1, img2];

  return (
    <div className="container mt-4 mb-5">

      {/* Carrusel */}
      <div className="mb-5">
        <Carrusel imagenes={imagenesCarrusel} />
      </div>

      {/* Bienvenida debajo del carrusel */}
      <Bienvenida />

      {/* Anuncios */}
      <section className="mb-5">
        <h2 className="mb-3">Últimos anuncios</h2>
        {data.length === 0 ? (<p>No hay anuncios disponibles.</p>) : (
          <div className="row g-4">
            {data?.slice(0, 10).map((anuncio) => (
              <div className="col-6 col-md-3" key={anuncio.id}>
                <Link to={`/anuncios/${anuncio.id}`}>
                  <Card
                    titulo={anuncio.titulo}
                    imagen={img}
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