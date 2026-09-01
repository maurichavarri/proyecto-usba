import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const JugadoresEquipos = () => {
  const navigate = useNavigate();
  const { id: equipoId } = useParams();

  // Estado para los jugadores (puedes reemplazarlo con tu llamada a la API)
  const [jugadores, setJugadores] = useState([
    { id: 1, nombre: 'Juan', apellido: 'Pérez', dni: '12345678', dorsal: 10, edad: 22 },
    { id: 2, nombre: 'Carlos', apellido: 'Gómez', dni: '87654321', dorsal: 7, edad: 24 }
  ]);

  const handleAgregarJugador = () => {
    navigate(`/panel/delegado/equipos/${equipoId}/jugadores/crear`);
  };

  const handleVolverAlPanel = () => {
    navigate(`/panel/delegado/equipos`);
  };

  return (
    <div className="container mt-4">
      {/* Migas de pan / Breadcrumbs idénticos al sistema */}
      <div className="mb-3">
        <small className="text-muted" style={{ cursor: 'pointer' }} onClick={() => navigate('/panel/delegado/equipos')}>
          Delegado Dashboard &gt; Mis Equipos &gt; Jugadores
        </small>
        <h3 className="fw-bold mt-1">Gestión de Jugadores</h3>
      </div>

      {/* Botones superiores alineados */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-dark" onClick={handleVolverAlPanel}>
          Volver
        </button>
        <button className="btn btn-dark" onClick={handleAgregarJugador}>
          + Agregar Jugador
        </button>
      </div>

      {/* Tarjeta con header oscuro que incluye el contador dinámico */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Plantel del Equipo (ID: {equipoId})</h5>
          <span className="badge bg-secondary fs-6">
            Jugadores: {jugadores.length}/12 | Faltan: {12 - jugadores.length}
          </span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="py-3 ps-3">Dorsal</th>
                  <th className="py-3">Nombre</th>
                  <th className="py-3">Apellido</th>
                  <th className="py-3">DNI</th>
                  <th className="py-3">Edad</th>
                  <th className="py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {jugadores.length > 0 ? (
                  jugadores.map((jugador) => (
                    <tr key={jugador.id}>
                      <td className="ps-3">
                        <span className="badge bg-secondary fs-6">{jugador.dorsal}</span>
                      </td>
                      <td>{jugador.nombre}</td>
                      <td>{jugador.apellido}</td>
                      <td>{jugador.dni}</td>
                      <td>{jugador.edad} años</td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-dark me-1">Editar</button>
                        <button className="btn btn-sm btn-outline-danger">Historial</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No hay jugadores registrados en este equipo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JugadoresEquipos;