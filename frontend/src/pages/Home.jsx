import { useFetch } from "../hooks/useFetch"
import Card from "../components/Card"
import img from "../assets/img/USBA.png"
import { Link } from "react-router-dom"

const Home = () => {
  const { data } = useFetch("http://localhost:3000/api/v1/anuncios")

  return (
    <div className="container mt-4">
      {/* Anuncios */}
      <section className="mb-5">
        <h2 className="mb-3">Últimos anuncios</h2>
        <div className="row g-3">
          {data.slice(0, 10).map((anuncio, i) => (
            <div className="col-md-3">
              <Link to={`/anuncios/${anuncio.id}`}>
                <Card
                  titulo={anuncio.titulo}
                  imagen={img}
                  descripcion={anuncio.descripcion}
                />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;