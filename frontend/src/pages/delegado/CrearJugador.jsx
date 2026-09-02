import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CrearJugador = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    dorsal: "",
    fecha_nacimiento: "",
    sexo: ""
  });

  const [mensaje, setMensaje] = useState("");
  const [mostrarLimiteJugadores, setMostrarLimiteJugadores] = useState(false);
  const [mostrarPlantelBloqueado, setMostrarPlantelBloqueado] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "dni" ? value.replace(/\D/g, "") : value
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

    if (formData.dorsal === "") {
      return "El dorsal es obligatorio.";
    }

    const dorsal = Number(formData.dorsal);

    if (!Number.isInteger(dorsal) || dorsal < 0 || dorsal > 99) {
      return "El dorsal debe ser un número entre 0 y 99.";
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
      const response = await fetch("http://localhost:3000/api/v1/delegado/jugadores",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            nombre: formData.nombre.trim(),
            apellido: formData.apellido.trim(),
            dni: formData.dni,
            dorsal: Number(formData.dorsal),
            fecha_nacimiento: formData.fecha_nacimiento,
            sexo: formData.sexo,
            equipo_id: Number(id)
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "El equipo ya alcanzó el máximo permitido de 12 jugadores.") {
          setMostrarLimiteJugadores(true);
          return;
        }

        if (data.code === "PLANTEL_BLOQUEADO") {
          setMostrarPlantelBloqueado(true);
          return;
        }

        setMensaje(data.message || "Error al crear jugador");
        return;
      }

      navigate(`/panel/delegado/equipos/${id}/jugadores`);

    } catch (error) {
      console.error(error);
      setMensaje("Ocurrió un error al crear el jugador.");
    }
  };


  return (
    <div className="container mt-5 mb-5">
      <div className="col-lg-10 mx-auto">

        {/* BREADCRUMB */}
        <nav
          className="mb-2"
          style={{
            fontSize: "0.9rem"
          }}
        >
          <span
            className="text-muted"
            style={{
              cursor: "pointer"
            }}
            onClick={() =>
              navigate(
                "/panel/delegado"
              )
            }
          >
            Panel de Delegado
          </span>

          {" > "}

          <span
            className="text-muted"
            style={{
              cursor: "pointer"
            }}
            onClick={() =>
              navigate(
                "/panel/delegado/equipos"
              )
            }
          >
            Mis Equipos
          </span>

          {" > "}

          <span
            className="text-muted"
            style={{
              cursor: "pointer"
            }}
            onClick={() =>
              navigate(
                `/panel/delegado/equipos/${id}/jugadores`
              )
            }
          >
            Mis Jugadores
          </span>

          {" > "}

          <span className="text-muted">
            Crear jugador
          </span>

        </nav>


        <h3 className="fw-bold mb-3">
          Crear Jugador
        </h3>

        <button
          type="button"
          className="btn btn-dark mb-3"
          onClick={() =>
            navigate(
              `/panel/delegado/equipos/${id}/jugadores`
            )
          }
        >
          ← Regresar al plantel
        </button>


        <div className="card shadow-sm">

          <div className="card-header bg-dark text-white">

            <strong>
              Datos del jugador
            </strong>

          </div>


          <div className="card-body p-4">

            {
              mensaje && (

                <div className="alert alert-danger">
                  {mensaje}
                </div>

              )
            }


            <form onSubmit={handleSubmit}>


              {/* NOMBRE Y APELLIDO */}

              <div className="row">

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Nombre
                  </label>

                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Apellido
                  </label>

                  <input
                    type="text"
                    name="apellido"
                    className="form-control"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* DNI Y DORSAL */}

              <div className="row">

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    DNI
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    name="dni"
                    className="form-control"
                    maxLength="8"
                    value={formData.dni}
                    onChange={handleChange}
                    placeholder="Ej: 40123456"
                    required
                  />

                </div>


                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Dorsal
                  </label>

                  <input
                    type="number"
                    name="dorsal"
                    className="form-control"
                    min="0"
                    max="99"
                    value={formData.dorsal}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* NACIMIENTO Y SEXO */}

              <div className="row">

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Fecha de nacimiento
                  </label>

                  <input
                    type="date"
                    name="fecha_nacimiento"
                    className="form-control"
                    value={
                      formData.fecha_nacimiento
                    }
                    onChange={handleChange}
                    required
                  />

                  <small className="text-muted">
                    Se utilizará para validar
                    la edad correspondiente a
                    la categoría.
                  </small>

                </div>


                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Sexo
                  </label>

                  <select
                    name="sexo"
                    className="form-select"
                    value={formData.sexo}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Seleccionar
                    </option>

                    <option value="masculino">
                      Masculino
                    </option>

                    <option value="femenino">
                      Femenino
                    </option>

                  </select>

                </div>

              </div>


              <div className="d-flex gap-2 mt-2">

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Crear jugador
                </button>


                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    navigate(
                      `/panel/delegado/equipos/${id}/jugadores`
                    )
                  }
                >
                  Cancelar
                </button>

              </div>

            </form>

          </div>

        </div>


        {/* MODAL MAXIMO */}

        {
          mostrarLimiteJugadores && (

            <div
              className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
              style={{
                backgroundColor:
                  "rgba(0,0,0,0.5)",
                zIndex: 1050
              }}
            >

              <div
                className="bg-white p-4 rounded shadow text-center"
                style={{
                  width: "90%",
                  maxWidth: "450px"
                }}
              >

                <div
                  className="text-warning mb-3"
                  style={{
                    fontSize: "3rem"
                  }}
                >
                  ⚠
                </div>

                <h4>
                  Plantel completo
                </h4>

                <p className="text-muted">

                  El equipo ya alcanzó el
                  máximo permitido de

                  <strong>
                    {" "}12 jugadores
                  </strong>.

                </p>

                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() =>
                    setMostrarLimiteJugadores(false)
                  }
                >
                  Aceptar
                </button>

              </div>

            </div>

          )
        }


        {/* MODAL PLANTEL BLOQUEADO */}

        {
          mostrarPlantelBloqueado && (

            <div
              className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
              style={{
                backgroundColor:
                  "rgba(0,0,0,0.5)",
                zIndex: 1050
              }}
            >

              <div
                className="bg-white p-4 rounded shadow text-center"
                style={{
                  width: "90%",
                  maxWidth: "480px"
                }}
              >

                <div
                  className="text-warning mb-3"
                  style={{
                    fontSize: "3rem"
                  }}
                >
                  ⚠
                </div>

                <h4>
                  Plantel bloqueado
                </h4>

                <p className="text-muted">

                  No es posible agregar jugadores
                  porque este equipo ya realizó una
                  inscripción.

                </p>

                <p>
                  El plantel debe conservarse sin
                  modificaciones por cuestiones de
                  seguridad.
                </p>

                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() =>
                    navigate(
                      `/panel/delegado/equipos/${id}/jugadores`
                    )
                  }
                >
                  Aceptar
                </button>

              </div>

            </div>

          )
        }

      </div>

    </div>
  );
};

export default CrearJugador;