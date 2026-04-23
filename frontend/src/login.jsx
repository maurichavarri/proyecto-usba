import { useState } from 'react';
import './Login.css';

// Credenciales de admin hardcodeadas (podés cambiarlas o conectar a una DB)
const ADMIN_EMAIL = 'admin@usba.com';
const ADMIN_PASSWORD = 'admin123';

const Login = ({ onlogin }) => {
  const [tab, setTab] = useState('login'); // 'login' | 'registro'

  // Estado login
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Estado registro
  const [regData, setRegData] = useState({ nombre: '', email: '', password: '', confirmar: '' });
  const [regError, setRegError] = useState('');
  const [regOk, setRegOk] = useState(false);

  // ── LOGIN ──────────────────────────────────────────
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginData.email || !loginData.password) {
      setLoginError('Completá todos los campos.');
      return;
    }

    if (
      loginData.email.trim() === ADMIN_EMAIL &&
      loginData.password === ADMIN_PASSWORD
    ) {
      const adminData = { email: loginData.email, nombre: 'Administrador' };
      localStorage.setItem('usba_admin_logueado', JSON.stringify(adminData));
      onlogin(adminData); // ← abre el panel admin en main.jsx
    } else {
      setLoginError('Email o contraseña incorrectos.');
    }
  };

  // ── REGISTRO ───────────────────────────────────────
  const handleRegistro = (e) => {
    e.preventDefault();
    setRegError('');
    setRegOk(false);

    if (!regData.nombre.trim() || !regData.email.trim() || !regData.password || !regData.confirmar) {
      setRegError('Completá todos los campos.');
      return;
    }
    if (regData.password !== regData.confirmar) {
      setRegError('Las contraseñas no coinciden.');
      return;
    }
    if (regData.password.length < 6) {
      setRegError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // Acá iría la llamada a tu backend/API para registrar
    // Por ahora simulamos éxito:
    setRegOk(true);
    setRegData({ nombre: '', email: '', password: '', confirmar: '' });
    setTimeout(() => setTab('login'), 2000); // vuelve al login tras 2s
  };

  return (
    <div className="login-wrap">
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-circle">🏀</div>
          <div className="login-logo-text">
            <span className="login-logo-title">U.S.B.A</span>
            <span className="login-logo-sub">Básquet Amateur</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setLoginError(''); setRegError(''); setRegOk(false); }}
          >
            Login
          </button>
          <button
            className={`login-tab ${tab === 'registro' ? 'active' : ''}`}
            onClick={() => { setTab('registro'); setLoginError(''); setRegError(''); setRegOk(false); }}
          >
            Registro
          </button>
        </div>

        {/* ── FORM LOGIN ── */}
        {tab === 'login' && (
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="tu@email.com"
                value={loginData.email}
                onChange={e => setLoginData({ ...loginData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="********"
                value={loginData.password}
                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>

            {loginError && <div className="login-error-box">{loginError}</div>}

            <button type="submit" className="btn-login w-100">
              Iniciar Sesión
            </button>
          </form>
        )}

        {/* ── FORM REGISTRO ── */}
        {tab === 'registro' && (
          <form className="login-form" onSubmit={handleRegistro}>
            <div className="form-group">
              <label>Nombre completo</label>
              <input
                type="text"
                className="form-control"
                placeholder="Juan Pérez"
                value={regData.nombre}
                onChange={e => setRegData({ ...regData, nombre: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="tu@email.com"
                value={regData.email}
                onChange={e => setRegData({ ...regData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="Mínimo 6 caracteres"
                value={regData.password}
                onChange={e => setRegData({ ...regData, password: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Confirmar contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="Repetí tu contraseña"
                value={regData.confirmar}
                onChange={e => setRegData({ ...regData, confirmar: e.target.value })}
              />
            </div>

            {regError && <div className="login-error-box">{regError}</div>}
            {regOk && (
              <div style={{ background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.3)', borderRadius: 7, padding: '10px 14px', fontSize: 13, color: '#4caf50', textAlign: 'center' }}>
                ✅ Registro exitoso. Redirigiendo al login...
              </div>
            )}

            <button type="submit" className="btn-login w-100">
              Crear cuenta
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default Login;