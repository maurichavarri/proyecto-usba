import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Páginas
import Home from "./pages/Home";
import Torneo from "./pages/Torneo";
import Categoria from "./pages/Categoria";
import Anuncio from "./pages/Anuncio";
import AnuncioDetalle from "./pages/AnuncioDetalle";
import Login from "./pages/Login"
import Register from "./pages/Register"
import Panel from "./pages/Panel"

import ProtectedRoute from "./routes/ProtectedRoute"

function App() {
  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/torneos" element={<Torneo />} />
          <Route path="/categorias" element={<Categoria />} />
          <Route path="/anuncios" element={<Anuncio />} />
          <Route path="/anuncios/:id" element={<AnuncioDetalle />} />
          <Route path="/auth/ingresar" element={<Login />} />
          <Route path="/auth/inscribirse" element={<Register />} />
          <Route path="/panel" element={<ProtectedRoute roles={["delegado"]}><Panel /></ProtectedRoute>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;