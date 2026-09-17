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

  // =====================================================
  // OBTENER CATEGORÍAS
  // =====================================================

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

      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  // =====================================================
  // CAMBIAR ESTADO
  // =====================================================

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

      await obtenerCategorias();
    } catch (error) {
      console.error("Error al cambiar estado:", error);

      alert(error.message);
    }
  };

  // =====================================================
  // FILTRO
  // =====================================================

  const categoriasFiltradas = categorias.filter((categoria) => {
    const texto = busqueda.trim().toLowerCase();

    const nombre = categoria.nombre?.toLowerCase() || "";

    const descripcion = categoria.descripcion?.toLowerCase() || "";

    const sexo = categoria.sexo?.toLowerCase() || "";

    const estado = categoria.estado?.toLowerCase() || "";

    const edadMinima = String(categoria.edad_minima ?? "");

    const edadMaxima = String(categoria.edad_maxima ?? "");

    return (
      nombre.includes(texto) ||
      descripcion.includes(texto) ||
      sexo.includes(texto) ||
      estado.includes(texto) ||
      edadMinima.includes(texto) ||
      edadMaxima.includes(texto)
    );
  });

  // =====================================================
  // EDAD
  // =====================================================

  const mostrarEdad = (categoria) => {
    const minima = categoria.edad_minima;

    const maxima = categoria.edad_maxima;

    if (
      minima === null ||
      minima === undefined ||
      maxima === null ||
      maxima === undefined
    ) {
      return "Sin definir";
    }

    return `${minima} a ${maxima} años`;
  };

  // =====================================================
  // SEXO
  // =====================================================

  const mostrarSexo = (sexo) => {
    if (!sexo) {
      return "-";
    }

    return sexo.charAt(0).toUpperCase() + sexo.slice(1);
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="col-lg-11 mx-auto">
        {/* =================================================
            BREADCRUMB Y TÍTULO
        ================================================= */}

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

        {/* =================================================
            BOTONES
        ================================================= */}

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

        {/* =================================================
            TABLA
        ================================================= */}

        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <strong>Categorías registradas</strong>

            <input
              type="text"
              className="form-control"
              style={{
                maxWidth: "260px",
              }}
              placeholder="Buscar categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="card-body">
            {categorias.length === 0 ? (
              <div className="alert alert-info mb-0">
                No existen categorías registradas.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Edad permitida</th>
                      <th>Sexo</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {categoriasFiltradas.length > 0 ? (
                      categoriasFiltradas.map((categoria) => (
                        <tr key={categoria.id}>
                          {/* NOMBRE */}
                          <td>
                            <strong>{categoria.nombre}</strong>
                          </td>

                          {/* DESCRIPCIÓN */}
                          <td
                            style={{
                              maxWidth: "280px",
                            }}
                          >
                            {categoria.descripcion ? (
                              <span>{categoria.descripcion}</span>
                            ) : (
                              <span className="text-muted">
                                Sin descripción
                              </span>
                            )}
                          </td>

                          {/* EDAD */}
                          <td>
                            <span className="badge bg-secondary">
                              {mostrarEdad(categoria)}
                            </span>
                          </td>

                          {/* SEXO */}
                          <td>
                            {categoria.sexo ? (
                              <span className="badge bg-info text-dark">
                                {mostrarSexo(categoria.sexo)}
                              </span>
                            ) : (
                              <span className="text-muted">Sin definir</span>
                            )}
                          </td>

                          {/* ESTADO */}
                          <td>
                            {categoria.estado === "activo" ? (
                              <span className="badge bg-success">Visible</span>
                            ) : (
                              <span className="badge bg-danger">Oculto</span>
                            )}
                          </td>

                          {/* ACCIONES */}
                          <td>
                            <div className="d-flex gap-2">
                              <Link
                                to={`/panel/admin/categorias/editar/${categoria.id}`}
                                className="btn btn-primary btn-sm"
                              >
                                Editar
                              </Link>

                              <button
                                type="button"
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
                        <td colSpan="6" className="text-center text-muted py-4">
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

        {/* =================================================
            MODAL AYUDA
        ================================================= */}

        {showHelp && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1050,
            }}
          >
            <div
              className="bg-white p-4 rounded shadow"
              style={{
                maxWidth: "500px",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>¿Cómo funciona este apartado?</h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowHelp(false)}
                />
              </div>

              <p>
                Desde aquí podés consultar y administrar las categorías
                disponibles para las competencias.
              </p>

              <p>
                Cada categoría define un rango de edad y sexo permitido para los
                jugadores.
              </p>

              <p className="mb-0">
                Una categoría oculta deja de estar disponible para futuras
                configuraciones, pero conserva la información histórica asociada
                a las competencias donde ya fue utilizada.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategorias;