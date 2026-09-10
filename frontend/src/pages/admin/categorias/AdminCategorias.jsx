import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminCategorias = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const obtenerCategorias = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/v1/categorias/admin/todas",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener las categorías.");
      }
      console.log("CATEGORÍAS RECIBIDAS:", data);
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const cambiarEstado = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/v1/categorias/${id}/estado`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "No fue posible cambiar el estado de la categoría.",
        );
      }
      console.log("ESTADO ACTUALIZADO:", data);
      await obtenerCategorias();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert(error.message);
    }
  };

  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.nombre?.toLowerCase().includes(busqueda.toLowerCase()),
  );

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

            <span className="text-muted">Categorías</span>
          </nav>

          <div className="d-flex align-items-center mb-2">
            <h3 className="fw-bold me-2 mb-0">Categorías</h3>

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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            className="btn btn-dark"
            onClick={() => navigate("/panel/admin")}
          >
            ← Volver
          </button>
          <Link to="/panel/admin/categorias/crear" className="btn btn-primary">
            + Crear Categoría
          </Link>
        </div>

        {/* Tabla */}
        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <strong>Categorías registradas</strong>
            <input
              type="text"
              className="form-control w-auto"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="card-body">
            {categorias.length === 0 ? (
              <div className="alert alert-info">
                No existen categorías registradas.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoriasFiltradas.length > 0 ? (
                      categoriasFiltradas.map((categoria) => (
                        <tr key={categoria.id}>
                          <td>{categoria.nombre}</td>
                          <td>
                            {categoria.estado === "activo" ? (
                              <span className="badge bg-success">Visible</span>
                            ) : (
                              <span className="badge bg-danger">Oculto</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              {categoria.vinculada ? (
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  disabled
                                  title="No puede editarse porque la categoría ya fue utilizada en una competencia."
                                >
                                  Editar
                                </button>
                              ) : (
                                <Link
                                  to={`/panel/admin/categorias/editar/${categoria.id}`}
                                  className="btn btn-primary btn-sm"
                                >
                                  Editar
                                </Link>
                              )}
                              <button
                                onClick={() => cambiarEstado(categoria.id)}
                                className={
                                  categoria.estado === "activo"
                                    ? "btn btn-danger btn-sm"
                                    : "btn btn-success btn-sm"
                                }
                              >
                                {categoria.estado === "activo"
                                  ? "Ocultar"
                                  : "Mostrar"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-muted">
                          No se encontraron categorías.
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
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
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
                Desde aquí podés crear, editar, activar o archivar categorías
                utilizadas en los torneos.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategorias;
