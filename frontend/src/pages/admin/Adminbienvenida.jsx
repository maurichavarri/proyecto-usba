import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminBienvenida = () => {
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState("");
    const [texto, setTexto] = useState("");
    const [imagenActual, setImagenActual] = useState(null);
    const [nuevaImagen, setNuevaImagen] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState(null);
    const [showHelp, setShowHelp] = useState(false);

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
        <div className="container mt-5 mb-5">
            <div className="col-lg-10 mx-auto">

                {/* Titulo */}
                <div className="d-flex align-items-center mb-1">
                    <h2>Bienvenida</h2>
                    <span
                        style={{
                            cursor: "pointer",
                            fontSize: "1.2rem"
                        }}
                        className="text-primary"
                        onClick={() =>
                            setShowHelp(true)
                        }
                    >
                        ❓
                    </span>
                </div>

                {/* Breadcrumb */}
                <nav className="mb-3" style={{ fontSize: "0.9rem" }}>
                    <span
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/panel/admin")}
                    >
                        Panel del Administrador
                    </span>
                    {" > "}
                    <span className="text-muted">Bienvenida</span>
                </nav>

                {/* Botón */}
                <button
                    className="btn btn-dark mb-3"
                    onClick={() => navigate("/panel/admin")}
                >
                    ← Regresar al panel
                </button>

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

                        <button className="btn btn-primary" disabled={loading}>
                            {loading ? "Guardando..." : "Guardar cambios"}
                        </button>
                    </form>
                </div>

                {/* Modal Ayuda */}
                {
                    showHelp && (
                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor:
                                    "rgba(0,0,0,0.5)",
                                zIndex: 1050
                            }}
                        >
                            <div
                                className="bg-white p-4 rounded shadow"
                                style={{
                                    maxWidth: "550px"
                                }}
                            >
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5>
                                        ¿Cómo funciona este apartado?
                                    </h5>
                                    <button
                                        className="btn-close"
                                        onClick={() =>
                                            setShowHelp(false)
                                        }
                                    />
                                </div>
                                <p>Podés administrar la sección de 'Bienvenida' que se encuentra en 'Home'
                                </p>
                                <ul>
                                    <li>Editar título.</li>
                                    <li>Editar texto.</li>
                                    <li>Subir, cambiar o eliminar imagen de fachada.</li>
                                </ul>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default AdminBienvenida;