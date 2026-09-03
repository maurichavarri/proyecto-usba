import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CrearEquipo = () => {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [dorsalDelegado, setDorsalDelegado] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // =========================
  // VALIDACIÓN
  // =========================

  const validarFormulario = () => {
    if (!nombre.trim()) {
      return "El nombre del equipo es obligatorio.";
    }

    if (dorsalDelegado === "") {
      return "Debés indicar tu dorsal para este equipo.";
    }

    const dorsal = Number(dorsalDelegado);

    if (!Number.isInteger(dorsal)) {
      return "El dorsal debe ser un número entero.";
    }

    if (dorsal < 0 || dorsal > 99) {
      return "El dorsal debe estar entre 0 y 99.";
    }

    return "";
  };

  // =========================
  // CREAR EQUIPO
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      setTipoMensaje("error");
      setMensaje(errorValidacion);
      return;
    }

    try {
      setGuardando(true);
      setMensaje("");
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/v1/delegado/equipos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            dorsal_delegado: Number(dorsalDelegado),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setTipoMensaje("error");
        setMensaje(data.message || "Error al crear el equipo.");
        return;
      }
      setTipoMensaje("exito");
      setMensaje("¡Equipo creado correctamente!");
      setTimeout(() => {
        navigate("/panel/delegado/equipos");
      }, 1200);
    } catch (error) {
      console.error(error);
      setTipoMensaje("error");
      setMensaje("Ocurrió un error al crear el equipo.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="col-lg-10 mx-auto">

        {/* BREADCRUMB */}
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
              onClick={() => navigate("/panel/delegado")}
            >
              Panel de Delegado
            </span>

            {" > "}

            <span
              className="text-muted"
              style={{
                cursor: "pointer",
              }}
              onClick={() => navigate("/panel/delegado/equipos")}
            >
              Mis Equipos
            </span>

            {" > "}

            <span className="text-muted">Crear Equipo</span>
          </nav>

          <div className="d-flex align-items-center mb-2">
            <h3 className="fw-bold me-2 mb-0">Crear Equipo</h3>

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

        {/* MENSAJE */}
        {mensaje && (
          <div
            className={
              tipoMensaje === "exito"
                ? "alert alert-success shadow-sm"
                : "alert alert-danger shadow-sm"
            }
          >
            {mensaje}
          </div>
        )}

        {/* VOLVER */}
        <div className="d-flex justify-content-between mb-3">
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => navigate("/panel/delegado/equipos")}
          >
            ← Volver
          </button>
        </div>

        {/* FORMULARIO */}
        <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
          <form onSubmit={handleSubmit}>

            {/* NOMBRE */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary">
                Nombre del Equipo
              </label>

              <input
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Halcones"
                required
              />

              <small className="text-muted">
                No podés tener dos equipos con el mismo nombre.
              </small>
            </div>

            {/* DESCRIPCIÓN */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary">
                Descripción
              </label>

              <textarea
                className="form-control"
                rows="3"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción opcional del equipo"
              />
            </div>

            {/* DORSAL DELEGADO */}
            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary">
                Tu dorsal en este equipo
              </label>

              <input
                type="number"
                className="form-control"
                value={dorsalDelegado}
                onChange={(e) => setDorsalDelegado(e.target.value)}
                min="0"
                max="99"
                placeholder="Ej: 10"
                required
              />

              <small className="text-muted">
                Como delegado debés formar parte obligatoriamente del plantel.
                Tus datos personales se agregarán automáticamente como jugador.
              </small>
            </div>

            {/* INFORMACIÓN */}
            <div className="alert alert-light border mb-4">
              <strong>¿Qué sucederá al crear el equipo?</strong>
              <br />
              Se creará el equipo y automáticamente quedarás registrado como su
              primer jugador utilizando los datos de tu perfil de delegado.
            </div>

            {/* BOTONES */}
            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={guardando}
              >
                {guardando ? "Creando..." : "Crear equipo"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                disabled={guardando}
                onClick={() => navigate("/panel/delegado/equipos")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        {/* MODAL AYUDA */}
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

              <p>Desde esta sección podés crear un nuevo equipo.</p>
              <ul>
                <li>No podés tener dos equipos con el mismo nombre.</li>
                <li>
                  Como delegado, formarás parte obligatoriamente del equipo.
                </li>
                <li>
                  Solo tenés que elegir tu dorsal. Tus demás datos se obtendrán
                  automáticamente de tu perfil.
                </li>
                <li>El dorsal elegido debe estar entre 0 y 99.</li>
              </ul>
              <p className="mb-0">
                Si posteriormente creás otro equipo, también formarás parte
                obligatoriamente de ese plantel.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrearEquipo;