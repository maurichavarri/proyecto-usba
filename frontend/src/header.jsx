import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';

const Header = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const admin = JSON.parse(localStorage.getItem('usba_admin_logueado') || 'null');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('usba_admin_logueado');
    navigate('/');
    window.location.reload();
  };

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

        {/* Nav desktop */}
        <ul className="nav-links">
          <li><Link to="/" className="active">Inicio</Link></li>
          <li><Link to="/torneos">Torneos</Link></li>
          <li><Link to="/categorias">Categorias</Link></li>
          <li><Link to="/anuncios">Anuncios</Link></li>
          <li><Link to="/contactos">Contactos</Link></li>
        </ul>

        <div className="nav-actions">
          {admin ? (
            <>
              <span className="admin-saludo">👤 {admin.nombre}</span>
              <Link to="/admin"><button className="btn-secondary">Panel Admin</button></Link>
              <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/admin"><button className="btn-secondary">Ingresar</button></Link>
              <Link to="/inscribirse"><button className="btn-primary">Inscribirse</button></Link>
            </>
          )}
        </div>

        {/* Hamburguesa */}
        <button
          className={`hamburger ${menuAbierto ? 'open' : ''}`}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </nav>

      {/* Menú mobile */}
      <div className={`mobile-menu ${menuAbierto ? 'open' : ''}`}>
        <ul>
          <li><Link to="/" className="active">Inicio</Link></li>
          <li><Link to="/torneos">Torneos</Link></li>
          <li><Link to="/categorias">Categorias</Link></li>
          <li><Link to="/anuncios">Anuncios</Link></li>
          <li><Link to="/contactos">Contactos</Link></li>
        </ul>
        <div className="mobile-actions">
          {admin ? (
            <>
              <Link to="/admin"><button className="btn-secondary">Panel Admin</button></Link>
              <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/admin"><button className="btn-secondary">Ingresar</button></Link>
              <Link to="/inscribirse"><button className="btn-primary">Inscribirse</button></Link>
            </>
          )}
        </div>
      </div>

      <div className="divider"></div>
    </header>
  );
};

export default Header;