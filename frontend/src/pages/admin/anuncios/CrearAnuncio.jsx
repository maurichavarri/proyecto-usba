import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CrearAnuncio = () => {
  const navigate = useNavigate();

  const [showHelp, setShowHelp] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImagenChange = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setImagen(archivo);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(archivo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("contenido", contenido);
      if (imagen) {
        formData.append("imagen", imagen);
      }

      const response = await fetch(
        "http://localhost:3000/api/v1/anuncios/crear",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMensaje(data.message);
        return;
      }

      navigate("/panel/admin/anuncios");
    } catch (error) {
      console.error(error);
      setMensaje("Error al crear el anuncio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="col-lg-10 mx-auto">
        {/* Breadcrumb y Titulo */}
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
              onClick={() => navigate("/panel/admin/anuncios")}
            >
              Anuncios
            </span>

            {" > "}

            <span className="text-muted">Crear Anuncio</span>
          </nav>

          <div className="d-flex align-items-center mb-2">
            <h3 className="fw-bold me-2 mb-0">Crear Anuncio</h3>

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

        {/* Botones */}
        <div className="d-flex justify-content-between mb-3">
          <button
            className="btn btn-dark"
            onClick={() => navigate("/panel/admin/anuncios")}
          >
            ← Volver
          </button>
        </div>

        {/* Card con header y formulario */}
        <div className="card shadow-sm">
          <div className="card-header bg-dark">
            <strong className="text-white">Formulario de creación</strong>
          </div>
          <div className="card-body p-3">
            {/* 
            {error && <div className="alert alert-danger mb-3">{error}</div>}
            */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  className="form-control"
                  value={titulo}
                  onChange={(e) => {
                    setTitulo(e.target.value);
                    setMensaje("");
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Contenido</label>
                <textarea
                  className="form-control"
                  rows="6"
                  value={contenido}
                  onChange={(e) => {
                    setContenido(e.target.value);
                    setMensaje("");
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Imagen (opcional)</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImagenChange}
                />
                <small className="text-muted">
                  JPG, PNG, WEBP, GIF. Máximo 5MB.
                </small>
              </div>

              {preview && (
                <div className="mb-3">
                  <label className="form-label">Vista previa:</label>
                  <div>
                    <img
                      src={preview}
                      alt="Vista previa"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #dee2e6",
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary mt-2"
                    onClick={() => {
                      setImagen(null);
                      setPreview(null);
                    }}
                  >
                    Quitar imagen
                  </button>
                </div>
              )}

              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Creando..." : "Crear anuncio"}
              </button>
            </form>
          </div>
        </div>

        {mensaje && <div className="alert alert-danger mt-3">{mensaje}</div>}

        {/* Modal de ayuda */}
        {showHelp && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div
              className="bg-white p-4 rounded shadow"
              style={{ maxWidth: "500px" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>¿Cómo funciona este apartado?</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowHelp(false)}
                ></button>
              </div>
              <p>
                En este apartado podés crear un nuevo anuncio. Podés asignar titulo,
                contenido (o cuerpo de la noticia) e imagen (opcional).
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrearAnuncio;
