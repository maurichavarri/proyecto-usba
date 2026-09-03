import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const MisEquipos = () => {
  const navigate = useNavigate();

  const [showHelp, setShowHelp] = useState(false);
  const [equipos, setEquipos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    obtenerEquipos();
  }, []);

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
        throw new Error(data.message || "Error al obtener los equipos.");
      }

      setEquipos(data);
    } catch (error) {
      console.error(error);

      setMensaje(error.message);
    }
  };

  const equiposFiltrados = equipos.filter((equipo) => {
    const texto = busqueda.toLowerCase();
    const nombre = equipo?.nombre?.toLowerCase() || "";
    const descripcion = equipo?.descripcion?.toLowerCase() || "";
    return nombre.includes(texto) || descripcion.includes(texto);
  });

  return (
    <div className="container mt-5 mb-5">
      <div className="col-lg-10 mx-auto">
        {/* Bradcrumb y Titulo */}
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

            <span className="text-muted">Mis Equipos</span>
          </nav>

          <div className="d-flex align-items-center mb-2">
            <h3 className="fw-bold me-2 mb-0">Mis Equipos</h3>

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

        {/* BOTONES */}
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
            onClick={() => navigate("/panel/delegado/equipos/crear")}
          >
            + Crear equipo
          </button>
        </div>

        {/* ERROR */}
        {mensaje && <div className="alert alert-danger">{mensaje}</div>}

        {/* LISTADO */}
        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center gap-3 flex-wrap">
            <strong>Equipos</strong>

            <input
              type="text"
              className="form-control w-auto"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="card-body">
            {equipos.length === 0 ? (
              <div className="alert alert-info mb-0">
                <p className="mb-2">No existen equipos creados.</p>
              </div>
            ) : equiposFiltrados.length === 0 ? (
              <div className="text-center text-muted py-3">
                No se encontraron equipos.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Equipo</th>
                      <th>Año de creación</th>
                      <th>Jugadores actuales</th>
                      <th>Competencias</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {equiposFiltrados.map((equipo) => (
                      <tr key={equipo.id}>
                        <td>
                          <strong>{equipo.nombre}</strong>

                          {equipo.descripcion && (
                            <>
                              <br />

                              <small className="text-muted">
                                {equipo.descripcion}
                              </small>
                            </>
                          )}
                        </td>

                        <td>{equipo.creado_en || "-"}</td>

                        <td>
                          <strong>{equipo.cantidad_jugadores ?? 0}</strong>

                          {" / 12"}
                        </td>

                        <td>{equipo.cantidad_competencias ?? 0}</td>

                        <td>
                          <div className="d-flex gap-2 flex-wrap">
                            <Link
                              to={`/panel/delegado/equipos/${equipo.id}/jugadores`}
                              className="btn btn-dark btn-sm"
                            >
                              Gestionar
                            </Link>

                            <Link
                              to={`/panel/delegado/equipos/${equipo.id}/historial`}
                              className="btn btn-outline-secondary btn-sm"
                            >
                              Historial
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

              <p>
                Desde esta sección podés consultar y administrar tus equipos.
              </p>

              <p>
                Cada equipo conserva su identidad a lo largo del tiempo y podrá
                participar en distintas competencias.
              </p>

              <ul className="mb-0">
                <li>No podés crear dos equipos con el mismo nombre.</li>

                <li>
                  El plantel puede modificarse cuando el equipo no se encuentra
                  comprometido en una inscripción.
                </li>

                <li>
                  Las participaciones del equipo se conservarán como parte de su
                  historial.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisEquipos;
