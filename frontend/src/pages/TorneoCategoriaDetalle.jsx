import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const TorneoCategoriaDetalle = () => {
  const { torneoId, categoriaId } = useParams();
  const navigate = useNavigate();
  
  const [detalle, setDetalle] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [fixture, setFixture] = useState([]);
  const [tabla, setTabla] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        // 1. Obtener info del torneo-categoría (nombre torneo, nombre categoría, arancel, etc)
        const resInfo = await fetch(`http://localhost:3000/api/v1/torneos/${torneoId}/categorias/${categoriaId}`);
        const info = await resInfo.json();
        
        // 2. Obtener equipos inscriptos
        const resEquipos = await fetch(`http://localhost:3000/api/v1/torneos/${torneoId}/categorias/${categoriaId}/equipos`);
        const equiposData = await resEquipos.json();
        
        // 3. Obtener fixture (partidos)
        const resFixture = await fetch(`http://localhost:3000/api/v1/torneos/${torneoId}/categorias/${categoriaId}/fixture`);
        const fixtureData = await resFixture.json();
        
        // 4. Obtener tabla de posiciones
        const resTabla = await fetch(`http://localhost:3000/api/v1/torneos/${torneoId}/categorias/${categoriaId}/tabla`);
        const tablaData = await resTabla.json();
        
        setDetalle(info);
        setEquipos(equiposData);
        setFixture(fixtureData);
        setTabla(tablaData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [torneoId, categoriaId]);

  return (
    <section className="container mt-3 mb-5">
      <button 
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate(`/torneos/${torneoId}/categorias`)}
      >
        ← Volver a categorías
      </button>

      <h2 className="mb-2">{detalle?.torneo_nombre}</h2>
      <h4 className="mb-4 text-muted">{detalle?.categoria_nombre}</h4>
      
      {detalle?.arancel && (
        <div className="alert alert-info">
          <strong>Arancel de inscripción:</strong> ${detalle.arancel.toLocaleString("es-AR")}
        </div>
      )}

      {/* Equipos inscriptos */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Equipos inscriptos</h5>
        </div>
        <div className="card-body">
          {equipos.length === 0 ? (
            <p>No hay equipos inscriptos aún.</p>
          ) : (
            <div className="row">
              {equipos.map((equipo) => (
                <div key={equipo.id} className="col-md-4 mb-2">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-trophy-fill me-2 text-warning"></i>
                    <span>{equipo.nombre}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabla de posiciones */}
      <div className="card mb-4">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Tabla de posiciones</h5>
        </div>
        <div className="card-body p-0">
          {tabla.length === 0 ? (
            <div className="p-3">No hay datos de posiciones aún.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Equipo</th>
                    <th>PJ</th>
                    <th>PG</th>
                    <th>PE</th>
                    <th>PP</th>
                    <th>GF</th>
                    <th>GC</th>
                    <th>DG</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {tabla.map((equipo, idx) => (
                    <tr key={equipo.id}>
                      <td>{idx + 1}</td>
                      <td><strong>{equipo.nombre}</strong></td>
                      <td>{equipo.pj || 0}</td>
                      <td>{equipo.pg || 0}</td>
                      <td>{equipo.pe || 0}</td>
                      <td>{equipo.pp || 0}</td>
                      <td>{equipo.gf || 0}</td>
                      <td>{equipo.gc || 0}</td>
                      <td>{equipo.dg || 0}</td>
                      <td><strong>{equipo.puntos || 0}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Fixture */}
      <div className="card">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Fixture</h5>
        </div>
        <div className="card-body p-0">
          {fixture.length === 0 ? (
            <div className="p-3">No hay partidos programados aún.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Fecha</th>
                    <th>Local</th>
                    <th></th>
                    <th>Visitante</th>
                    <th>Sede</th>
                    <th>Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {fixture.map((partido) => (
                    <tr key={partido.id}>
                      <td>{new Date(partido.fecha).toLocaleDateString("es-AR")}</td>
                      <td className="text-end">{partido.equipo_local}</td>
                      <td className="text-center">vs</td>
                      <td>{partido.equipo_visitante}</td>
                      <td>{partido.sede || "Por definir"}</td>
                      <td className="text-center">
                        {partido.puntaje_local !== null && partido.puntaje_visitante !== null
                          ? `${partido.puntaje_local} - ${partido.puntaje_visitante}`
                          : partido.estado === "pendiente" 
                            ? <span className="badge bg-warning">Pendiente</span>
                            : <span className="badge bg-secondary">{partido.estado}</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TorneoCategoriaDetalle;