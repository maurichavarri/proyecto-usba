import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const HistorialEquipo = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [equipo, setEquipo] = useState(null);

  const [participaciones, setParticipaciones] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [mensaje, setMensaje] = useState("");

  // =========================
  // CARGAR HISTORIAL
  // =========================

  useEffect(() => {
    obtenerHistorial();
  }, [id]);

  const obtenerHistorial = async () => {
    try {
      setCargando(true);

      setMensaje("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/api/v1/delegado/equipos/${id}/historial`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No fue posible obtener el historial.");
      }

      setEquipo(data.equipo);

      setParticipaciones(data.participaciones || []);
    } catch (error) {
      console.error(error);

      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  };

  // =========================
  // FECHA
  // =========================

  const formatearFecha = (fecha) => {
    if (!fecha) {
      return "-";
    }

    const limpia = String(fecha).split("T")[0];

    const [anio, mes, dia] = limpia.split("-");

    if (!anio || !mes || !dia) {
      return fecha;
    }

    return `${dia}/${mes}/${anio}`;
  };

  // =========================
  // ESTADO COMPETENCIA
  // =========================

  const mostrarEstadoCompetencia = (estado) => {
    if (estado === "finalizada") {
      return <span className="badge bg-secondary">Finalizada</span>;
    }

    return <span className="badge bg-success">En curso</span>;
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="col-lg-10 mx-auto">
        {/* BREADCRUMB */}

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

          <span className="text-muted">Historial</span>
        </nav>

        {/* TÍTULO */}

        <div className="mb-4">
          <h3 className="fw-bold mb-1">
            Historial de {equipo?.nombre || "equipo"}
          </h3>

          <p className="text-muted mb-0">
            Participaciones y planteles presentados en competencias.
          </p>
        </div>

        {/* VOLVER */}

        <div className="d-flex gap-2 mb-4">
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => navigate("/panel/delegado/equipos")}
          >
            ← Volver
          </button>

          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => navigate(`/panel/delegado/equipos/${id}/jugadores`)}
          >
            Ver plantel actual
          </button>
        </div>

        {/* ERROR */}

        {mensaje && <div className="alert alert-danger">{mensaje}</div>}

        {/* CARGANDO */}

        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status" />

            <p className="text-muted mt-3">Cargando historial...</p>
          </div>
        ) : participaciones.length === 0 ? (
          <div className="card shadow-sm">
            <div className="card-body text-center py-5">
              <h5>Sin participaciones todavía</h5>

              <p className="text-muted mb-0">
                Este equipo todavía no posee inscripciones confirmadas en
                competencias.
              </p>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {participaciones.map((participacion) => {
              const torneo = participacion.torneoCategoria?.torneo;

              const categoria = participacion.torneoCategoria?.categoria;

              const jugadores = participacion.jugadores || [];

              return (
                <div className="card shadow-sm" key={participacion.id}>
                  {/* CABECERA */}

                  <div className="card-header bg-dark text-white">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <div>
                        <strong>{torneo?.nombre || "Torneo"}</strong>

                        <span className="mx-2">—</span>

                        <span>{categoria?.nombre || "Categoría"}</span>
                      </div>

                      {mostrarEstadoCompetencia(
                        participacion.torneoCategoria?.estado_competencia,
                      )}
                    </div>
                  </div>

                  <div className="card-body">
                    {/* DATOS */}

                    <div className="row mb-4">
                      <div className="col-md-4 mb-2">
                        <small className="text-muted d-block">
                          Fecha de inscripción
                        </small>

                        <strong>{formatearFecha(participacion.fecha)}</strong>
                      </div>

                      <div className="col-md-4 mb-2">
                        <small className="text-muted d-block">
                          Inicio del torneo
                        </small>

                        <strong>{formatearFecha(torneo?.fecha_inicio)}</strong>
                      </div>

                      <div className="col-md-4 mb-2">
                        <small className="text-muted d-block">
                          Plantel registrado
                        </small>

                        <strong>{jugadores.length} jugadores</strong>
                      </div>
                    </div>

                    {/* PLANTEL HISTÓRICO */}

                    <h5 className="mb-3">Plantel presentado</h5>

                    {jugadores.length === 0 ? (
                      <div className="alert alert-warning mb-0">
                        No se encontró un plantel histórico para esta
                        inscripción.
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead>
                            <tr>
                              <th>Dorsal</th>

                              <th>Jugador</th>

                              <th>DNI</th>

                              <th>Sexo</th>

                              <th>Rol</th>
                            </tr>
                          </thead>

                          <tbody>
                            {jugadores.map((jugador) => (
                              <tr key={jugador.id}>
                                <td>
                                  <strong>#{jugador.dorsal}</strong>
                                </td>

                                <td>
                                  {jugador.nombre} {jugador.apellido}
                                </td>

                                <td>{jugador.dni}</td>

                                <td>
                                  {jugador.sexo === "masculino"
                                    ? "Masculino"
                                    : "Femenino"}
                                </td>

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
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialEquipo;