import { useFetch } from "../hooks/useFetch";
import img from "../assets/img/pelota-basquet-2.jpeg";

const Categoria = () => {

    const { data } = useFetch("http://localhost:3000/api/v1/categorias");

    return (
        <>
            {/* HERO DEPORTIVO */}
            <section className="cat-hero">
                <div className="container cat-hero-inner">
                    <span className="cat-hero-eyebrow">USBA · Básquet Amateur</span>
                    <h1 className="cat-hero-title">
                        Categorías
                        <span>en juego</span>
                    </h1>
                    <p className="cat-hero-sub text-light">
                        Elegí tu división. Cada categoría tiene su propio formato,
                        equipos y calendario dentro del torneo.
                    </p>
                </div>
            </section>

            {/* GRID */}
            <section className="cat-grid-section">
                <div className="container">
                    {data.length === 0 ? (
                        <p className="text-muted">No hay categorías disponibles.</p>
                    ) : (
                        <div className="row g-4">
                            {data.map((categoria, i) => (
                                <div key={categoria.id ?? i} className="col-6 col-md-4 col-lg-3">
                                    <div className="cat-card">
                                        <img src={img} alt={categoria.nombre} className="cat-card-img" />
                                        <span className="cat-card-number">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <div className="cat-card-content">
                                            <span className="cat-card-tag">División</span>
                                            <div className="cat-card-line" />
                                            <h3 className="cat-card-title">{categoria.nombre}</h3>
                                            <p className="cat-card-desc">{categoria.descripcion}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};


export default Categoria;