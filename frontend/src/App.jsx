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

import CrearEquipo from "./pages/delegado/CrearEquipo";
import MisEquipos from "./pages/delegado/MisEquipos";
import JugadoresEquipo from "./pages/delegado/JugadoresEquipo";
import MisInscripciones from "./pages/delegado/MisInscripciones";
import DashboardDelegado from "./pages/delegado/DashboardDelegado";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminInscripciones from "./pages/admin/AdminInscripciones";
import AdminTorneos from "./pages/admin/torneos/AdminTorneos";
import AdminTorneoCategorias from "./pages/admin/AdminTorneoCategorias";
import CrearTorneo from "./pages/admin/torneos/CrearTorneo";
import EditarTorneo from "./pages/admin/torneos/EditarTorneo";
import AdminCategorias from './pages/admin/categorias/AdminCategorias';
import CrearCategoria from './pages/admin/categorias/CrearCategoria';
import EditarCategoria from './pages/admin/categorias/EditarCategoria';
import AdminAnuncios from './pages/admin/anuncios/AdminAnuncios';
import CrearAnuncio from './pages/admin/anuncios/CrearAnuncio';
import EditarAnuncio from './pages/admin/anuncios/EditarAnuncio';
import AdminFixture from './pages/admin/AdminFixture';
import AdminSedes from "./pages/admin/sedes/AdminSedes";
import CrearSede from "./pages/admin/sedes/CrearSede";
import EditarSede from "./pages/admin/sedes/EditarSede";
import AdminArbitros from "./pages/admin/arbitros/AdminArbitros";
import CrearArbitro from "./pages/admin/arbitros/CrearArbitro";
import EditarArbitro from "./pages/admin/arbitros/EditarArbitro";
import AdminPartido from "./pages/admin/AdminPartido";

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
          <Route path="/panel/delegado/equipos/crear" element={<ProtectedRoute roles={["delegado"]}><CrearEquipo /></ProtectedRoute>} />
          <Route path="/panel/delegado/equipos" element={<ProtectedRoute roles={["delegado"]}><MisEquipos /></ProtectedRoute>} />
          <Route path="/panel/delegado/equipos/:id/jugadores" element={<ProtectedRoute roles={["delegado"]}><JugadoresEquipo /></ProtectedRoute>} />
          <Route path="/panel/delegado/inscripciones" element={<ProtectedRoute roles={["delegado"]}><MisInscripciones /></ProtectedRoute>} />
          <Route path="/panel/delegado" element={<ProtectedRoute roles={["delegado"]}><DashboardDelegado /></ProtectedRoute>} />
          <Route path="/panel/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/panel/admin/inscripciones" element={<ProtectedRoute roles={["admin"]}><AdminInscripciones /></ProtectedRoute>} />
          <Route path="/panel/admin/torneos" element={<ProtectedRoute roles={["admin"]}><AdminTorneos /></ProtectedRoute>} />
          <Route path="/panel/admin/torneos/crear" element={<ProtectedRoute roles={["admin"]}><CrearTorneo /></ProtectedRoute>} />
          <Route path="/panel/admin/torneos/editar/:id" element={<ProtectedRoute roles={["admin"]}><EditarTorneo /></ProtectedRoute>} />
          <Route path="/panel/admin/categorias" element={<ProtectedRoute roles={["admin"]}><AdminCategorias /></ProtectedRoute>} />
          <Route path="/panel/admin/categorias/crear" element={<ProtectedRoute roles={["admin"]}><CrearCategoria /></ProtectedRoute>} />
          <Route path="/panel/admin/categorias/editar/:id" element={<ProtectedRoute roles={["admin"]}><EditarCategoria /></ProtectedRoute>} />
          <Route path="/panel/admin/torneo-categorias" element={<ProtectedRoute roles={["admin"]}><AdminTorneoCategorias /></ProtectedRoute>} />
          <Route path="/panel/admin/anuncios" element={<ProtectedRoute roles={['admin']}><AdminAnuncios /></ProtectedRoute>} />
          <Route path="/panel/admin/anuncios/crear" element={<ProtectedRoute roles={['admin']}><CrearAnuncio /></ProtectedRoute>} />
          <Route path="/panel/admin/anuncios/editar/:id" element={<ProtectedRoute roles={['admin']}><EditarAnuncio /></ProtectedRoute>} />
          <Route path="/panel/admin/fixture/:id" element={<ProtectedRoute roles={['admin']}><AdminFixture /></ProtectedRoute>} />
          <Route path="/panel/admin/sedes" element={<ProtectedRoute roles={['admin']}><AdminSedes /></ProtectedRoute>} />
          <Route path="/panel/admin/sedes/crear" element={<ProtectedRoute roles={['admin']}><CrearSede /></ProtectedRoute>} />
          <Route path="/panel/admin/sedes/editar/:id" element={<ProtectedRoute roles={['admin']}><EditarSede /></ProtectedRoute>} />
          <Route path="/panel/admin/arbitros" element={<ProtectedRoute roles={['admin']}><AdminArbitros /></ProtectedRoute>} />
          <Route path="/panel/admin/arbitros/crear" element={<ProtectedRoute roles={['admin']}><CrearArbitro /></ProtectedRoute>} />
          <Route path="/panel/admin/arbitros/editar/:id" element={<ProtectedRoute roles={['admin']}><EditarArbitro /></ProtectedRoute>} />
          <Route path="/panel/admin/partidos/:id" element={<ProtectedRoute roles={["admin"]}><AdminPartido /></ProtectedRoute>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;