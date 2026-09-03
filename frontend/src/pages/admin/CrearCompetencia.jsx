import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CrearCompetencia = () => {
  const navigate = useNavigate();

  const [torneos, setTorneos] = useState([]);

  const [categorias, setCategorias] = useState([]);

  const [torneoId, setTorneoId] = useState("");

  const [categoriaId, setCategoriaId] = useState("");

  const [arancel, setArancel] = useState("");

  const [formatoCompetencia, setFormatoCompetencia] = useState("solo_liga");

  const [mensaje, setMensaje] = useState("");

  const [tipoMensaje, setTipoMensaje] = useState("success");

  const [guardando, setGuardando] = useState(false);

  // =========================
  // CARGAR
  // =========================

  useEffect(() => {
    obtenerTorneos();
    obtenerCategorias();
  }, []);

  // =========================
  // OBTENER TORNEOS
  // =========================

  const obtenerTorneos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/torneos");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener los torneos.");
      }

      setTorneos(data);
    } catch (error) {
      console.error(error);

      setTipoMensaje("danger");

      setMensaje(error.message);
    }
  };

  // =========================
  // OBTENER CATEGORÍAS
  // =========================

  const obtenerCategorias = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/categorias");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener las categorías.");
      }

      setCategorias(data);
    } catch (error) {
      console.error(error);

      setTipoMensaje("danger");

      setMensaje(error.message);
    }
  };

  // =========================
  // CREAR COMPETENCIA
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setGuardando(true);
      setMensaje("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/v1/torneo-categorias",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            torneo_id: torneoId,

            categoria_id: categoriaId,

            arancel: Number(arancel),

            formato_competencia: formatoCompetencia,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setTipoMensaje("danger");

        setMensaje(data.message || "No fue posible crear la competencia.");

        return;
      }

      setTipoMensaje("success");

      setMensaje("Competencia creada correctamente.");

      // Limpiar formulario
      setTorneoId("");
      setCategoriaId("");
      setArancel("");
      setFormatoCompetencia("solo_liga");
    } catch (error) {
      console.error(error);

      setTipoMensaje("danger");

      setMensaje("Ocurrió un error al crear la competencia.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="col-lg-10 mx-auto">
        {/* =========================
                    BREADCRUMB
                ========================= */}

        <nav
          className="mb-2"
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
            Panel del Administrador
          </span>

          {" > "}

          <span
            className="text-muted"
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate("/panel/admin/torneo-categorias")}
          >
            Competencias
          </span>

          {" > "}

          <span className="text-muted">Crear Competencia</span>
        </nav>

        {/* =========================
                    TÍTULO
                ========================= */}

        <div className="mb-4">
          <h2 className="fw-bold mb-1">Crear Competencia</h2>

          <p className="text-muted mb-0">
            Seleccioná un torneo y una categoría para crear una nueva
            competencia.
          </p>
        </div>

        {/* =========================
                    VOLVER
                ========================= */}

        <button
          type="button"
          className="btn btn-dark mb-4"
          onClick={() => navigate("/panel/admin/torneo-categorias")}
        >
          ← Volver a Competencias
        </button>

        {/* =========================
                    FORMULARIO
                ========================= */}

        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white">
            <strong>Datos de la competencia</strong>
          </div>

          <div className="card-body p-4">
            {/* MENSAJE */}

            {mensaje && (
              <div className={`alert alert-${tipoMensaje}`}>{mensaje}</div>
            )}

            <form onSubmit={handleSubmit}>
              {/* =========================
                                TORNEO
                            ========================= */}

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Torneo
                  <span className="text-danger"> *</span>
                </label>

                <select
                  className="form-select"
                  value={torneoId}
                  disabled={guardando}
                  onChange={(e) => setTorneoId(e.target.value)}
                  required
                >
                  <option value="">Seleccionar torneo</option>

                  {torneos.map((torneo) => (
                    <option key={torneo.id} value={torneo.id}>
                      {torneo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* =========================
                                CATEGORÍA
                            ========================= */}

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Categoría
                  <span className="text-danger"> *</span>
                </label>

                <select
                  className="form-select"
                  value={categoriaId}
                  disabled={guardando}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  required
                >
                  <option value="">Seleccionar categoría</option>

                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}

                      {categoria.edad_minima !== undefined &&
                      categoria.edad_maxima !== undefined
                        ? ` — ${categoria.edad_minima} a ${categoria.edad_maxima} años`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* =========================
                                ARANCEL
                            ========================= */}

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Arancel
                  <span className="text-danger"> *</span>
                </label>

                <div className="input-group">
                  <span className="input-group-text">$</span>

                  <input
                    type="number"
                    className="form-control"
                    value={arancel}
                    min="0"
                    step="0.01"
                    disabled={guardando}
                    onChange={(e) => setArancel(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* =========================
                                FORMATO
                            ========================= */}

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Formato de competencia
                  <span className="text-danger"> *</span>
                </label>

                <select
                  className="form-select"
                  value={formatoCompetencia}
                  disabled={guardando}
                  onChange={(e) => setFormatoCompetencia(e.target.value)}
                  required
                >
                  <option value="solo_liga">Solo Liga</option>

                  <option value="playoff_4">Liga + Playoff Top 4</option>

                  <option value="playoff_8">Liga + Playoff Top 8</option>
                </select>

                <small className="text-muted">
                  El formato determina cómo continuará la competencia una vez
                  finalizada la etapa regular.
                </small>
              </div>

              {/* =========================
                                AVISO
                            ========================= */}

              <div className="alert alert-warning">
                <strong>Importante:</strong> Una vez creada la competencia,
                quedará registrada como relación entre el torneo y la categoría.
              </div>

              {/* =========================
                                BOTONES
                            ========================= */}

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={guardando}
                  onClick={() => navigate("/panel/admin/torneo-categorias")}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={guardando}
                >
                  {guardando ? "Creando..." : "Crear Competencia"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearCompetencia;