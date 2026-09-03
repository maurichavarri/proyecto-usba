import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminInscripciones = () => {
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
  const [busqueda, setBusqueda] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  // =========================
  // MENSAJES GENERALES
  // =========================

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("success");

  // =========================
  // MODAL DE DECISIÓN
  // =========================

  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState(null);
  const [accionSeleccionada, setAccionSeleccionada] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [errorModal, setErrorModal] = useState("");
  const [procesando, setProcesando] = useState(false);

  const [inscripcionPlantel, setInscripcionPlantel] = useState(null);
  const [detallePlantel, setDetallePlantel] = useState(null);
  const [cargandoPlantel, setCargandoPlantel] = useState(false);
  const [errorPlantel, setErrorPlantel] = useState("");

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
        "http://localhost:3000/api/v1/admin/inscripciones",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al cargar inscripciones.");
      }

      setInscripciones(data);
    } catch (error) {
      console.error(error);

      setTipoMensaje("danger");

      setMensaje(error.message || "Error al cargar inscripciones.");
    }
  };

  // =========================
  // ABRIR MODAL CONFIRMAR
  // =========================

  const abrirModalConfirmar = (inscripcion) => {
    setInscripcionSeleccionada(inscripcion);
    setAccionSeleccionada("confirmar");
    setMotivoRechazo("");
    setErrorModal("");
  };

  // =========================
  // ABRIR MODAL RECHAZAR
  // =========================

  const abrirModalRechazar = (inscripcion) => {
    setInscripcionSeleccionada(inscripcion);
    setAccionSeleccionada("rechazar");
    setMotivoRechazo("");
    setErrorModal("");
  };

  // =========================
  // CERRAR MODAL
  // =========================

  const cerrarModal = () => {
    if (procesando) {
      return;
    }

    setInscripcionSeleccionada(null);
    setAccionSeleccionada(null);
    setMotivoRechazo("");
    setErrorModal("");
  };

  // =========================
  // FORMATEAR ERRORES BACKEND
  // =========================

  const obtenerMensajeError = (data) => {
    let texto = data.message || "No fue posible procesar la inscripción.";

    if (Array.isArray(data.jugadores) && data.jugadores.length > 0) {
      texto += "\n\nJugadores observados:";

      data.jugadores.forEach((jugador) => {
        texto += `\n• ${jugador.nombre || ""} ${jugador.apellido || ""}`;

        if (Array.isArray(jugador.motivos)) {
          jugador.motivos.forEach((motivo) => {
            texto += `\n   - ${motivo}`;
          });
        }

        if (jugador.equipo) {
          texto += ` (${jugador.equipo})`;
        }
      });
    }

    return texto;
  };

  // =========================
  // CONFIRMAR DECISIÓN
  // =========================

  const procesarDecision = async () => {
    if (!inscripcionSeleccionada || !accionSeleccionada) {
      return;
    }

    // =========================
    // VALIDAR MOTIVO RECHAZO
    // =========================

    if (accionSeleccionada === "rechazar") {
      const motivo = motivoRechazo.trim();

      if (!motivo) {
        setErrorModal("Debe indicar el motivo del rechazo.");

        return;
      }

      if (motivo.length < 5) {
        setErrorModal("El motivo del rechazo debe ser más descriptivo.");

        return;
      }

      if (motivo.length > 500) {
        setErrorModal(
          "El motivo del rechazo no puede superar los 500 caracteres.",
        );

        return;
      }
    }

    try {
      setProcesando(true);
      setErrorModal("");
      setMensaje("");
      const token = localStorage.getItem("token");
      const body = {
        estado: accionSeleccionada === "confirmar" ? "confirmado" : "rechazado",
      };

      if (accionSeleccionada === "rechazar") {
        body.motivo_rechazo = motivoRechazo.trim();
      }

      const response = await fetch(
        `http://localhost:3000/api/v1/admin/inscripciones/${inscripcionSeleccionada.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(body),
        },
      );

      const data = await response.json();

      // =========================
      // ERROR BACKEND
      // =========================

      if (!response.ok) {
        setErrorModal(obtenerMensajeError(data));

        return;
      }

      // =========================
      // ÉXITO
      // =========================

      const fueConfirmada = accionSeleccionada === "confirmar";

      setTipoMensaje("success");

      setMensaje(
        fueConfirmada
          ? "Inscripción confirmada correctamente."
          : "Inscripción rechazada correctamente.",
      );

      // Cerrar modal
      setInscripcionSeleccionada(null);

      setAccionSeleccionada(null);

      setMotivoRechazo("");

      setErrorModal("");

      // Recargar listado
      await obtenerInscripciones();
    } catch (error) {
      console.error(error);

      setErrorModal("Ocurrió un error al procesar la inscripción.");
    } finally {
      setProcesando(false);
    }
  };

  // =========================
  // VER PLANTEL HISTÓRICO
  // =========================

  const abrirModalPlantel = async (inscripcion) => {
    try {
      // Abrimos el modal inmediatamente
      setInscripcionPlantel(inscripcion);

      setDetallePlantel(null);

      setErrorPlantel("");

      setCargandoPlantel(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/api/v1/admin/inscripciones/${inscripcion.id}/plantel`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "No fue posible obtener el plantel histórico.",
        );
      }

      setDetallePlantel(data.inscripcion);
    } catch (error) {
      console.error(error);

      setErrorPlantel(
        error.message || "No fue posible obtener el plantel histórico.",
      );
    } finally {
      setCargandoPlantel(false);
    }
  };

  // =========================
  // CERRAR PLANTEL
  // =========================

  const cerrarModalPlantel = () => {
    setInscripcionPlantel(null);
    setDetallePlantel(null);
    setErrorPlantel("");
    setCargandoPlantel(false);
  };

  // =========================
  // FILTRO
  // =========================

  const inscripcionesFiltradas = inscripciones.filter((inscripcion) => {
    const texto = busqueda.trim().toLowerCase();

    const nombreEquipo = inscripcion.Equipo?.nombre?.toLowerCase() || "";

    const nombreTorneo =
      inscripcion.torneoCategoria?.torneo?.nombre?.toLowerCase() || "";

    const nombreCategoria =
      inscripcion.torneoCategoria?.categoria?.nombre?.toLowerCase() || "";

    const estado = inscripcion.estado?.toLowerCase() || "";

    return (
      nombreEquipo.includes(texto) ||
      nombreTorneo.includes(texto) ||
      nombreCategoria.includes(texto) ||
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

  return (
    <div className="container mt-5 mb-5">
      <div className="col-lg-11 mx-auto">
        {/* =========================
                    TÍTULO
                ========================= */}

        <div className="d-flex align-items-center mb-2">
          <h2 className="me-2">Gestión de Inscripciones</h2>

          <span
            className="text-primary"
            style={{
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
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

          <span className="text-muted">Inscripciones</span>
        </nav>

        {/* =========================
                    VOLVER
                ========================= */}

        <button
          type="button"
          className="btn btn-dark mb-3"
          onClick={() => navigate("/panel/admin")}
        >
          ← Regresar al panel
        </button>

        {/* =========================
                    MENSAJE
                ========================= */}

        {mensaje && (
          <div className={`alert alert-${tipoMensaje}`}>{mensaje}</div>
        )}

        {/* =========================
                    TABLA
                ========================= */}

        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center gap-3 flex-wrap">
            <strong>Inscripciones recibidas</strong>

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
                No existen inscripciones registradas.
              </div>
            ) : inscripcionesFiltradas.length === 0 ? (
              <div className="text-center text-muted py-3">
                No se encontraron inscripciones.
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>Equipo</th>

                        <th>Torneo</th>

                        <th>Categoría</th>

                        <th>Estado</th>

                        <th>Acciones</th>
                      </tr>
                    </thead>

                    <tbody>
                      {inscripcionesPaginadas.map((inscripcion) => (
                        <tr key={inscripcion.id}>
                          <td>
                            <strong>{inscripcion.Equipo?.nombre || "-"}</strong>
                          </td>

                          <td>
                            {inscripcion.torneoCategoria?.torneo?.nombre || "-"}
                          </td>

                          <td>
                            {inscripcion.torneoCategoria?.categoria?.nombre ||
                              "-"}
                          </td>

                          <td>
                            <span
                              className={obtenerBadgeEstado(inscripcion.estado)}
                            >
                              {obtenerTextoEstado(inscripcion.estado)}
                            </span>
                          </td>

                          <td>
                            {inscripcion.estado === "pendiente" ? (
                              <div className="d-flex gap-2 flex-wrap">
                                <button
                                  type="button"
                                  className="btn btn-success btn-sm"
                                  onClick={() =>
                                    abrirModalConfirmar(inscripcion)
                                  }
                                >
                                  Confirmar
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() =>
                                    abrirModalRechazar(inscripcion)
                                  }
                                >
                                  Rechazar
                                </button>
                              </div>
                            ) : inscripcion.estado === "confirmado" ? (
                              <button
                                type="button"
                                className="btn btn-outline-dark btn-sm"
                                onClick={() => abrirModalPlantel(inscripcion)}
                              >
                                Ver plantel
                              </button>
                            ) : (
                              <span className="text-muted">Resuelta</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* PAGINACIÓN */}

                {totalPaginas > 1 && (
                  <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm"
                      disabled={paginaActual === 1}
                      onClick={() => setPaginaActual(paginaActual - 1)}
                    >
                      Anterior
                    </button>

                    <span className="text-muted">
                      Página {paginaActual} de {totalPaginas}
                    </span>

                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm"
                      disabled={paginaActual === totalPaginas}
                      onClick={() => setPaginaActual(paginaActual + 1)}
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* =====================================================
                    MODAL CONFIRMAR
                ===================================================== */}

        {inscripcionSeleccionada && accionSeleccionada === "confirmar" && (
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
                maxWidth: "520px",
                overflow: "hidden",
              }}
            >
              {/* CABECERA */}

              <div className="p-4 text-center">
                <div
                  className="text-success mb-3"
                  style={{
                    fontSize: "3rem",
                  }}
                >
                  ✓
                </div>

                <h4>Confirmar inscripción</h4>

                <p className="text-muted mb-0">
                  ¿Deseás aceptar la inscripción de{" "}
                  <strong>{inscripcionSeleccionada.Equipo?.nombre}</strong>?
                </p>
              </div>

              {/* DATOS */}

              <div className="px-4 pb-3">
                <div className="alert alert-light border">
                  <p className="mb-2">
                    <strong>Torneo:</strong>{" "}
                    {inscripcionSeleccionada.torneoCategoria?.torneo?.nombre}
                  </p>

                  <p className="mb-0">
                    <strong>Categoría:</strong>{" "}
                    {inscripcionSeleccionada.torneoCategoria?.categoria?.nombre}
                  </p>
                </div>

                <div className="alert alert-warning">
                  Al confirmar la inscripción, el plantel presentado quedará
                  registrado como plantel histórico de esta participación.
                </div>

                {errorModal && (
                  <div
                    className="alert alert-danger"
                    style={{
                      whiteSpace: "pre-line",
                    }}
                  >
                    {errorModal}
                  </div>
                )}
              </div>

              {/* BOTONES */}

              <div className="border-top p-3 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={procesando}
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="btn btn-success"
                  disabled={procesando}
                  onClick={procesarDecision}
                >
                  {procesando ? "Confirmando..." : "Confirmar inscripción"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
                    MODAL RECHAZAR
                ===================================================== */}

        {inscripcionSeleccionada && accionSeleccionada === "rechazar" && (
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

              <div className="p-4 pb-2">
                <div className="text-center">
                  <div
                    className="text-danger mb-3"
                    style={{
                      fontSize: "3rem",
                    }}
                  >
                    ⚠
                  </div>

                  <h4>Rechazar inscripción</h4>

                  <p className="text-muted">
                    Estás por rechazar la inscripción de{" "}
                    <strong>{inscripcionSeleccionada.Equipo?.nombre}</strong>.
                  </p>
                </div>

                <div className="alert alert-light border">
                  <strong>
                    {inscripcionSeleccionada.torneoCategoria?.torneo?.nombre}
                  </strong>

                  {" — "}

                  {inscripcionSeleccionada.torneoCategoria?.categoria?.nombre}
                </div>
              </div>

              {/* MOTIVO */}

              <div className="px-4 pb-4">
                <label className="form-label fw-semibold">
                  Motivo del rechazo
                  <span className="text-danger"> *</span>
                </label>

                <textarea
                  className="form-control"
                  rows="5"
                  maxLength="500"
                  value={motivoRechazo}
                  disabled={procesando}
                  placeholder="Explique brevemente por qué se rechaza la inscripción..."
                  onChange={(e) => {
                    setMotivoRechazo(e.target.value);

                    setErrorModal("");
                  }}
                />

                <div className="d-flex justify-content-between mt-1">
                  <small className="text-muted">
                    El delegado podrá ver este mensaje.
                  </small>

                  <small
                    className={
                      motivoRechazo.length >= 500 ? "text-danger" : "text-muted"
                    }
                  >
                    {motivoRechazo.length}
                    /500
                  </small>
                </div>

                {errorModal && (
                  <div
                    className="alert alert-danger mt-3 mb-0"
                    style={{
                      whiteSpace: "pre-line",
                    }}
                  >
                    {errorModal}
                  </div>
                )}
              </div>

              {/* BOTONES */}

              <div className="border-top p-3 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={procesando}
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={procesando || motivoRechazo.trim().length < 5}
                  onClick={procesarDecision}
                >
                  {procesando ? "Rechazando..." : "Rechazar inscripción"}
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
                maxWidth: "550px",
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
                Desde esta sección el administrador puede revisar las
                solicitudes de inscripción enviadas por los delegados.
              </p>

              <p>
                Antes de confirmar una inscripción, el sistema volverá a validar
                el plantel y sus requisitos.
              </p>

              <p>
                Si la inscripción es rechazada, será obligatorio indicar un
                motivo. El delegado podrá consultar posteriormente esa
                explicación.
              </p>

              <p className="mb-0">
                Solamente los equipos con inscripción confirmada participarán en
                la generación del fixture.
              </p>
            </div>
          </div>
        )}

        {/* =====================================================
    MODAL PLANTEL HISTÓRICO
===================================================== */}

        {inscripcionPlantel && (
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
                maxWidth: "850px",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              {/* =========================
                    CABECERA
                ========================= */}

              <div className="p-4 border-bottom">
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <div>
                    <h4 className="mb-1">Plantel registrado</h4>

                    <p className="text-muted mb-0">
                      Plantel histórico correspondiente a esta inscripción.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={cerrarModalPlantel}
                  />
                </div>
              </div>

              {/* =========================
                    CONTENIDO
                ========================= */}

              <div className="p-4">
                {/* CARGANDO */}

                {cargandoPlantel && (
                  <div className="text-center py-5">
                    <div className="spinner-border" role="status" />

                    <p className="text-muted mt-3 mb-0">Cargando plantel...</p>
                  </div>
                )}

                {/* ERROR */}

                {!cargandoPlantel && errorPlantel && (
                  <div className="alert alert-danger mb-0">{errorPlantel}</div>
                )}

                {/* DETALLE */}

                {!cargandoPlantel && !errorPlantel && detallePlantel && (
                  <>
                    {/* DATOS COMPETENCIA */}

                    <div className="card bg-light border mb-4">
                      <div className="card-body">
                        <div className="row g-3">
                          {/* EQUIPO */}

                          <div className="col-md-6">
                            <small className="text-muted d-block">Equipo</small>

                            <strong>
                              {detallePlantel.Equipo?.nombre || "-"}
                            </strong>
                          </div>

                          {/* INSCRIPCIÓN */}

                          <div className="col-md-6">
                            <small className="text-muted d-block">
                              Fecha de inscripción
                            </small>

                            <strong>
                              {formatearFecha(detallePlantel.fecha)}
                            </strong>
                          </div>

                          {/* TORNEO */}

                          <div className="col-md-6">
                            <small className="text-muted d-block">Torneo</small>

                            <strong>
                              {detallePlantel.torneoCategoria?.torneo?.nombre ||
                                "-"}
                            </strong>
                          </div>

                          {/* CATEGORÍA */}

                          <div className="col-md-6">
                            <small className="text-muted d-block">
                              Categoría
                            </small>

                            <strong>
                              {detallePlantel.torneoCategoria?.categoria
                                ?.nombre || "-"}
                            </strong>
                          </div>

                          {/* REQUISITOS */}

                          <div className="col-md-6">
                            <small className="text-muted d-block">
                              Requisitos de edad
                            </small>

                            <strong>
                              {
                                detallePlantel.torneoCategoria?.categoria
                                  ?.edad_minima
                              }

                              {" a "}

                              {
                                detallePlantel.torneoCategoria?.categoria
                                  ?.edad_maxima
                              }

                              {" años"}
                            </strong>
                          </div>

                          {/* SEXO */}

                          <div className="col-md-6">
                            <small className="text-muted d-block">Sexo</small>

                            <strong className="text-capitalize">
                              {detallePlantel.torneoCategoria?.categoria
                                ?.sexo || "-"}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* =========================
                                    TOTAL
                                ========================= */}

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Jugadores</h5>

                      <span className="badge bg-dark">
                        {detallePlantel.jugadores?.length || 0}

                        {" jugadores"}
                      </span>
                    </div>

                    {/* =========================
                                    TABLA JUGADORES
                                ========================= */}

                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Dorsal</th>

                            <th>Jugador</th>

                            <th>DNI</th>

                            <th>Nacimiento</th>

                            <th>Sexo</th>

                            <th>Rol</th>
                          </tr>
                        </thead>

                        <tbody>
                          {(detallePlantel.jugadores || []).map((jugador) => (
                            <tr key={jugador.id}>
                              {/* DORSAL */}

                              <td>
                                <strong>#{jugador.dorsal}</strong>
                              </td>

                              {/* NOMBRE */}

                              <td>
                                <strong>
                                  {jugador.nombre} {jugador.apellido}
                                </strong>
                              </td>

                              {/* DNI */}

                              <td>{jugador.dni}</td>

                              {/* NACIMIENTO */}

                              <td>
                                {formatearFecha(jugador.fecha_nacimiento)}
                              </td>

                              {/* SEXO */}

                              <td className="text-capitalize">
                                {jugador.sexo || "-"}
                              </td>

                              {/* ROL */}

                              <td>
                                {jugador.es_delegado ? (
                                  <span className="badge bg-primary">
                                    Delegado
                                  </span>
                                ) : (
                                  <span className="text-muted">Jugador</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* ACLARACIÓN */}

                    <div className="alert alert-info mt-4 mb-0">
                      Este plantel corresponde a la composición del equipo
                      registrada al momento de confirmar la inscripción. Los
                      cambios posteriores realizados en el plantel actual no
                      modifican este registro histórico.
                    </div>
                  </>
                )}
              </div>

              {/* =========================
                    PIE
                ========================= */}

              <div className="border-top p-3 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cerrarModalPlantel}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInscripciones;