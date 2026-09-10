import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminSedes = () => {
  const navigate = useNavigate();

  const [sedes, setSedes] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    obtenerSedes();
  }, []);

  const obtenerSedes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/sedes");
      const data = await response.json();
      setSedes(data);
    } catch (error) {
      console.error(error);
    }
  };

  const sedesFiltradas = sedes.filter((sede) => {
    const texto = busqueda.toLowerCase();
    return (
      sede.nombre?.toLowerCase().includes(texto) ||
      sede.direccion?.toLowerCase().includes(texto)
    );
  });

  return (
    <div className="container mt-5 mb-5">
      <div className="col-lg-10 mx-auto">

        {/* Breadcrumb y Titulo */}
        <div className="mb-3">
          <nav
            className="mb-1"
            style={{
              fontSize: "0.9rem",
            }}
          >
            <span
              className="text-muted"
              style={{
                cursor: "pointer",
              }}
              onClick={() => navigate("/panel/admin")}
            >
              Panel de Administrador
            </span>

            {" > "}

            <span className="text-muted">Sedes</span>
          </nav>

          <div className="d-flex align-items-center mb-2">
            <h3 className="fw-bold me-2 mb-0">Sedes</h3>

            <span
              onClick={() => setShowHelp(true)}
              style={{
                cursor: "pointer",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: "#6c757d",
                color: "white",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              ?
            </span>
          </div>
        </div>

        {/* Botones */}
        <div className="d-flex justify-content-between mb-3">
          <button
            className="btn btn-dark"
            onClick={() => navigate("/panel/admin")}
          >
            ← Volver
          </button>
          <Link to="/panel/admin/sedes/crear" className="btn btn-primary">
            + Crear Sede
          </Link>
        </div>

        {/* Tabla */}
        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <strong>Listado de sedes</strong>
            <input
              type="text"
              className="form-control w-auto"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="card-body">
            {sedes.length === 0 ? (
              <div className="alert alert-info mb-0">
                No hay sedes registradas.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Dirección</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sedesFiltradas.length > 0 ? (
                      sedesFiltradas.map((sede) => (
                        <tr key={sede.id}>
                          <td>
                            <strong>{sede.nombre}</strong>
                          </td>
                          <td>{sede.direccion}</td>
                          <td>
                            <Link
                              to={`/panel/admin/sedes/editar/${sede.id}`}
                              className="btn btn-primary btn-sm"
                            >
                              Editar
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-muted">
                          No se encontraron sedes.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal ayuda */}
        {showHelp && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          >
            <div
              className="bg-white p-4 rounded shadow"
              style={{ maxWidth: "500px" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>¿Cómo funciona este apartado?</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowHelp(false)}
                />
              </div>
              <p>
                Desde esta sección podés administrar las sedes donde se
                disputarán los partidos.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSedes;
