import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CrearInscripcion = () => {
  const navigate = useNavigate();

  const [equipos, setEquipos] = useState([]);
  const [torneoCategorias, setTorneoCategorias] = useState([]);
  const [equipoId, setEquipoId] = useState("");
  const [torneoCategoriaId, setTorneoCategoriaId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // MODAL ÉXITO

  const [mostrarModalExito, setMostrarModalExito] = useState(false);

  // MODAL DUPLICADOS

  const [mostrarModalDuplicados, setMostrarModalDuplicados] = useState(false);

  const [jugadoresDuplicados, setJugadoresDuplicados] = useState([]);

  // MODAL NO APTOS

  const [mostrarModalNoAptos, setMostrarModalNoAptos] = useState(false);

  const [jugadoresNoAptos, setJugadoresNoAptos] = useState([]);

  const [requisitosCategoria, setRequisitosCategoria] = useState(null);

  const [puedeEditarPlantel, setPuedeEditarPlantel] = useState(false);

  useEffect(() => {
    obtenerEquipos();
    obtenerTorneoCategorias();
  }, []);

  // =========================
  // EQUIPOS
  // =========================

  const obtenerEquipos = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/v1/delegado/equipos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener equipos");
      }

      setEquipos(data);
    } catch (error) {
      console.error(error);

      setMensaje(error.message);
    }
  };

  // =========================
  // COMPETENCIAS
  // =========================

  const obtenerTorneoCategorias = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/v1/torneo-categorias/disponibles",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener competencias");
      }

      setTorneoCategorias(data);
    } catch (error) {
      console.error(error);

      setMensaje(error.message);
    }
  };

  // =========================
  // NUMERO DE PLANTEL
  // =========================

  // =========================
  // COMPETENCIA SELECCIONADA
  // =========================

  const competenciaSeleccionada = torneoCategorias.find(
    (tc) => Number(tc.id) === Number(torneoCategoriaId),
  );

  // =========================
  // CREAR INSCRIPCIÓN
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensaje("");

    if (!equipoId) {
      setMensaje("Debés seleccionar un equipo.");
      return;
    }

    if (!torneoCategoriaId) {
      setMensaje("Debés seleccionar una competencia.");
      return;
    }

    try {
      setEnviando(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/v1/delegado/inscripciones",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            equipo_id: equipoId,

            torneo_categoria_id: torneoCategoriaId,
          }),
        },
      );

      const data = await response.json();

      // =========================
      // ERRORES
      // =========================

      if (!response.ok) {
        // JUGADORES DUPLICADOS

        if (data.code === "JUGADORES_DUPLICADOS") {
          setJugadoresDuplicados(data.jugadores || []);

          setMostrarModalDuplicados(true);

          return;
        }

        // JUGADORES NO APTOS

        if (data.code === "JUGADORES_NO_APTOS") {
          setJugadoresNoAptos(data.jugadores || []);

          setRequisitosCategoria(data.requisitos || null);

          setPuedeEditarPlantel(data.puede_editar_plantel === true);

          setMostrarModalNoAptos(true);

          return;
        }

        // OTRO ERROR

        setMensaje(data.message || "Error al registrar la inscripción");

        return;
      }

      // =========================
      // ÉXITO
      // =========================

      setMostrarModalExito(true);
    } catch (error) {
      console.error(error);

      setMensaje("Ocurrió un error al registrar la inscripción.");
    } finally {
      setEnviando(false);
    }
  };

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
              onClick={() => navigate("/panel/delegado/inscripciones")}
            >
              Mis Inscripciones
            </span>

            {" > "}

            <span className="text-muted">Nueva Inscripción</span>
          </nav>

          <div className="d-flex align-items-center mb-2">
            <h3 className="fw-bold me-2 mb-0">Nueva Inscripcion</h3>

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

        <button
          type="button"
          className="btn btn-dark mb-3"
          onClick={() => navigate("/panel/delegado/inscripciones")}
        >
          ← Volver
        </button>

        {/* FORMULARIO */}

        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white">
            <strong>Registrar inscripción</strong>
          </div>

          <div className="card-body p-4">
            {mensaje && <div className="alert alert-danger">{mensaje}</div>}

            <form onSubmit={handleSubmit}>
              {/* EQUIPO */}

              <div className="mb-3">
                <label className="form-label">Equipo / Plantel</label>

                <select
                  className="form-select"
                  value={equipoId}
                  onChange={(e) => setEquipoId(e.target.value)}
                  required
                >
                  <option value="">Seleccionar equipo</option>

                  {equipos.map((equipo) => (
                    <option key={equipo.id} value={equipo.id}>
                      {equipo.nombre}
                      {" — "}
                      {equipo.cantidad_jugadores} jugadores
                    </option>
                  ))}
                </select>
              </div>

              {/* COMPETENCIA */}
              <div className="mb-3">
                <label className="form-label">Torneo / Categoría</label>

                <select
                  className="form-select"
                  value={torneoCategoriaId}
                  onChange={(e) => setTorneoCategoriaId(e.target.value)}
                  required
                >
                  <option value="">Seleccionar competencia</option>

                  {torneoCategorias.map((tc) => (
                    <option key={tc.id} value={tc.id}>
                      {tc.torneo?.nombre}
                      {" — "}
                      {tc.categoria?.nombre}
                      {" — "}
                      {"Arancel: $"}
                      {Number(tc.arancel || 0).toLocaleString("es-AR")}
                    </option>
                  ))}
                </select>
              </div>

              {/* INFORMACIÓN CATEGORÍA */}

              {competenciaSeleccionada && (
                <div className="alert alert-light border mb-4">
                  <strong>Requisitos de la competencia</strong>

                  <hr />

                  <div>
                    Categoría:{" "}
                    <strong>{competenciaSeleccionada.categoria?.nombre}</strong>
                  </div>

                  {competenciaSeleccionada.categoria?.edad_minima !==
                    undefined &&
                    competenciaSeleccionada.categoria?.edad_maxima !==
                      undefined && (
                      <div>
                        Edad permitida:{" "}
                        <strong>
                          {competenciaSeleccionada.categoria?.edad_minima}

                          {" a "}

                          {competenciaSeleccionada.categoria?.edad_maxima}

                          {" años"}
                        </strong>
                      </div>
                    )}

                  {competenciaSeleccionada.categoria?.sexo && (
                    <div>
                      Sexo:{" "}
                      <strong className="text-capitalize">
                        {competenciaSeleccionada.categoria?.sexo}
                      </strong>
                    </div>
                  )}

                  <div className="mt-2">
                    Arancel:{" "}
                    <strong>
                      $
                      {Number(
                        competenciaSeleccionada.arancel || 0,
                      ).toLocaleString("es-AR")}
                    </strong>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={enviando}
              >
                {enviando ? "Registrando..." : "Registrar inscripción"}
              </button>
            </form>
          </div>
        </div>

        {/* ============================= */}
        {/* MODAL ÉXITO */}
        {/* ============================= */}

        {mostrarModalExito && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "rgba(0,0,0,0.65)",
              zIndex: 1050,
              padding: "20px",
            }}
          >
            <div
              className="bg-white rounded shadow"
              style={{
                width: "100%",
                maxWidth: "500px",
                overflow: "hidden",
              }}
            >
              <div className="text-center p-4">
                <div
                  className="text-success mb-3"
                  style={{
                    fontSize: "3rem",
                  }}
                >
                  ✓
                </div>

                <h4>Registro exitoso</h4>

                <p className="text-muted">
                  La inscripción fue registrada correctamente.
                </p>

                <div className="alert alert-light border text-start">
                  Para abonar el arancel en
                  <strong> efectivo o mediante transferencia</strong>,
                  contactate al número informado en el pie de la página.
                  <br />
                  <br />
                  Una vez realizado el pago, deberás esperar la aprobación del
                  administrador.
                </div>

                <p className="mb-0">Muchas gracias.</p>
              </div>

              <div className="border-top text-end p-3">
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => navigate("/panel/delegado/inscripciones")}
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================= */}
        {/* MODAL DUPLICADOS */}
        {/* ============================= */}

        {mostrarModalDuplicados && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "rgba(0,0,0,0.65)",
              zIndex: 1050,
              padding: "20px",
            }}
          >
            <div
              className="bg-white rounded shadow p-4"
              style={{
                width: "100%",
                maxWidth: "550px",
              }}
            >
              <div className="text-center">
                <div
                  className="text-warning mb-3"
                  style={{
                    fontSize: "3rem",
                  }}
                >
                  ⚠
                </div>

                <h4>Jugador ya inscripto</h4>

                <p className="text-muted">
                  No es posible registrar la inscripción porque uno o más
                  jugadores ya participan en esta competencia.
                </p>
              </div>

              <div className="alert alert-warning">
                <strong>Jugadores detectados:</strong>

                <ul className="mb-0 mt-2">
                  {jugadoresDuplicados.map((jugador, index) => (
                    <li key={jugador.id || index}>
                      <strong>
                        {jugador.nombre}

                        {jugador.apellido ? ` ${jugador.apellido}` : ""}
                      </strong>

                      {jugador.equipo && (
                        <>
                          {" · Ya participa en "}
                          {jugador.equipo}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <p>
                Revisá el plantel antes de volver a intentar la inscripción.
              </p>

              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => {
                    setMostrarModalDuplicados(false);

                    setJugadoresDuplicados([]);
                  }}
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL JUGADORES NO APTOS */}
        {mostrarModalNoAptos && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "rgba(0,0,0,0.65)",
              zIndex: 1050,
              padding: "20px",
            }}
          >
            <div
              className="bg-white rounded shadow"
              style={{
                width: "100%",
                maxWidth: "650px",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <div className="text-center p-4 pb-2">
                <div
                  className="text-warning"
                  style={{
                    fontSize: "3rem",
                  }}
                >
                  ⚠
                </div>

                <h4>El plantel no cumple los requisitos</h4>

                <p className="text-muted">
                  No es posible registrar la inscripción porque uno o más
                  jugadores no cumplen las condiciones de la categoría.
                </p>
              </div>

              {requisitosCategoria && (
                <div className="px-4">
                  <div className="alert alert-light border">
                    Edad permitida:{" "}
                    <strong>
                      {requisitosCategoria.edad_minima}

                      {" a "}

                      {requisitosCategoria.edad_maxima}

                      {" años"}
                    </strong>
                    <br />
                    Sexo:{" "}
                    <strong className="text-capitalize">
                      {requisitosCategoria.sexo}
                    </strong>
                  </div>
                </div>
              )}

              <div className="px-4">
                {jugadoresNoAptos.map((jugador) => (
                  <div key={jugador.id} className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between gap-3">
                        <div>
                          <h6>
                            #{jugador.dorsal}
                            {" · "}
                            {jugador.nombre} {jugador.apellido}
                          </h6>

                          <ul className="text-danger mb-0">
                            {jugador.motivos.map((motivo, index) => (
                              <li key={index}>{motivo}</li>
                            ))}
                          </ul>
                        </div>

                        {puedeEditarPlantel && (
                          <button
                            type="button"
                            className="btn btn-outline-dark btn-sm align-self-start"
                            onClick={() =>
                              navigate(
                                `/panel/delegado/equipos/${equipoId}/jugadores/${jugador.id}/editar`,
                              )
                            }
                          >
                            Editar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 pb-3">
                {puedeEditarPlantel ? (
                  <div className="alert alert-info mb-0">
                    Podés corregir los datos desde
                    <strong> Mis Equipos → Jugadores → Editar</strong>.
                  </div>
                ) : (
                  <div className="alert alert-warning mb-0">
                    El plantel se encuentra bloqueado y ya no puede modificarse.
                  </div>
                )}
              </div>

              <div className="border-top d-flex justify-content-end gap-2 p-3">
                {puedeEditarPlantel && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      navigate(`/panel/delegado/equipos/${equipoId}/jugadores`)
                    }
                  >
                    Ir al plantel
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => {
                    setMostrarModalNoAptos(false);
                    setJugadoresNoAptos([]);
                    setRequisitosCategoria(null);
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

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
              <p>Desde esta sección podés inscribir tu equipo en una competición.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrearInscripcion;
