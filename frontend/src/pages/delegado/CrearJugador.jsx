import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CrearJugador = () => {
  const navigate = useNavigate();
  const { id: equipoId } = useParams();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    dorsal: '',
    fechaNacimiento: '',
    edad: ''
  });

  // Función para calcular la edad automáticamente
  const calcularEdad = (fechaNacimientoStr) => {
    if (!fechaNacimientoStr) return '';
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimientoStr);
    let edadCalculada = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edadCalculada--;
    }
    
    return edadCalculada >= 0 ? edadCalculada : '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'fechaNacimiento') {
      const edadCalculada = calcularEdad(value);
      setFormData({
        ...formData,
        fechaNacimiento: value,
        edad: edadCalculada
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para guardar el jugador en tu API o base de datos
    console.log('Guardando jugador para el equipo:', equipoId, formData);

    // Al guardar, vuelve al listado de jugadores
    navigate(`/panel/delegado/equipos/${equipoId}/jugadores`);
  };

  const handleVolver = () => {
    navigate(-1);
  };

  return (
    <div className="container mt-4">
      {/* Migas de pan / Breadcrumbs idénticos al sistema */}
      <div className="mb-3">
        <small className="text-muted" style={{ cursor: 'pointer' }} onClick={() => navigate('/panel/delegado/equipos')}>
          Delegado Dashboard &gt; Mis Equipos &gt; Jugadores &gt; Crear Jugador
        </small>
        <h3 className="fw-bold mt-1">Gestión de Jugadores</h3>
      </div>

      {/* Botón Volver alineado arriba a la izquierda */}
      <div className="mb-4">
        <button className="btn btn-dark" onClick={handleVolver}>
          Volver
        </button>
      </div>

      {/* Tarjeta con header oscuro idéntica a Mis Equipos */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white py-3">
          <h5 className="mb-0">Crear Jugador</h5>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="nombre" className="form-label fw-bold">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="apellido" className="form-label fw-bold">Apellido</label>
                <input
                  type="text"
                  className="form-control"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="dni" className="form-label fw-bold">DNI</label>
                <input
                  type="text"
                  className="form-control"
                  id="dni"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="dorsal" className="form-label fw-bold">Dorsal</label>
                <input
                  type="number"
                  className="form-control"
                  id="dorsal"
                  name="dorsal"
                  value={formData.dorsal}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="fechaNacimiento" className="form-label fw-bold">Fecha de nacimiento</label>
                <input
                  type="date"
                  className="form-control"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="edad" className="form-label fw-bold">Edad</label>
                <input
                  type="number"
                  className="form-control bg-light"
                  id="edad"
                  name="edad"
                  value={formData.edad}
                  readOnly
                  disabled
                />
              </div>
            </div>

            {/* Botón Guardar Jugador alineado abajo a la derecha */}
            <div className="d-flex justify-content-end mt-4">
              <button type="submit" className="btn btn-dark">
                Guardar Jugador
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearJugador;