import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CrearAnuncio = () => {

    const navigate = useNavigate();

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
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
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
        <div className="container mt-5 mb-5 col-md-8">

            <h2 className="mb-4">Crear anuncio</h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label className="form-label">Título</label>
                    <input
                        type="text"
                        className="form-control"
                        value={titulo}
                        onChange={(e) => { setTitulo(e.target.value); setMensaje(""); }}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Contenido</label>
                    <textarea
                        className="form-control"
                        rows="6"
                        value={contenido}
                        onChange={(e) => { setContenido(e.target.value); setMensaje(""); }}
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
                    <small className="text-muted">JPG, PNG, WEBP, GIF. Máximo 5MB.</small>
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
                                    border: "1px solid #dee2e6"
                                }}
                            />
                        </div>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary mt-2"
                            onClick={() => { setImagen(null); setPreview(null); }}
                        >
                            Quitar imagen
                        </button>
                    </div>
                )}

                <button className="btn btn-dark" disabled={loading}>
                    {loading ? "Creando..." : "Crear anuncio"}
                </button>

            </form>

            {mensaje && (
                <div className="alert alert-danger mt-3">{mensaje}</div>
            )}

        </div>
    );
};

export default CrearAnuncio;