import './footer.css'
 
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
 
        {/* Logo y descripción */}
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-logo-circle">🏀</div>
            <div className="footer-logo-text">
              <span className="footer-logo-title">U.S.B.A</span>
              <span className="footer-logo-sub">Básquet Amateur</span>
            </div>
          </div>
          <p className="footer-desc">
            Unión Santiagueña de Básquet Amateur. Organizando el deporte amateur en Santiago del Estero desde hace años.
          </p>
        </div>
 
        {/* Contacto */}
        <div className="footer-contacto">
          <h3 className="footer-titulo">Contacto</h3>
          <ul className="footer-lista">
            <li>
              <span className="footer-icon">📍</span>
              <span>Santiago del Estero, Argentina</span>
            </li>
            <li>
              <span className="footer-icon">📞</span>
              <a href="tel:+5493854000000">+54 9 385 400-0000</a>
            </li>
            <li>
              <span className="footer-icon">✉️</span>
              <a href="mailto:contacto@usba.com.ar">contacto@usba.com.ar</a>
            </li>
          </ul>
        </div>
 
      </div>
 
      <div className="footer-bottom">
        <p>© 2026 U.S.B.A — Unión Santiagueña de Básquet Amateur. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};
 
export default Footer;
 
