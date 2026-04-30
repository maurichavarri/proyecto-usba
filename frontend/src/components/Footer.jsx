import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="container py-4">
        <div className="row">

          {/* Marca */}
          <div className="col-md-3 mb-3">
            <h5>U.S.B.A</h5>
            <p className="mb-1">Básquet Amateur</p>
            <small>Santiago del Estero</small>
          </div>

          {/* Navegación */}
          <div className="col-md-3 mb-3">
            <h6>Navegación</h6>
            <ul className="list-unstyled">
              <li><Link className="text-white text-decoration-none" to="/">Inicio</Link></li>
              <li><Link className="text-white text-decoration-none" to="/torneos">Torneos</Link></li>
              <li><Link className="text-white text-decoration-none" to="/categorias">Categorías</Link></li>
              <li><Link className="text-white text-decoration-none" to="/anuncios">Anuncios</Link></li>
              <li><Link className="text-white text-decoration-none" to="/contactos">Contactos</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-md-3 mb-3">
            <h6>Contacto</h6>
            <p className="mb-1">contacto@usba.com</p>
            <p className="mb-1">+54 9 385 XXX XXXX</p>
          </div>

          {/* Redes */}
          <div className="col-md-3 mb-3">
            <h6>Redes</h6>
            <div className="d-flex flex-column">
              <a href="#" className="text-white text-decoration-none mb-1">Instagram</a>
              <a href="#" className="text-white text-decoration-none mb-1">Facebook</a>
              <a href="#" className="text-white text-decoration-none">Twitter</a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="bg-black text-center py-2">
        <small>© {new Date().getFullYear()} U.S.B.A - Todos los derechos reservados</small>
      </div>
    </footer>
  );
};

export default Footer;