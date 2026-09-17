import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminPartido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);
  const [partido, setPartido] = useState(null);
  const [sedes, setSedes] = useState([]);
  const [arbitros, setArbitros] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // =====================================================
  // MODALES
  // =====================================================

  const [mostrarModalIncompleto, setMostrarModalIncompleto] = useState(false);
  const [mostrarModalFinalizar, setMostrarModalFinalizar] = useState(false);
  const [camposFaltantes, setCamposFaltantes] = useState([]);

  // =====================================================
  // FORMULARIO
  // =====================================================

  const [formData, setFormData] = useState({
    fecha: "",
    sede_id: "",
    arbitro_id: "",
    estado: "pendiente",
    puntaje_local: "",
    puntaje_visitante: "",
  });

  // =====================================================
  // PARTIDO CERRADO
  // =====================================================

  const partidoFinalizado = partido?.estado === "jugado";

  // =====================================================
  // CARGA INICIAL
  // =====================================================

  useEffect(() => {
    obtenerPartido();
    obtenerSedes();
    obtenerArbitros();
  }, []);

  // =====================================================
  // FORMATEAR FECHA
  // =====================================================

  const formatearFechaHoraInput = (fecha) => {
    if (!fecha) {
      return "";
    }

    const date = new Date(fecha);
    const anio = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const dia = String(date.getDate()).padStart(2, "0");
    const horas = String(date.getHours()).padStart(2, "0");
    const minutos = String(date.getMinutes()).padStart(2, "0");

    return `${anio}-${mes}-${dia}T${horas}:${minutos}`;
  };

  // =====================================================
  // OBTENER PARTIDO
  // =====================================================

  const obtenerPartido = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/partidos/${id}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener el partido.");
      }

      setPartido(data);

      setFormData({
        fecha: formatearFechaHoraInput(data.fecha),
        sede_id: data.sede_id ?? "",
        arbitro_id: data.arbitro_id ?? "",
        estado: data.estado || "pendiente",
        puntaje_local: data.puntaje_local ?? "",
        puntaje_visitante: data.puntaje_visitante ?? "",
      });
    } catch (error) {
      console.error(error);

      setMensaje(error.message);
    }
  };

  // =====================================================
  // OBTENER SEDES
  // =====================================================

  const obtenerSedes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/sedes");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener las sedes.");
      }

      setSedes(data);
    } catch (error) {
      console.error(error);
    }
  };

  // =====================================================
  // OBTENER ÁRBITROS
  // =====================================================

  const obtenerArbitros = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/arbitros");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener los árbitros.");
      }

      setArbitros(data);
    } catch (error) {
      console.error(error);
    }
  };

  // =====================================================
  // CAMBIOS DEL FORMULARIO
  // =====================================================

  const handleChange = (e) => {
    if (partidoFinalizado) {
      return;
    }

    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });

    setMensaje("");
  };

  // =====================================================
  // CAMPOS OBLIGATORIOS PARA "JUGADO"
  // =====================================================

  const obtenerCamposFaltantes = () => {
    const faltantes = [];

    if (!formData.fecha) {
      faltantes.push("Fecha y hora");
    }

    if (!formData.sede_id) {
      faltantes.push("Sede");
    }

    if (!formData.arbitro_id) {
      faltantes.push("Árbitro");
    }

    if (
      formData.puntaje_local === "" ||
      formData.puntaje_local === null ||
      formData.puntaje_local === undefined
    ) {
      faltantes.push("Puntaje local");
    }

    if (
      formData.puntaje_visitante === "" ||
      formData.puntaje_visitante === null ||
      formData.puntaje_visitante === undefined
    ) {
      faltantes.push("Puntaje visitante");
    }

    return faltantes;
  };

  // =====================================================
  // ARMAR PAYLOAD
  // =====================================================

  const crearPayload = () => {
    return {
      fecha: formData.fecha || null,
      sede_id: formData.sede_id === "" ? null : Number(formData.sede_id),
      arbitro_id:
        formData.arbitro_id === "" ? null : Number(formData.arbitro_id),
      estado: formData.estado,
      puntaje_local:
        formData.puntaje_local === "" ? null : Number(formData.puntaje_local),
      puntaje_visitante:
        formData.puntaje_visitante === ""
          ? null
          : Number(formData.puntaje_visitante),
    };
  };

  // =====================================================
  // GUARDAR EN BACKEND
  // =====================================================

  const guardarPartido = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = crearPayload();

      const response = await fetch(
        `http://localhost:3000/api/v1/partidos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMensaje(data.message || "No se pudo actualizar el partido.");
        return;
      }

      setMostrarModalFinalizar(false);

      setMensaje(
        payload.estado === "jugado"
          ? "Partido finalizado correctamente. Los datos quedaron bloqueados."
          : "Partido actualizado correctamente.",
      );

      await obtenerPartido();
    } catch (error) {
      console.error(error);

      setMensaje("Error al actualizar el partido.");
    }
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Un partido jugado no debe
    // poder modificarse.

    if (partidoFinalizado) {
      setMensaje("Este partido ya fue jugado y no puede modificarse.");

      return;
    }

    // =================================================
    // SI NO SE MARCA COMO JUGADO
    // =================================================
    //
    // Permitimos guardar cualquier combinación
    // de campos, incluso incompleta.
    // =================================================

    if (formData.estado !== "jugado") {
      await guardarPartido();

      return;
    }

    // =================================================
    // SI SE QUIERE MARCAR COMO JUGADO
    // =================================================

    const faltantes = obtenerCamposFaltantes();

    if (faltantes.length > 0) {
      setCamposFaltantes(faltantes);
      setMostrarModalIncompleto(true);
      return;
    }

    // Todo está completo.
    // Pedimos confirmación irreversible.

    setMostrarModalFinalizar(true);
  };

  // =====================================================
  // CONFIRMAR FINALIZACIÓN
  // =====================================================

  const confirmarPartidoJugado = async () => {
    setMostrarModalFinalizar(false);

    await guardarPartido();
  };

  // =====================================================
  // CARGANDO
  // =====================================================

  if (!partido) {
    return <div className="container mt-5">Cargando...</div>;
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="col-lg-10 mx-auto">
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

            <span
              className="text-muted"
              style={{
                cursor: "pointer",
              }}
              onClick={() => navigate("/panel/admin/torneo-categorias/")}
            >
              Competencias
            </span>

            {" > "}

            <span className="text-muted">Fixture</span>

            {" > "}

            <span className="text-muted">Gestión de Partido</span>
          </nav>

          <div className="d-flex align-items-center mb-2">
            <h3 className="fw-bold me-2 mb-0">Gestión de Partido</h3>

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
            BOTÓN VOLVER
        ================================================= */}

        <div className="d-flex justify-content-between mb-3">
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => navigate(-1)}
          >
            ← Volver
          </button>
        </div>

        {/* =================================================
            AVISO PARTIDO CERRADO
        ================================================= */}

        {partidoFinalizado && (
          <div className="alert alert-success">
            <strong>Partido finalizado.</strong> Este encuentro fue marcado como
            jugado. Sus datos quedaron cerrados y ya no pueden modificarse.
          </div>
        )}

        {/* =================================================
    INFORMACIÓN DEL PARTIDO
================================================= */}

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-dark text-white">
            <strong>Información del Partido</strong>
          </div>

          <div className="card-body">
            {/* TORNEO Y CATEGORÍA */}

            <div className="row mb-4">
              <div className="col-md-6 text-center">
                <small className="text-muted">Torneo</small>

                <h5 className="fw-bold mb-0">
                  {partido.torneoCategoria?.torneo?.nombre || "-"}
                </h5>
              </div>

              <div className="col-md-6 text-center">
                <small className="text-muted">Categoría</small>

                <h5 className="fw-bold mb-0">
                  {partido.torneoCategoria?.categoria?.nombre || "-"}
                </h5>
              </div>
            </div>

            <hr />

            {/* EQUIPOS */}

            <div className="row align-items-center text-center my-4">
              <div className="col-md-5">
                <small className="text-muted">Local</small>

                <h3 className="fw-bold">
                  {partido.local?.Equipo?.nombre || "-"}
                </h3>
              </div>

              <div className="col-md-2">
                <span
                  className="badge bg-secondary"
                  style={{
                    fontSize: "1rem",
                  }}
                >
                  VS
                </span>
              </div>

              <div className="col-md-5">
                <small className="text-muted">Visitante</small>

                <h3 className="fw-bold">
                  {partido.visitante?.Equipo?.nombre || "-"}
                </h3>
              </div>
            </div>

            <hr />

            {/* DATOS DEL PARTIDO */}

            <div className="row text-center">
              <div className="col-md-4">
                <small className="text-muted">Jornada</small>

                <div className="fw-bold">{partido.jornada}</div>
              </div>

              <div className="col-md-4">
                <small className="text-muted">Fase</small>

                <div className="fw-bold">
                  {partido.fase === "regular"
                    ? "Fase Regular"
                    : partido.fase === "cuartos"
                      ? "Cuartos de Final"
                      : partido.fase === "semifinal"
                        ? "Semifinal"
                        : partido.fase === "final"
                          ? "Final"
                          : partido.fase || "-"}
                </div>
              </div>

              <div className="col-md-4">
                <small className="text-muted">ID Partido</small>

                <div className="fw-bold">{partido.id}</div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            FORMULARIO
        ================================================= */}

        <form onSubmit={handleSubmit}>
          {/* =================================================
              PROGRAMACIÓN
          ================================================= */}

          <div className="card shadow-sm mb-4">
            <div className="card-header bg-dark text-white">
              <strong>Programación</strong>
            </div>

            <div className="card-body">
              <div className="row">
                {/* FECHA */}

                <div className="col-md-6 mb-3">
                  <label className="form-label">Fecha y Hora</label>

                  <input
                    type="datetime-local"
                    name="fecha"
                    className="form-control"
                    value={formData.fecha}
                    onChange={handleChange}
                    disabled={partidoFinalizado}
                  />
                </div>

                {/* ESTADO */}

                <div className="col-md-6 mb-3">
                  <label className="form-label">Estado</label>

                  <select
                    name="estado"
                    className="form-select"
                    value={formData.estado}
                    onChange={handleChange}
                    disabled={partidoFinalizado}
                  >
                    <option value="pendiente">Pendiente</option>

                    <option value="jugado">Jugado</option>

                    <option value="suspendido">Suspendido</option>
                  </select>
                </div>
              </div>

              <div className="row">
                {/* SEDE */}

                <div className="col-md-6 mb-3">
                  <label className="form-label">Sede</label>

                  <select
                    name="sede_id"
                    className="form-select"
                    value={formData.sede_id}
                    onChange={handleChange}
                    disabled={partidoFinalizado}
                  >
                    <option value="">No asignado</option>

                    {sedes.map((sede) => (
                      <option key={sede.id} value={sede.id}>
                        {sede.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ÁRBITRO */}

                <div className="col-md-6 mb-3">
                  <label className="form-label">Árbitro</label>

                  <select
                    name="arbitro_id"
                    className="form-select"
                    value={formData.arbitro_id}
                    onChange={handleChange}
                    disabled={partidoFinalizado}
                  >
                    <option value="">No asignado</option>

                    {arbitros.map((arbitro) => (
                      <option key={arbitro.id} value={arbitro.id}>
                        {arbitro.nombre} {arbitro.apellido}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              RESULTADO
          ================================================= */}

          <div className="card shadow-sm mb-4">
            <div className="card-header bg-dark text-white">
              <strong>Resultado</strong>
            </div>

            <div className="card-body">
              <div className="row">
                {/* LOCAL */}

                <div className="col-md-6 mb-3">
                  <label className="form-label">Puntaje Local</label>

                  <input
                    type="number"
                    min="0"
                    name="puntaje_local"
                    className="form-control"
                    value={formData.puntaje_local}
                    onChange={handleChange}
                    disabled={partidoFinalizado}
                  />
                </div>

                {/* VISITANTE */}

                <div className="col-md-6 mb-3">
                  <label className="form-label">Puntaje Visitante</label>

                  <input
                    type="number"
                    min="0"
                    name="puntaje_visitante"
                    className="form-control"
                    value={formData.puntaje_visitante}
                    onChange={handleChange}
                    disabled={partidoFinalizado}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              MENSAJE
          ================================================= */}

          {mensaje && <div className="alert alert-info">{mensaje}</div>}

          {/* =================================================
              GUARDAR
          ================================================= */}

          {!partidoFinalizado && (
            <button type="submit" className="btn btn-primary">
              Guardar cambios
            </button>
          )}
        </form>

        {/* =================================================
            MODAL CAMPOS INCOMPLETOS
        ================================================= */}

        {mostrarModalIncompleto && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
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
                maxWidth: "520px",
              }}
            >
              <div className="p-4">
                <h4 className="text-danger mb-3">
                  No se puede finalizar el partido
                </h4>

                <p>
                  Para marcar el partido como <strong>jugado</strong> deben
                  completarse todos los datos obligatorios.
                </p>

                <p className="mb-2">
                  <strong>Campos faltantes:</strong>
                </p>

                <ul>
                  {camposFaltantes.map((campo) => (
                    <li key={campo}>{campo}</li>
                  ))}
                </ul>

                <div className="text-end mt-4">
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => setMostrarModalIncompleto(false)}
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            MODAL CONFIRMAR PARTIDO JUGADO
        ================================================= */}

        {mostrarModalFinalizar && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
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
                maxWidth: "540px",
              }}
            >
              <div className="p-4 text-center">
                <div
                  className="text-warning mb-3"
                  style={{
                    fontSize: "3rem",
                  }}
                >
                  ⚠
                </div>

                <h4>Confirmar partido jugado</h4>

                <p className="mt-3">
                  Está por marcar este encuentro como <strong>jugado</strong>.
                </p>

                <div className="border rounded p-3 mb-3">
                  <strong>{partido.local?.Equipo?.nombre}</strong>{" "}
                  {formData.puntaje_local}
                  {" - "}
                  {formData.puntaje_visitante}{" "}
                  <strong>{partido.visitante?.Equipo?.nombre}</strong>
                </div>

                <p className="text-danger fw-bold">
                  Una vez confirmado, el partido quedará cerrado y sus datos ya
                  no podrán modificarse.
                </p>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setMostrarModalFinalizar(false)}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={confirmarPartidoJugado}
                  >
                    Sí, finalizar partido
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                Mientras el partido no haya sido jugado, podés asignar o
                modificar fecha, sede, árbitro y resultado.
              </p>

              <p>
                Estos datos pueden guardarse de forma incompleta mientras el
                partido permanezca pendiente o suspendido.
              </p>

              <p>
                Para marcarlo como <strong>jugado</strong>, todos los datos
                deberán estar completos.
              </p>

              <p className="mb-0">
                Una vez confirmado como jugado, el partido quedará cerrado y ya
                no podrá editarse.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPartido;
