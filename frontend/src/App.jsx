import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [active, setActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className={`container ${active ? "active" : ""}`}>

      {/* 🔐 LOGIN */}
      {(!isMobile || !active) && (
        <div className="form-box login">
          <form>
            <h1>Iniciar sesión</h1>

            <div className="input-box">
              <input type="text" placeholder="Cuenta de email" />
            </div>

            <div className="input-box">
              <input type="password" placeholder="Contraseña" />
            </div>

            <div className="forgot-link">
              <a href="#">¿Te olvidaste la contraseña?</a>
            </div>

            <button type="button" className="btn">
              Iniciar sesión
            </button>
          </form>
        </div>
      )}

      {/* 📝 REGISTER */}
      {(!isMobile || active) && (
        <div className="form-box register">
          <form>
            <h1>Registrate</h1>

            <div className="input-box">
              <input type="text" placeholder="Nombre de usuario" />
            </div>

            <div className="input-box">
              <input type="email" placeholder="Email" />
            </div>

            <div className="input-box">
              <input type="password" placeholder="Contraseña" />
            </div>

            <button type="button" className="btn">
              Registrar
            </button>
          </form>
        </div>
      )}

      {/* 🟧 PANEL */}
      <div className="toggle-box">

        {/* SOLO EN LOGIN */}
        {(!isMobile || !active) && (
          <div className="toggle-panel toggle-left">
            <h1>Hola, Bienvenido!</h1>
            <p>¿No tienes una cuenta?</p>
            <button className="btn" onClick={() => setActive(true)}>
              Registrate
            </button>
          </div>
        )}

        {/* SOLO EN REGISTER */}
        {(!isMobile || active) && (
          <div className="toggle-panel toggle-right">
            <h1>Bienvenido de vuelta!</h1>
            <p>¿Ya tienes una cuenta?</p>
            <button className="btn" onClick={() => setActive(false)}>
              Iniciar sesión
            </button>
          </div>
        )}

      </div>

    </div>
  );
}

export default App;