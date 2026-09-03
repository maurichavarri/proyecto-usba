import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MisInscripciones = () => {
  const navigate = useNavigate();

  // =========================
  // PAGINACIÓN
  // =========================

  const [paginaActual, setPaginaActual] = useState(1);

  const inscripcionesPorPagina = 10;

  // =========================
  // DATOS
  // =========================

  const [inscripciones, setInscripciones] = useState([]);

  const [showHelp, setShowHelp] = useState(false);

  const [mensaje, setMensaje] = useState("");

  const [busqueda, setBusqueda] = useState("");

  // =========================
  // MODAL MOTIVO RECHAZO
  // =========================

  const [inscripcionRechazada, setInscripcionRechazada] = useState(null);

  // =========================
  // CARGAR
  // =========================

  useEffect(() => {
    obtenerInscripciones();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  // =========================
  // OBTENER INSCRIPCIONES
  // =========================

  const obtenerInscripciones = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/v1/delegado/inscripciones",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener inscripciones.");
      }

      setInscripciones(data);
    } catch (error) {
      console.error(error);

      setMensaje(error.message || "Error al obtener inscripciones.");
    }
  };

  // =========================
  // FILTRO
  // =========================

  const inscripcionesFiltradas = inscripciones.filter((inscripcion) => {
    const texto = busqueda.trim().toLowerCase();

    const equipo = inscripcion.Equipo?.nombre?.toLowerCase() || "";

    const torneo =
      inscripcion.torneoCategoria?.torneo?.nombre?.toLowerCase() || "";

    const categoria =
      inscripcion.torneoCategoria?.categoria?.nombre?.toLowerCase() || "";

    const estado = inscripcion.estado?.toLowerCase() || "";

    return (
      equipo.includes(texto) ||
      torneo.includes(texto) ||
      categoria.includes(texto) ||
      estado.includes(texto)
    );
  });

  // =========================
  // PAGINACIÓN
  // =========================

  const totalPaginas = Math.ceil(
    inscripcionesFiltradas.length / inscripcionesPorPagina,
  );

  const indiceInicio = (paginaActual - 1) * inscripcionesPorPagina;

  const indiceFin = indiceInicio + inscripcionesPorPagina;

  const inscripcionesPaginadas = inscripcionesFiltradas.slice(
    indiceInicio,
    indiceFin,
  );

  // =========================
  // FORMATEAR FECHA DATEONLY
  // =========================

  const formatearFecha = (fecha) => {
    if (!fecha) {
      return "-";
    }

    const fechaLimpia = String(fecha).split("T")[0];

    const partes = fechaLimpia.split("-");

    if (partes.length !== 3) {
      return fecha;
    }

    const [anio, mes, dia] = partes;

    return `${dia}/${mes}/${anio}`;
  };

  // =========================
  // BADGE ESTADO
  // =========================

  const obtenerBadgeEstado = (estado) => {
    switch (estado) {
      case "confirmado":
        return "badge bg-success";

      case "rechazado":
        return "badge bg-danger";

      case "cancelado":
        return "badge bg-secondary";

      default:
        return "badge bg-warning text-dark";
    }
  };

  // =========================
  // TEXTO ESTADO
  // =========================

  const obtenerTextoEstado = (estado) => {
    switch (estado) {
      case "confirmado":
        return "Confirmado";

      case "rechazado":
        return "Rechazado";

      case "cancelado":
        return "Cancelado";

      default:
        return "Pendiente";
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="col-lg-10 mx-auto">
        {/* =========================
            BREADCRUMB Y TÍTULO
        ========================= */}

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

            <span className="text-muted">Mis Inscripciones</span>
          </nav>

          <div className="d-flex align-items-center mb-2">
            <h3 className="fw-bold me-2 mb-0">Mis Inscripciones</h3>

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

        {/* =========================
            BOTONES
        ========================= */}

        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => navigate("/panel/delegado")}
          >
            ← Volver
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/panel/delegado/inscripciones/crear")}
          >
            + Nueva inscripción
          </button>
        </div>

        {/* =========================
            MENSAJE ERROR
        ========================= */}

        {mensaje && <div className="alert alert-danger">{mensaje}</div>}

        {/* =========================
            TABLA
        ========================= */}

        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center gap-3 flex-wrap">
            <strong>Historial de inscripciones</strong>

            {totalPaginas > 1 && (
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  disabled={paginaActual === 1}
                  onClick={() => setPaginaActual(paginaActual - 1)}
                >
                  Anterior
                </button>

                <span>
                  Página {paginaActual} de {totalPaginas}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  disabled={paginaActual === totalPaginas}
                  onClick={() => setPaginaActual(paginaActual + 1)}
                >
                  Siguiente
                </button>
              </div>
            )}

            <input
              type="text"
              className="form-control w-auto"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="card-body">
            {inscripciones.length === 0 ? (
              <div className="alert alert-info mb-0">
                <p className="mb-2">No tenés inscripciones registradas.</p>
              </div>
            ) : inscripcionesFiltradas.length === 0 ? (
              <div className="text-center text-muted py-3">
                No se encontraron inscripciones.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Equipo</th>

                      <th>Torneo</th>

                      <th>Categoría</th>

                      <th>Fecha</th>

                      <th>Estado</th>

                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {inscripcionesPaginadas.map((inscripcion) => (
                      <tr key={inscripcion.id}>
                        {/* EQUIPO */}

                        <td>
                          <strong>{inscripcion.Equipo?.nombre || "-"}</strong>
                        </td>

                        {/* TORNEO */}

                        <td>
                          {inscripcion.torneoCategoria?.torneo?.nombre || "-"}
                        </td>

                        {/* CATEGORÍA */}

                        <td>
                          <strong>
                            {inscripcion.torneoCategoria?.categoria?.nombre ||
                              "-"}
                          </strong>
                        </td>

                        {/* FECHA */}

                        <td>{formatearFecha(inscripcion.fecha)}</td>

                        {/* ESTADO */}

                        <td>
                          <span
                            className={obtenerBadgeEstado(inscripcion.estado)}
                          >
                            {obtenerTextoEstado(inscripcion.estado)}
                          </span>
                        </td>

                        {/* ACCIONES */}

                        <td>
                          {inscripcion.estado === "rechazado" ? (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() =>
                                setInscripcionRechazada(inscripcion)
                              }
                            >
                              Ver motivo
                            </button>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            MODAL MOTIVO DE RECHAZO
        ===================================================== */}

        {inscripcionRechazada && (
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
                maxWidth: "550px",
                overflow: "hidden",
              }}
            >
              {/* CABECERA */}

              <div className="p-4 pb-2 text-center">
                <div
                  className="text-danger mb-3"
                  style={{
                    fontSize: "3rem",
                  }}
                >
                  ⚠
                </div>

                <h4 className="mb-2">Motivo del rechazo</h4>

                <p className="text-muted mb-0">
                  La inscripción de{" "}
                  <strong>{inscripcionRechazada.Equipo?.nombre}</strong> no fue
                  aceptada.
                </p>
              </div>

              {/* DATOS INSCRIPCIÓN */}

              <div className="px-4">
                <div className="alert alert-light border">
                  <p className="mb-2">
                    <strong>Equipo:</strong>{" "}
                    {inscripcionRechazada.Equipo?.nombre || "-"}
                  </p>

                  <p className="mb-2">
                    <strong>Torneo:</strong>{" "}
                    {inscripcionRechazada.torneoCategoria?.torneo?.nombre ||
                      "-"}
                  </p>

                  <p className="mb-0">
                    <strong>Categoría:</strong>{" "}
                    {inscripcionRechazada.torneoCategoria?.categoria?.nombre ||
                      "-"}
                  </p>
                </div>
              </div>

              {/* MOTIVO */}

              <div className="px-4 pb-4">
                <label className="form-label fw-semibold">
                  Mensaje del administrador
                </label>

                <div
                  className="border rounded p-3"
                  style={{
                    backgroundColor: "#f8f9fa",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {inscripcionRechazada.motivo_rechazo ||
                    "No se informó un motivo para esta inscripción."}
                </div>

                {/* INFORMACIÓN */}

                <div className="alert alert-info mt-3 mb-0">
                  <strong>¿Qué podés hacer ahora?</strong>
                  <br />
                  El equipo volvió a quedar habilitado para modificar su
                  plantel. Si el período de inscripción continúa abierto, podés
                  corregir lo necesario y presentar una nueva solicitud.
                </div>
              </div>

              {/* PIE */}

              <div className="border-top p-3 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setInscripcionRechazada(null)}
                >
                  Cerrar
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setInscripcionRechazada(null);

                    navigate("/panel/delegado/inscripciones/crear");
                  }}
                >
                  Nueva inscripción
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            MODAL AYUDA
        ===================================================== */}

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
                maxWidth: "500px",
                width: "100%",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">¿Cómo funciona?</h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowHelp(false)}
                />
              </div>

              <p>
                Desde esta sección podés consultar todas las solicitudes de
                inscripción realizadas por tus equipos.
              </p>

              <p>
                Una inscripción pendiente se encuentra a la espera de la
                decisión del administrador. Mientras permanezca en ese estado,
                el plantel no podrá ser modificado.
              </p>

              <p>
                Si la inscripción es confirmada, el equipo participará en la
                competencia y el plantel permanecerá bloqueado hasta que esta
                finalice.
              </p>

              <p>
                Si la inscripción es rechazada, podrás consultar el motivo
                indicado por el administrador. El equipo volverá a quedar
                habilitado para realizar correcciones.
              </p>

              <p className="mb-0">
                Si el período de inscripción continúa abierto, podrás presentar
                una nueva solicitud.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisInscripciones;