import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CrearInscripcion = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    equipoId: "",
    torneoId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Guardando inscripción:", formData);
    // Redirige al listado de inscripciones al guardar
    navigate("/panel/delegado/inscripciones");
  };

  const handleVolver = () => {
    navigate(-1);
  };

  return (
    <div className="container mt-4">
      {/* Migas de pan / Breadcrumbs */}
      <div className="mb-3">
        <small
          className="text-muted"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/panel/delegado/inscripciones")}
        >
          Delegado Dashboard &gt; Mis Inscripciones &gt; Crear Inscripción
        </small>
        <h3 className="fw-bold mt-1">Gestión de Inscripciones</h3>
      </div>

      {/* Botón Volver alineado arriba a la izquierda */}
      <div className="mb-4">
        <button className="btn btn-dark" onClick={handleVolver}>
          Volver
        </button>
      </div>

      {/* Tarjeta con header oscuro idéntica al resto del sistema */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white py-3">
          <h5 className="mb-0">Formulario de inscripción</h5>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="equipoId" className="form-label fw-bold">
                Equipo
              </label>
              <select
                className="form-select"
                id="equipoId"
                name="equipoId"
                value={formData.equipoId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar equipo</option>
                <option value="1">Boca</option>
                <option value="2">River</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="torneoId" className="form-label fw-bold">
                Torneo / Categoría
              </label>
              <select
                className="form-select"
                id="torneoId"
                name="torneoId"
                value={formData.torneoId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar torneo</option>
                <option value="1">Torneo Apertura 2026 - Primera</option>
                <option value="2">Torneo Clausura 2026 - Senior</option>
              </select>
            </div>

            {/* Botón Inscribirse alineado abajo a la derecha */}
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-dark">
                Inscribirse
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearInscripcion;