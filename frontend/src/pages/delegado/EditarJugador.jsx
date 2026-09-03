import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditarJugador = () => {
  const navigate = useNavigate();

  const { equipoId, jugadorId } = useParams();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    dorsal: "",
    fecha_nacimiento: "",
    sexo: "",
    es_delegado: false,
  });

  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [mostrarPlantelBloqueado, setMostrarPlantelBloqueado] = useState(false);

  useEffect(() => {
    obtenerJugador();
  }, [jugadorId]);

  const obtenerJugador = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/v1/delegado/jugadores/${jugadorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener jugador");
      }

      setFormData({
        nombre: data.nombre || "",
        apellido: data.apellido || "",
        dni: data.dni || "",
        dorsal: data.dorsal ?? "",
        fecha_nacimiento: data.fecha_nacimiento || "",
        sexo: data.sexo || "",
        es_delegado: data.es_delegado === true,
      });
    } catch (error) {
      console.error(error);
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "dni" ? value.replace(/\D/g, "") : value,
    });
  };

  const validarFormulario = () => {
    if (!formData.nombre.trim()) {
      return "El nombre es obligatorio.";
    }

    if (!formData.apellido.trim()) {
      return "El apellido es obligatorio.";
    }

    if (!/^\d{7,8}$/.test(formData.dni)) {
      return "El DNI debe contener 7 u 8 números.";
    }

    const dorsal = Number(formData.dorsal);

    if (!Number.isInteger(dorsal) || dorsal < 0 || dorsal > 99) {
      return "El dorsal debe estar entre 0 y 99.";
    }

    if (!formData.fecha_nacimiento) {
      return "La fecha de nacimiento es obligatoria.";
    }

    if (!formData.sexo) {
      return "Debés seleccionar el sexo del jugador.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validarFormulario();

    if (error) {
      setMensaje(error);
      return;
    }

    setMensaje("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/v1/delegado/jugadores/${jugadorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            nombre: formData.nombre.trim(),
            apellido: formData.apellido.trim(),
            dni: formData.dni,
            dorsal: Number(formData.dorsal),
            fecha_nacimiento: formData.fecha_nacimiento,
            sexo: formData.sexo,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.code === "PLANTEL_BLOQUEADO") {
          setMostrarPlantelBloqueado(true);
          return;
        }

        setMensaje(data.message || "Error al actualizar jugador");
        return;
      }

      navigate(`/panel/delegado/equipos/${equipoId}/jugadores`);
    } catch (error) {
      console.error(error);
      setMensaje("Error al actualizar jugador");
    }
  };

  if (cargando) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info">Cargando jugador...</div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="col-lg-10 mx-auto">
        {/* Breadcrumb y Titulo */}
        <div className="mb-3">
          <nav className="mb-1" style={{ fontSize: "0.9rem" }}>
            <span
              className="text-muted"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/panel/delegado")}
            >
              Panel de Delegado
            </span>

            {" > "}

            <span
              className="text-muted"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/panel/delegado/equipos")}
            >
              Mis Equipos
            </span>

            {" > "}

            <span
              className="text-muted"
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/panel/delegado/equipos/${equipoId}/jugadores`)
              }
            >
              Mis Jugadores
            </span>

            {" > "}

            <span className="text-muted">Editar Jugador</span>
          </nav>
          <div className="d-flex align-items-center mb-2">
            <h3 className="fw-bold me-2 mb-0">Editar Jugador</h3>
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
                backgroundColor: "#6c757d", // gris Bootstrap
                color: "white",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              ?
            </span>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-dark mb-3"
          onClick={() =>
            navigate(`/panel/delegado/equipos/${equipoId}/jugadores`)
          }
        >
          ← Volver
        </button>

        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white">
            <strong>Datos del jugador</strong>
          </div>

          <div className="card-body p-4">
            {mensaje && <div className="alert alert-danger">{mensaje}</div>}
            {formData.es_delegado && (
              <div className="alert alert-info">
                <strong>Sos el delegado de este equipo.</strong>
                <br />
                Tus datos personales forman parte de tu perfil de delegado y no
                pueden modificarse desde esta sección.
                <br />
                Mientras el plantel se encuentre habilitado, únicamente podés
                modificar tu dorsal.
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={formData.es_delegado}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    className="form-control"
                    value={formData.apellido}
                    onChange={handleChange}
                    disabled={formData.es_delegado}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">DNI</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="dni"
                    maxLength="8"
                    className="form-control"
                    value={formData.dni}
                    onChange={handleChange}
                    disabled={formData.es_delegado}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Dorsal</label>
                  <input
                    type="number"
                    name="dorsal"
                    min="0"
                    max="99"
                    className="form-control"
                    value={formData.dorsal}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Fecha de nacimiento</label>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    className="form-control"
                    value={formData.fecha_nacimiento}
                    onChange={handleChange}
                    disabled={formData.es_delegado}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Sexo</label>
                  <select
                    name="sexo"
                    className="form-select"
                    value={formData.sexo}
                    onChange={handleChange}
                    disabled={formData.es_delegado}
                    required
                  >
                    <option value="">Seleccionar</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                  </select>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  Guardar cambios
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    navigate(`/panel/delegado/equipos/${equipoId}/jugadores`)
                  }
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>

        {mostrarPlantelBloqueado && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1050,
            }}
          >
            <div
              className="bg-white p-4 rounded shadow text-center"
              style={{
                width: "90%",
                maxWidth: "480px",
              }}
            >
              <div
                className="text-warning mb-3"
                style={{
                  fontSize: "3rem",
                }}
              >
                ⚠
              </div>

              <h4>Plantel bloqueado</h4>

              <p className="text-muted">
                No es posible modificar este jugador porque el equipo ya realizó
                una inscripción.
              </p>

              <button
                type="button"
                className="btn btn-dark"
                onClick={() =>
                  navigate(`/panel/delegado/equipos/${equipoId}/jugadores`)
                }
              >
                Aceptar
              </button>
            </div>
          </div>
        )}

        {/* Modal ayuda */}
        {showHelp && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          >
            <div
              className="bg-white p-4 rounded shadow"
              style={{ maxWidth: "550px" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>¿Cómo funciona este apartado?</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowHelp(false)}
                />
              </div>
              <p>
                Desde esta sección podés editar la información de tu jugador.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditarJugador;
