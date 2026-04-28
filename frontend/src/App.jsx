import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Páginas
import Home from "./pages/Home";
import Torneo from "./pages/Torneo";
import Categoria from "./pages/Categoria";
import Anuncio from "./pages/Anuncio";
import AnuncioDetalle from "./pages/AnuncioDetalle";

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
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;