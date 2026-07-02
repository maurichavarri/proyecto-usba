import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditarAnuncio = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        titulo: "",
        contenido: ""
    });
    const [imagenActual, setImagenActual] = useState(null); // URL de imagen guardada en BD
    const [nuevaImagen, setNuevaImagen] = useState(null);   // Archivo nuevo seleccionado
    const [preview, setPreview] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        obtenerAnuncio();
    }, []);

    const obtenerAnuncio = async () => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/v1/anuncios/${id}`
            );
            const data = await response.json();

            setFormData({
                titulo: data.titulo || "",
                contenido: data.contenido || ""
            });

            // Guardamos la imagen existente para mostrarla
            setImagenActual(data.imagen || null);

        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setMensaje("");
    };

    const handleImagenChange = (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        setNuevaImagen(archivo);

        // Previsualización local de la nueva imagen
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

            const data = new FormData();
            data.append("titulo", formData.titulo);
            data.append("contenido", formData.contenido);
            if (nuevaImagen) {
                data.append("imagen", nuevaImagen);
            }

            const response = await fetch(
                `http://localhost:3000/api/v1/anuncios/${id}`,
                {
                    method: "PUT",
                    headers: {
                        // NO pongas Content-Type — el browser lo maneja automático con FormData
                        Authorization: `Bearer ${token}`
                    },
                    body: data
                }
            );

            const result = await response.json();

            if (!response.ok) {
                setMensaje(result.message);
                return;
            }

            navigate("/panel/admin/anuncios");

        } catch (error) {
            console.error(error);
            setMensaje("Error al actualizar el anuncio");
        } finally {
            setLoading(false);
        }
    };

    const imagenMostrada = preview || (imagenActual ? `http://localhost:3000${imagenActual}` : null);

    return (
        <div className="container mt-5 mb-5 col-md-8">

            <h2 className="mb-4">Editar anuncio</h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label className="form-label">Título</label>
                    <input
                        type="text"
                        name="titulo"
                        className="form-control"
                        value={formData.titulo}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Contenido</label>
                    <textarea
                        name="contenido"
                        className="form-control"
                        rows="6"
                        value={formData.contenido}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        {imagenActual ? "Cambiar imagen" : "Agregar imagen (opcional)"}
                    </label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleImagenChange}
                    />
                    <small className="text-muted">Formatos permitidos: JPG, PNG, WEBP, GIF. Máximo 5MB.</small>
                </div>

                {/* Imagen actual o previsualización de la nueva */}
                {imagenMostrada && (
                    <div className="mb-3">
                        <label className="form-label">
                            {preview ? "Nueva imagen (vista previa):" : "Imagen actual:"}
                        </label>
                        <div>
                            <img
                                src={imagenMostrada}
                                alt="Imagen del anuncio"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "300px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    border: "1px solid #dee2e6"
                                }}
                            />
                        </div>
                        {preview && (
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary mt-2"
                                onClick={() => {
                                    setNuevaImagen(null);
                                    setPreview(null);
                                }}
                            >
                                Cancelar cambio de imagen
                            </button>
                        )}
                    </div>
                )}

                <button className="btn btn-dark" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar cambios"}
                </button>

            </form>

            {mensaje && (
                <div className="alert alert-danger mt-3">
                    {mensaje}
                </div>
            )}

        </div>
    );
};

export default EditarAnuncio;