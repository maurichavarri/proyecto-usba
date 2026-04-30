import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './header.jsx';
import Torneos from './torneos.jsx';
import Admin from './Admin.jsx';
import Login from './Login.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './footer.jsx';
import './index.css';

const App = () => {
  const adminGuardado = JSON.parse(localStorage.getItem('usba_admin_logueado') || 'null');
  const [admin, setadmin] = useState(adminGuardado);

  const handleLogin = (adminData) => setadmin(adminData);

  const handleLogout = () => {
    localStorage.removeItem('usba_admin_logueado');
    setadmin(null);
  };

  return (
    <BrowserRouter>
      <Header onLogout={handleLogout} admin={admin} />
      <Routes>
        <Route path="/" element={<div style={{ color: '#f5f0e8', padding: '2rem' }}>Inicio</div>} />
        <Route path="/torneos" element={<Torneos />} />
        <Route path="/categorias" element={<div style={{ color: '#f5f0e8', padding: '2rem' }}>Categorías</div>} />
        <Route path="/anuncios" element={<div style={{ color: '#f5f0e8', padding: '2rem' }}>Anuncios</div>} />
        <Route path="/contactos" element={<div style={{ color: '#f5f0e8', padding: '2rem' }}>Contactos</div>} />
        <Route path='/inscribirse' element={<div style={{ color: '#f5f0e8', padding: '2rem' }}>Inscribirse</div>} />
        <Route
          path="/Admin"
          element={admin ? <Admin /> : <Login onlogin={handleLogin} />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);