import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminBienvenida = () => {
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState("");
    const [texto, setTexto] = useState("");
    const [imagenActual, setImagenActual] = useState(null);
    const [nuevaImagen, setNuevaImagen] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch("http://localhost:3000/api/v1/bienvenida")
            .then(r => r.json())
            .then(data => {
                setTitulo(data.titulo || "");
                setTexto(data.texto || "");
                setImagenActual(data.imagen || null);
            });
    }, []);

    const handleImagenChange = (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;
        setNuevaImagen(archivo);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(archivo);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje(null);

        try {
            const formData = new FormData();
            formData.append("titulo", titulo);
            formData.append("texto", texto);
            if (nuevaImagen) formData.append("imagen", nuevaImagen);

            const res = await fetch("http://localhost:3000/api/v1/bienvenida", {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                setMensaje({ texto: "¡Bienvenida actualizada correctamente!", tipo: "success" });
                setImagenActual(data.bienvenida?.imagen || imagenActual);
                setNuevaImagen(null);
                setPreview(null);
            } else {
                setMensaje({ texto: data.message, tipo: "danger" });
            }
        } catch {
            setMensaje({ texto: "Error de conexión", tipo: "danger" });
        } finally {
            setLoading(false);
        }
    };

    const imagenMostrada = preview || (imagenActual ? `http://localhost:3000${imagenActual}` : null);

    return (
        <div className="container mt-4 mb-5 col-md-8">

            <div className="d-flex align-items-center justify-content-between mb-2">
                <h2>Editar Sección Bienvenida</h2>
            </div>

            <nav className="mb-4" style={{ fontSize: "0.9rem" }}>
                <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/panel/admin")}>
                    Admin Dashboard
                </span>
                {" > "}
                <span className="text-muted">Bienvenida</span>
            </nav>

            {mensaje && (
                <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>
            )}

            <div className="card shadow-sm p-4">
                <form onSubmit={handleSubmit}>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Título</label>
                        <input
                            type="text"
                            className="form-control"
                            value={titulo}
                            onChange={e => setTitulo(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Texto</label>
                        <textarea
                            className="form-control"
                            rows="5"
                            value={texto}
                            onChange={e => setTexto(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">
                            {imagenActual ? "Cambiar imagen" : "Agregar imagen"}
                        </label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImagenChange}
                        />
                        <small className="text-muted">JPG, PNG, WEBP. Máximo 5MB.</small>
                    </div>

                    {imagenMostrada && (
                        <div className="mb-3">
                            <label className="form-label">
                                {preview ? "Vista previa nueva imagen:" : "Imagen actual:"}
                            </label>
                            <div>
                                <img
                                    src={imagenMostrada}
                                    alt="Bienvenida"
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "280px",
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
                                    onClick={() => { setNuevaImagen(null); setPreview(null); }}
                                >
                                    Cancelar cambio
                                </button>
                            )}
                        </div>
                    )}

                    <button className="btn btn-dark" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar cambios"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default AdminBienvenida;