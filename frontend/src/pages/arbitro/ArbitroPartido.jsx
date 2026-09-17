import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ArbitroPartido = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [partido, setPartido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  // =====================================================
  // SANCIÓN
  // =====================================================

  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);

  const [equipoJugadorSeleccionado, setEquipoJugadorSeleccionado] =
    useState("");

  const [falta, setFalta] = useState("");
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechasSuspension, setFechasSuspension] = useState(0);

  const [registrandoSancion, setRegistrandoSancion] = useState(false);

  const [errorSancion, setErrorSancion] = useState("");

  // =====================================================
  // CARGA INICIAL
  // =====================================================

  useEffect(() => {
    obtenerPartido();
  }, [id]);

  // =====================================================
  // OBTENER PARTIDO
  // =====================================================

  const obtenerPartido = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/api/v1/arbitros/mis-partidos/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener el partido");
      }

      setPartido(data);
    } catch (error) {
      console.error(error);

      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  };

  // =====================================================
  // SELECCIONAR JUGADOR PARA SANCIÓN
  // =====================================================

  const seleccionarJugador = (jugador, equipo) => {
    setJugadorSeleccionado(jugador);

    setEquipoJugadorSeleccionado(equipo?.nombre || "");

    setFalta("");
    setTipo("");
    setDescripcion("");
    setFechasSuspension(0);
    setErrorSancion("");
  };

  // =====================================================
  // CERRAR MODAL
  // =====================================================

  const cancelarSancion = () => {
    setJugadorSeleccionado(null);

    setEquipoJugadorSeleccionado("");

    setFalta("");
    setTipo("");
    setDescripcion("");
    setFechasSuspension(0);

    setErrorSancion("");
  };

  // =====================================================
  // REGISTRAR SANCIÓN
  // =====================================================

  const registrarSancion = async (e) => {
    e.preventDefault();

    setErrorSancion("");

    if (!jugadorSeleccionado) {
      return;
    }

    if (!falta.trim()) {
      setErrorSancion("Debe indicar la falta cometida.");

      return;
    }

    if (!tipo) {
      setErrorSancion("Debe seleccionar el tipo de falta.");

      return;
    }

    if (!descripcion.trim()) {
      setErrorSancion("Debe ingresar una explicación de lo ocurrido.");

      return;
    }

    if (fechasSuspension === "" || Number(fechasSuspension) < 0) {
      setErrorSancion("Las fechas de suspensión no pueden ser negativas.");

      return;
    }

    try {
      setRegistrandoSancion(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/api/v1/arbitros/partidos/${id}/sanciones`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            jugador_id: jugadorSeleccionado.id,

            falta: falta.trim(),

            tipo,

            descripcion: descripcion.trim(),

            fechas_suspension: Number(fechasSuspension),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrar la sanción");
      }

      setMensaje(data.message || "Sanción registrada correctamente.");

      cancelarSancion();

      await obtenerPartido();
    } catch (error) {
      console.error(error);

      setErrorSancion(error.message || "Error al registrar la sanción.");
    } finally {
      setRegistrandoSancion(false);
    }
  };

  // =====================================================
  // ESTADO DEL JUGADOR
  // =====================================================

  const renderEstadoJugador = (estado) => {
    if (estado === "activo") {
      return <span className="badge bg-success">Disponible</span>;
    }

    return <span className="badge bg-danger">Inactivo</span>;
  };

  // =====================================================
  // TABLA DE JUGADORES
  // =====================================================

  const renderJugadores = (equipo) => {
    const jugadores = equipo?.jugadores || [];

    if (jugadores.length === 0) {
      return <p className="text-muted mb-0">No hay jugadores registrados.</p>;
    }

    return (
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Dorsal</th>

              <th>Jugador</th>

              <th>Estado</th>

              {partido?.estado === "jugado" && <th>Acciones</th>}
            </tr>
          </thead>

          <tbody>
            {[...jugadores]
              .sort((a, b) => a.dorsal - b.dorsal)
              .map((jugador) => (
                <tr key={jugador.id}>
                  <td>
                    <strong>#{jugador.dorsal}</strong>
                  </td>

                  <td>
                    {jugador.nombre} {jugador.apellido}
                  </td>

                  <td>{renderEstadoJugador(jugador.estado)}</td>

                  {partido?.estado === "jugado" && (
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => seleccionarJugador(jugador, equipo)}
                      >
                        Registrar falta
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  // =====================================================
  // CARGANDO
  // =====================================================

  if (cargando) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR AL CARGAR
  // =====================================================

  if (!partido) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          No fue posible cargar el partido.
        </div>

        <button className="btn btn-dark" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    );
  }

  const equipoLocal = partido.local?.Equipo;

  const equipoVisitante = partido.visitante?.Equipo;

  return (
    <div className="container mt-5 mb-5">
      <div className="col-lg-10 mx-auto">
        {/* =================================================
                    CABECERA
                ================================================= */}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Detalle del Partido</h2>

            <span className="text-muted">
              {partido.torneoCategoria?.torneo?.nombre}

              {" - "}

              {partido.torneoCategoria?.categoria?.nombre}
            </span>
          </div>

          <button className="btn btn-dark" onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </div>

        {/* =================================================
                    MENSAJES
                ================================================= */}

        {mensaje && <div className="alert alert-info">{mensaje}</div>}

        {/* =================================================
                    INFORMACIÓN DEL PARTIDO
                ================================================= */}

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            {/* EQUIPOS */}

            <div className="row align-items-center text-center">
              <div className="col-md-5">
                <small className="text-muted">Local</small>

                <h4 className="fw-bold mb-0">{equipoLocal?.nombre}</h4>
              </div>

              <div className="col-md-2">
                {partido.estado === "jugado" ? (
                  <h3 className="mb-0">
                    {partido.puntaje_local}

                    {" - "}

                    {partido.puntaje_visitante}
                  </h3>
                ) : (
                  <span className="badge bg-secondary">VS</span>
                )}
              </div>

              <div className="col-md-5">
                <small className="text-muted">Visitante</small>

                <h4 className="fw-bold mb-0">{equipoVisitante?.nombre}</h4>
              </div>
            </div>

            <hr />

            {/* DATOS */}

            <div className="row">
              <div className="col-md-3 mb-2">
                <strong>Estado:</strong>

                <div>
                  {partido.estado === "jugado" ? (
                    <span className="badge bg-success">Jugado</span>
                  ) : partido.estado === "suspendido" ? (
                    <span className="badge bg-danger">Suspendido</span>
                  ) : (
                    <span className="badge bg-warning text-dark">
                      Pendiente
                    </span>
                  )}
                </div>
              </div>

              <div className="col-md-3 mb-2">
                <strong>Fecha:</strong>

                <div>
                  {partido.fecha
                    ? new Date(partido.fecha).toLocaleString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                    : "-"}
                </div>
              </div>

              <div className="col-md-3 mb-2">
                <strong>Sede:</strong>

                <div>{partido.sede?.nombre || "Sin asignar"}</div>
              </div>

              <div className="col-md-3 mb-2">
                <strong>Fase:</strong>

                <div>
                  {partido.fase === "regular"
                    ? `Regular - Jornada ${partido.jornada}`
                    : partido.fase === "cuartos"
                      ? "Cuartos de final"
                      : partido.fase === "semifinal"
                        ? "Semifinal"
                        : partido.fase === "final"
                          ? "Final"
                          : partido.fase || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
                    JUGADORES LOCAL
                ================================================= */}

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <strong>{equipoLocal?.nombre}</strong>

            <small>Plantel local</small>
          </div>

          <div className="card-body">{renderJugadores(equipoLocal)}</div>
        </div>

        {/* =================================================
                    JUGADORES VISITANTE
                ================================================= */}

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <strong>{equipoVisitante?.nombre}</strong>

            <small>Plantel visitante</small>
          </div>

          <div className="card-body">{renderJugadores(equipoVisitante)}</div>
        </div>

        {/* =================================================
                    SANCIONES REGISTRADAS
                ================================================= */}

        {partido?.sanciones?.length > 0 && (
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
              <strong>Sanciones registradas</strong>

              <span className="badge bg-light text-dark">
                {partido.sanciones.length}
              </span>
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Jugador</th>

                      <th>Falta</th>

                      <th>Tipo</th>

                      <th>Suspensión</th>

                      <th>Estado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {partido.sanciones.map((sancion) => (
                      <tr key={sancion.id}>
                        <td>
                          <strong>#{sancion.jugador?.dorsal}</strong>{" "}
                          {sancion.jugador?.nombre} {sancion.jugador?.apellido}
                        </td>

                        <td>{sancion.falta}</td>

                        <td>
                          {sancion.tipo
                            ? sancion.tipo.charAt(0).toUpperCase() +
                              sancion.tipo.slice(1)
                            : "-"}
                        </td>

                        <td>
                          {sancion.fechas_suspension > 0
                            ? `${sancion.fechas_suspension} fecha(s)`
                            : "Sin suspensión"}
                        </td>

                        <td>
                          {sancion.estado === "activa" ? (
                            <span className="badge bg-danger">Activa</span>
                          ) : (
                            <span className="badge bg-success">Cumplida</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
                    MODAL REGISTRAR FALTA
                ================================================= */}

        {jugadorSeleccionado && (
          <div
            className="
                                position-fixed
                                top-0
                                start-0
                                w-100
                                h-100
                                d-flex
                                justify-content-center
                                align-items-center
                            "
            style={{
              backgroundColor: "rgba(0,0,0,0.65)",

              zIndex: 1060,

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
              {/* CABECERA DEL MODAL */}

              <div
                className="
                                        d-flex
                                        justify-content-between
                                        align-items-center
                                        p-3
                                        border-bottom
                                    "
              >
                <div>
                  <h5 className="mb-1">Registrar falta</h5>

                  <small className="text-muted">
                    Registrar una sanción disciplinaria correspondiente a este
                    encuentro.
                  </small>
                </div>

                <button
                  type="button"
                  className="btn-close"
                  onClick={cancelarSancion}
                  disabled={registrandoSancion}
                />
              </div>

              {/* CUERPO */}

              <div className="p-4">
                {/* JUGADOR */}

                <div className="card bg-light border-0 mb-3">
                  <div className="card-body">
                    <small className="text-muted">Jugador seleccionado</small>

                    <div className="d-flex justify-content-between align-items-center mt-1">
                      <div>
                        <h5 className="mb-1">
                          #{jugadorSeleccionado.dorsal}{" "}
                          {jugadorSeleccionado.nombre}{" "}
                          {jugadorSeleccionado.apellido}
                        </h5>

                        <span className="text-muted">
                          {equipoJugadorSeleccionado}
                        </span>
                      </div>

                      {renderEstadoJugador(jugadorSeleccionado.estado)}
                    </div>
                  </div>
                </div>

                {/* PARTIDO */}

                <div className="mb-4">
                  <small className="text-muted d-block">Partido</small>

                  <strong>
                    {equipoLocal?.nombre}

                    {" vs "}

                    {equipoVisitante?.nombre}
                  </strong>

                  <div className="text-muted">
                    {partido.torneoCategoria?.torneo?.nombre}

                    {" - "}

                    {partido.torneoCategoria?.categoria?.nombre}
                  </div>
                </div>

                {/* ERROR */}

                {errorSancion && (
                  <div className="alert alert-danger">{errorSancion}</div>
                )}

                {/* FORMULARIO */}

                <form onSubmit={registrarSancion}>
                  <div className="row">
                    {/* FALTA */}

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Falta</label>

                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ej: Conducta antideportiva"
                        value={falta}
                        onChange={(e) => setFalta(e.target.value)}
                        disabled={registrandoSancion}
                        required
                      />
                    </div>

                    {/* TIPO */}

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Tipo</label>

                      <select
                        className="form-select"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        disabled={registrandoSancion}
                        required
                      >
                        <option value="">Seleccionar tipo</option>

                        <option value="tecnica">Técnica</option>

                        <option value="antideportiva">Antideportiva</option>

                        <option value="descalificante">Descalificante</option>

                        <option value="expulsion">Expulsión</option>

                        <option value="otra">Otra</option>
                      </select>
                    </div>

                    {/* EXPLICACIÓN */}

                    <div className="col-12 mb-3">
                      <label className="form-label">Explicación</label>

                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Describí brevemente lo ocurrido durante el encuentro..."
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        disabled={registrandoSancion}
                        required
                      />

                      <small className="text-muted">
                        Indicá de forma clara el motivo por el cual se registra
                        la falta.
                      </small>
                    </div>

                    {/* SUSPENSIÓN */}

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Fechas de suspensión</label>

                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        step="1"
                        value={fechasSuspension}
                        onChange={(e) => setFechasSuspension(e.target.value)}
                        disabled={registrandoSancion}
                        required
                      />

                      <small className="text-muted">
                        Ingresá 0 si la falta no implica suspensión.
                      </small>
                    </div>
                  </div>

                  <div className="alert alert-light border">
                    <small>
                      <strong>Importante:</strong> revisá los datos antes de
                      registrar la sanción. La falta quedará asociada a este
                      jugador y a este partido.
                    </small>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={cancelarSancion}
                      disabled={registrandoSancion}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="btn btn-danger"
                      disabled={registrandoSancion}
                    >
                      {registrandoSancion ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          />
                          Registrando...
                        </>
                      ) : (
                        "Registrar sanción"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArbitroPartido;