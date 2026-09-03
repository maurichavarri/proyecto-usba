import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminTorneoCategorias = () => {
  const navigate = useNavigate();

  const [showHelp, setShowHelp] = useState(false);

  const [torneoCategorias, setTorneoCategorias] = useState([]);

  const [busqueda, setBusqueda] = useState("");

  const [mensaje, setMensaje] = useState("");

  const [cargando, setCargando] = useState(true);

  // =========================
  // CARGAR COMPETENCIAS
  // =========================

  useEffect(() => {
    obtenerTorneoCategorias();
  }, []);

  // =========================
  // OBTENER COMPETENCIAS
  // =========================

  const obtenerTorneoCategorias = async () => {
    try {
      setCargando(true);
      setMensaje("");

      const response = await fetch(
        "http://localhost:3000/api/v1/torneo-categorias",
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener las competencias.");
      }

      setTorneoCategorias(data);
    } catch (error) {
      console.error(error);

      setMensaje(error.message || "Error al obtener las competencias.");
    } finally {
      setCargando(false);
    }
  };

  // =========================
  // FILTRO
  // =========================

  const torneoCategoriasFiltradas = torneoCategorias.filter((tc) => {
    const texto = busqueda.trim().toLowerCase();

    const nombreTorneo = tc.torneo?.nombre?.toLowerCase() || "";

    const nombreCategoria = tc.categoria?.nombre?.toLowerCase() || "";

    const formato = tc.formato_competencia?.toLowerCase() || "";

    const estado = tc.estado_competencia?.toLowerCase() || "";

    return (
      nombreTorneo.includes(texto) ||
      nombreCategoria.includes(texto) ||
      formato.includes(texto) ||
      estado.includes(texto)
    );
  });

  // =========================
  // FORMATO
  // =========================

  const obtenerFormato = (formato) => {
    switch (formato) {
      case "solo_liga":
        return "Solo Liga";

      case "playoff_4":
        return "Liga + Playoff Top 4";

      case "playoff_8":
        return "Liga + Playoff Top 8";

      default:
        return "-";
    }
  };

  // =========================
  // ESTADO
  // =========================

  const obtenerEstado = (estado) => {
    switch (estado) {
      case "configuracion":
        return <span className="badge bg-secondary">En Configuración</span>;

      case "en_curso":
        return <span className="badge bg-success">En Curso</span>;

      case "finalizada":
      case "finalizado":
        return <span className="badge bg-dark">Finalizado</span>;

      default:
        return (
          <span className="badge bg-secondary">{estado || "Sin estado"}</span>
        );
    }
  };

  // =========================
  // ARANCEL
  // =========================

  const formatearArancel = (arancel) => {
    const valor = Number(arancel);

    if (Number.isNaN(valor)) {
      return "$0";
    }

    return valor.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="col-lg-10 mx-auto">
        {/* =========================
                    TÍTULO
                ========================= */}

        <div className="d-flex align-items-center mb-2">
          <h2 className="me-2 mb-0">Competencias</h2>

          <span
            className="text-primary"
            style={{
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
            title="Ayuda"
            onClick={() => setShowHelp(true)}
          >
            ❓
          </span>
        </div>

        {/* =========================
                    BREADCRUMB
                ========================= */}

        <nav
          className="mb-3"
          style={{
            fontSize: "0.9rem",
          }}
        >
          <span
            className="text-primary"
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate("/panel/admin")}
          >
            Panel del Administrador
          </span>

          {" > "}

          <span className="text-muted">Competencias</span>
        </nav>

        {/* =========================
                    BOTONES SUPERIORES
                ========================= */}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => navigate("/panel/admin")}
          >
            ← Regresar al panel
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/panel/admin/torneo-categorias/crear")}
          >
            + Crear Competencia
          </button>
        </div>

        {/* =========================
                    ERROR
                ========================= */}

        {mensaje && <div className="alert alert-danger">{mensaje}</div>}

        {/* =========================
                    LISTADO
                ========================= */}

        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center gap-3 flex-wrap">
            <strong>Competencias registradas</strong>

            <input
              type="text"
              className="form-control w-auto"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="card-body">
            {/* CARGANDO */}

            {cargando ? (
              <div className="text-center py-4">
                <div className="spinner-border" role="status" />

                <p className="text-muted mt-3 mb-0">Cargando competencias...</p>
              </div>
            ) : torneoCategorias.length === 0 ? (
              /* SIN COMPETENCIAS */

              <div className="text-center py-5">
                <h5>No existen competencias creadas</h5>

                <p className="text-muted mb-3">
                  Creá una competencia relacionando un torneo con una categoría.
                </p>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    navigate("/panel/admin/torneo-categorias/crear")
                  }
                >
                  + Crear primera competencia
                </button>
              </div>
            ) : torneoCategoriasFiltradas.length === 0 ? (
              /* SIN RESULTADOS */

              <div className="text-center text-muted py-4">
                No se encontraron competencias.
              </div>
            ) : (
              /* TABLA */

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Torneo</th>

                      <th>Categoría</th>

                      <th>Equipos</th>

                      <th>Formato</th>

                      <th>Estado</th>

                      <th>Arancel</th>

                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {torneoCategoriasFiltradas.map((tc) => (
                      <tr key={tc.id}>
                        {/* TORNEO */}

                        <td>
                          <strong>{tc.torneo?.nombre || "-"}</strong>
                        </td>

                        {/* CATEGORÍA */}

                        <td>{tc.categoria?.nombre || "-"}</td>

                        {/* EQUIPOS */}

                        <td>
                          {Number(tc.equipos_inscriptos) >= 4 ? (
                            <span className="badge bg-success">
                              {tc.equipos_inscriptos} equipos
                            </span>
                          ) : (
                            <span className="badge bg-danger">
                              {tc.equipos_inscriptos || 0}
                              /4 mínimos
                            </span>
                          )}
                        </td>

                        {/* FORMATO */}

                        <td>{obtenerFormato(tc.formato_competencia)}</td>

                        {/* ESTADO */}

                        <td>{obtenerEstado(tc.estado_competencia)}</td>

                        {/* ARANCEL */}

                        <td>
                          <strong>{formatearArancel(tc.arancel)}</strong>
                        </td>

                        {/* ACCIONES */}

                        <td>
                          <div className="d-flex gap-2 flex-wrap">
                            <Link
                              to={`/panel/admin/fixture/${tc.id}`}
                              className="btn btn-dark btn-sm"
                            >
                              Ver Fixture
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* =========================
                    MODAL AYUDA
                ========================= */}

        {showHelp && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1050,
              padding: "20px",
            }}
          >
            <div
              className="bg-white p-4 rounded shadow"
              style={{
                maxWidth: "550px",
                width: "100%",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">¿Cómo funciona este apartado?</h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowHelp(false)}
                />
              </div>

              <p>
                Desde esta sección podés consultar todas las competencias
                creadas en el sistema.
              </p>

              <p>
                Una competencia surge de la relación entre un torneo y una
                categoría, y posee su propio formato, arancel, equipos
                inscriptos y estado.
              </p>

              <p className="mb-0">
                Para registrar una nueva, utilizá el botón{" "}
                <strong>Crear Competencia</strong>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTorneoCategorias;