import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const ArbitroDashboard = () => {
  const [partidos, setPartidos] = useState([]);

  const [mensaje, setMensaje] = useState("");

  const [cargando, setCargando] = useState(true);

  // =====================================================
  // FILTROS
  // =====================================================

  const [busqueda, setBusqueda] = useState("");

  const [torneoSeleccionado, setTorneoSeleccionado] = useState("");

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  const [estadoSeleccionado, setEstadoSeleccionado] = useState("");

  // =====================================================
  // CARGA INICIAL
  // =====================================================

  useEffect(() => {
    obtenerPartidos();
  }, []);

  // =====================================================
  // OBTENER PARTIDOS
  // =====================================================

  const obtenerPartidos = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/v1/arbitros/mis-partidos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener los partidos");
      }

      setPartidos(data);
    } catch (error) {
      console.error(error);

      setMensaje(error.message || "Error al cargar los partidos");
    } finally {
      setCargando(false);
    }
  };

  // =====================================================
  // ESTADO
  // =====================================================

  const obtenerEstado = (estado) => {
    if (estado === "jugado") {
      return <span className="badge bg-success">Jugado</span>;
    }

    if (estado === "suspendido") {
      return <span className="badge bg-danger">Suspendido</span>;
    }

    return <span className="badge bg-warning text-dark">Pendiente</span>;
  };

  // =====================================================
  // FORMATEAR FASE
  // =====================================================

  const obtenerFase = (partido) => {
    if (partido.fase === "regular") {
      return `Regular - Jornada ${partido.jornada}`;
    }

    if (partido.fase === "cuartos") {
      return "Cuartos de final";
    }

    if (partido.fase === "semifinal") {
      return "Semifinal";
    }

    if (partido.fase === "final") {
      return "Final";
    }

    return partido.fase || "-";
  };

  // =====================================================
  // FORMATEAR FECHA
  // =====================================================

  const formatearFecha = (fecha) => {
    if (!fecha) {
      return "Sin asignar";
    }

    return new Date(fecha).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // =====================================================
  // TORNEOS DISPONIBLES
  // =====================================================

  const torneos = useMemo(() => {
    const mapa = new Map();

    partidos.forEach((partido) => {
      const torneo = partido.torneoCategoria?.torneo;

      if (torneo?.id && torneo?.nombre) {
        mapa.set(torneo.id, torneo);
      }
    });

    return Array.from(mapa.values()).sort((a, b) =>
      a.nombre.localeCompare(b.nombre),
    );
  }, [partidos]);

  // =====================================================
  // CATEGORÍAS DISPONIBLES
  // =====================================================

  const categorias = useMemo(() => {
    const mapa = new Map();

    partidos.forEach((partido) => {
      const torneo = partido.torneoCategoria?.torneo;

      const categoria = partido.torneoCategoria?.categoria;

      // Si hay un torneo seleccionado,
      // mostramos solamente sus categorías.

      if (
        torneoSeleccionado &&
        String(torneo?.id) !== String(torneoSeleccionado)
      ) {
        return;
      }

      if (categoria?.id && categoria?.nombre) {
        mapa.set(categoria.id, categoria);
      }
    });

    return Array.from(mapa.values()).sort((a, b) =>
      a.nombre.localeCompare(b.nombre),
    );
  }, [partidos, torneoSeleccionado]);

  // =====================================================
  // CAMBIAR TORNEO
  // =====================================================

  const handleTorneoChange = (e) => {
    setTorneoSeleccionado(e.target.value);

    // Reiniciamos categoría porque
    // puede pertenecer a otro torneo.

    setCategoriaSeleccionada("");
  };

  // =====================================================
  // FILTRAR PARTIDOS
  // =====================================================

  const partidosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    const filtrados = partidos.filter((partido) => {
      const torneo = partido.torneoCategoria?.torneo;

      const categoria = partido.torneoCategoria?.categoria;

      const local = partido.local?.Equipo?.nombre || "";

      const visitante = partido.visitante?.Equipo?.nombre || "";

      // TORNEO

      if (
        torneoSeleccionado &&
        String(torneo?.id) !== String(torneoSeleccionado)
      ) {
        return false;
      }

      // CATEGORÍA

      if (
        categoriaSeleccionada &&
        String(categoria?.id) !== String(categoriaSeleccionada)
      ) {
        return false;
      }

      // ESTADO

      if (estadoSeleccionado && partido.estado !== estadoSeleccionado) {
        return false;
      }

      // BÚSQUEDA

      if (texto) {
        const coincide =
          local.toLowerCase().includes(texto) ||
          visitante.toLowerCase().includes(texto) ||
          torneo?.nombre?.toLowerCase().includes(texto) ||
          categoria?.nombre?.toLowerCase().includes(texto);

        if (!coincide) {
          return false;
        }
      }

      return true;
    });

    // =================================================
    // ORDEN
    // =================================================
    //
    // Pendientes primero.
    // Suspendidos después.
    // Jugados al final.
    // Dentro de cada grupo, por fecha.
    // =================================================

    const prioridad = {
      pendiente: 1,
      suspendido: 2,
      jugado: 3,
    };

    return [...filtrados].sort((a, b) => {
      const estadoA = prioridad[a.estado] || 99;

      const estadoB = prioridad[b.estado] || 99;

      if (estadoA !== estadoB) {
        return estadoA - estadoB;
      }

      if (!a.fecha && !b.fecha) {
        return 0;
      }

      if (!a.fecha) {
        return 1;
      }

      if (!b.fecha) {
        return -1;
      }

      return new Date(a.fecha) - new Date(b.fecha);
    });
  }, [
    partidos,
    busqueda,
    torneoSeleccionado,
    categoriaSeleccionada,
    estadoSeleccionado,
  ]);

  // =====================================================
  // LIMPIAR FILTROS
  // =====================================================

  const limpiarFiltros = () => {
    setBusqueda("");

    setTorneoSeleccionado("");

    setCategoriaSeleccionada("");

    setEstadoSeleccionado("");
  };

  // =====================================================
  // CONTADORES
  // =====================================================

  const cantidadPendientes = partidos.filter(
    (partido) => partido.estado === "pendiente",
  ).length;

  const cantidadJugados = partidos.filter(
    (partido) => partido.estado === "jugado",
  ).length;

  const cantidadSuspendidos = partidos.filter(
    (partido) => partido.estado === "suspendido",
  ).length;

  return (
    <div className="container mt-5 mb-5">
      <div className="col-lg-11 mx-auto">
        {/* =================================================
            TÍTULO
        ================================================= */}

        <div className="mb-4">
          <h2 className="fw-bold mb-1">Panel del Árbitro</h2>

          <p className="text-muted mb-0">
            Consultá y gestioná los partidos que tenés asignados.
          </p>
        </div>

        {/* =================================================
            MENSAJE DE ERROR
        ================================================= */}

        {mensaje && <div className="alert alert-danger">{mensaje}</div>}

        {cargando ? (
          // =================================================
          // CARGANDO
          // =================================================

          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : partidos.length === 0 ? (
          // =================================================
          // SIN PARTIDOS
          // =================================================

          <div className="alert alert-info">No tenés partidos asignados.</div>
        ) : (
          <>
            {/* =================================================
                  RESUMEN
              ================================================= */}

            <div className="row g-3 mb-4">
              <div className="col-6 col-md-3">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <small className="text-muted">Total asignados</small>

                    <h3 className="mb-0">{partidos.length}</h3>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <small className="text-muted">Pendientes</small>

                    <h3 className="mb-0 text-warning">{cantidadPendientes}</h3>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <small className="text-muted">Jugados</small>

                    <h3 className="mb-0 text-success">{cantidadJugados}</h3>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <small className="text-muted">Suspendidos</small>

                    <h3 className="mb-0 text-danger">{cantidadSuspendidos}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                  FILTROS
              ================================================= */}

            <div className="card shadow-sm mb-4">
              <div className="card-header bg-dark text-white">
                <strong>Buscar partidos</strong>
              </div>

              <div className="card-body">
                <div className="row g-3">
                  {/* BÚSQUEDA */}

                  <div className="col-12">
                    <label className="form-label">Buscar</label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por equipo, torneo o categoría..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                    />
                  </div>

                  {/* TORNEO */}

                  <div className="col-md-4">
                    <label className="form-label">Torneo</label>

                    <select
                      className="form-select"
                      value={torneoSeleccionado}
                      onChange={handleTorneoChange}
                    >
                      <option value="">Todos los torneos</option>

                      {torneos.map((torneo) => (
                        <option key={torneo.id} value={torneo.id}>
                          {torneo.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* CATEGORÍA */}

                  <div className="col-md-4">
                    <label className="form-label">Categoría</label>

                    <select
                      className="form-select"
                      value={categoriaSeleccionada}
                      onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    >
                      <option value="">Todas las categorías</option>

                      {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ESTADO */}

                  <div className="col-md-4">
                    <label className="form-label">Estado</label>

                    <select
                      className="form-select"
                      value={estadoSeleccionado}
                      onChange={(e) => setEstadoSeleccionado(e.target.value)}
                    >
                      <option value="">Todos los estados</option>

                      <option value="pendiente">Pendientes</option>

                      <option value="jugado">Jugados</option>

                      <option value="suspendido">Suspendidos</option>
                    </select>
                  </div>
                </div>

                {/* RESULTADOS Y LIMPIAR */}

                <div className="d-flex justify-content-between align-items-center mt-4">
                  <small className="text-muted">
                    {partidosFiltrados.length}{" "}
                    {partidosFiltrados.length === 1
                      ? "partido encontrado"
                      : "partidos encontrados"}
                  </small>

                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={limpiarFiltros}
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            </div>

            {/* =================================================
                  PARTIDOS
              ================================================= */}

            {partidosFiltrados.length === 0 ? (
              <div className="alert alert-light border text-center py-4">
                <strong>No se encontraron partidos.</strong>

                <div className="text-muted mt-1">
                  Probá modificando los filtros de búsqueda.
                </div>
              </div>
            ) : (
              <div className="row g-4">
                {partidosFiltrados.map((partido) => (
                  <div className="col-12 col-lg-6" key={partido.id}>
                    <div className="card shadow-sm h-100">
                      {/* =================================================
                                  CABECERA
                              ================================================= */}

                      <div className="card-header bg-light">
                        <div className="d-flex justify-content-between align-items-start gap-3">
                          <div>
                            <div className="fw-bold">
                              {partido.torneoCategoria?.torneo?.nombre ||
                                "Torneo"}
                            </div>

                            <small className="text-muted">
                              Categoría:{" "}
                              <strong>
                                {partido.torneoCategoria?.categoria?.nombre ||
                                  "-"}
                              </strong>
                            </small>
                          </div>

                          <div>{obtenerEstado(partido.estado)}</div>
                        </div>
                      </div>

                      {/* =================================================
                                  CUERPO
                              ================================================= */}

                      <div className="card-body d-flex flex-column">
                        {/* EQUIPOS */}

                        <div className="text-center mb-3">
                          <div className="row align-items-center">
                            <div className="col-5">
                              <small className="text-muted">Local</small>

                              <h5 className="fw-bold mb-0">
                                {partido.local?.Equipo?.nombre || "-"}
                              </h5>
                            </div>

                            <div className="col-2">
                              {partido.estado === "jugado" ? (
                                <div className="fw-bold fs-5">
                                  {partido.puntaje_local}

                                  {" - "}

                                  {partido.puntaje_visitante}
                                </div>
                              ) : (
                                <span className="badge bg-secondary">VS</span>
                              )}
                            </div>

                            <div className="col-5">
                              <small className="text-muted">Visitante</small>

                              <h5 className="fw-bold mb-0">
                                {partido.visitante?.Equipo?.nombre || "-"}
                              </h5>
                            </div>
                          </div>
                        </div>

                        <hr />

                        {/* DATOS */}

                        <div className="mb-3">
                          <div className="row g-3">
                            <div className="col-sm-6">
                              <small className="text-muted d-block">
                                Fecha y hora
                              </small>

                              <strong>{formatearFecha(partido.fecha)}</strong>
                            </div>

                            <div className="col-sm-6">
                              <small className="text-muted d-block">Sede</small>

                              <strong>
                                {partido.sede?.nombre || "Sin asignar"}
                              </strong>
                            </div>

                            <div className="col-sm-6">
                              <small className="text-muted d-block">Fase</small>

                              <strong>{obtenerFase(partido)}</strong>
                            </div>

                            <div className="col-sm-6">
                              <small className="text-muted d-block">
                                Partido
                              </small>

                              <strong>#{partido.id}</strong>
                            </div>
                          </div>
                        </div>

                        {/* BOTÓN */}

                        <div className="d-flex justify-content-end mt-auto">
                          <Link
                            to={`/panel/arbitro/partidos/${partido.id}`}
                            className={
                              partido.estado === "jugado"
                                ? "btn btn-dark"
                                : "btn btn-secondary"
                            }
                          >
                            {partido.estado === "jugado"
                              ? "Gestionar faltas"
                              : "Ver partido"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ArbitroDashboard;