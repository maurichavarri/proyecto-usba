import { useFetch } from "../hooks/useFetch";
import Card from "../components/Card";
import img from "../assets/img/pelota-basquet-2.jpeg"

const Categoria = () => {
    const { data } = useFetch("http://localhost:3000/api/v1/categorias");

    return (
        <section className="container mt-3 mb-5">
            <h2 className="mb-3">Categorias</h2>
            <div className="row g-3">
                {data.map((categoria, i) => (
                    <div className="col-md-3">
                        <Card
                            titulo={categoria.nombre}
                            imagen={img}
                            descripcion={categoria.descripcion}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Categoria;