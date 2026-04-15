import { useState } from 'react';
import { Link } from 'react-router-dom';

import './header.css';
 
const Header = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
 
  return (
    <header className="usba-header">
      <div className="top-bar">Santiago del Estero</div>
      <nav className="main-nav">
        <a className="logo-section" href="#">
          <div className="logo-circle">
            <span className="logo-ball">🏀</span>
          </div>
          <div className="logo-text">
            <span className="logo-title">U.S.B.A</span>
            <span className="logo-sub">Básquet Amateur</span>
          </div>
        </a>
 
        {/* Nav desktop — se oculta en mobile */}
        <ul className="nav-links">
          <li><Link to="/" className="active">Inicio</Link></li>
          <li><Link to="/torneos">Torneos</Link></li>
          <li><Link to="/categorias">Categorias</Link></li>
          <li><Link to="/anuncios">Anuncios</Link></li>
          <li><Link to="/contactos">Contactos</Link></li>
        </ul>
 
        <div className="nav-actions">
          <Link to="/ingresar"><button className="btn-secondary">Ingresar</button></Link>
          <Link to="/inscribirse"><button className="btn-primary">Inscribirse</button></Link>
        </div>
 
        {/* Botón hamburguesa — solo visible en mobile */}
        <button
          className={`hamburger ${menuAbierto ? 'open' : ''}`}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </nav>
 
      {/* Menú mobile desplegable */}
      <div className={`mobile-menu ${menuAbierto ? 'open' : ''}`}>
        <ul>
          <li><Link to="/" className="active">Inicio</Link></li>
          <li><Link to="/torneos">Torneos</Link></li>
          <li><Link to="/categorias">Categorias</Link></li>
          <li><Link to="/anuncios">Anuncios</Link></li>
          <li><Link to="/contactos">Contactos</Link></li>
        </ul>
        <div className="mobile-actions">
          <Link to="/ingresar"><button className="btn-secondary">Ingresar</button></Link>
          <Link to="/inscribirse"><button className="btn-primary">Inscribirse</button></Link>
        </div>
      </div>
 
      <div className="divider"></div>
 
      {/*
      <div className="sub-bar">
        <div className="breadcrumb">
          <span></span> <span></span>       
        </div>
        <div className="season-tag"><em></em></div>
      </div>*/}
    </header>
  );
};
 
export default Header;