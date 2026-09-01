import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminCarrusel = () => {
    const navigate = useNavigate();
    const [imagenes, setImagenes] = useState([]);
    const [imagenArchivo, setImagenArchivo] = useState(null);
    const [preview, setPreview] = useState(null);
    const [orden, setOrden] = useState(0);
    const [loading, setLoading] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState(null); // { texto, tipo }
    const [showHelp, setShowHelp] = useState(false);

    const API_URL = "http://localhost:3000/api/v1/carrusel";
    const token = localStorage.getItem("token");

    const mostrarMensaje = (texto, tipo = "success") => {
        setMensaje({ texto, tipo });
        setTimeout(() => setMensaje(null), 3000);
    };

    // 1. Cargar todas las imágenes
    const cargarImagenes = async () => {
        try {
            setCargando(true);
            const res = await fetch(`${API_URL}/admin/todas`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setImagenes(Array.isArray(data) ? data : data.imagenes ?? []);
            } else {
                console.error("Error al cargar imágenes:", data.message);
                setImagenes([]);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            setImagenes([]);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarImagenes();
    }, []);

    // Preview local al seleccionar archivo
    const handleArchivoChange = (e) => {
        const archivo = e.target.files[0];
        setImagenArchivo(archivo);
        if (archivo) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(archivo);
        } else {
            setPreview(null);
        }
    };

    // 2. Subir nueva imagen
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imagenArchivo) {
            mostrarMensaje("Por favor, seleccioná una imagen.", "danger");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("imagen", imagenArchivo);
        formData.append("orden", orden);

        try {
            const res = await fetch(`${API_URL}/crear`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                mostrarMensaje("¡Imagen subida correctamente!");
                setImagenArchivo(null);
                setPreview(null);
                setOrden(0);
                e.target.reset();
                cargarImagenes();
            } else {
                mostrarMensaje(`Error: ${data.message}`, "danger");
            }
        } catch (error) {
            console.error("Error al enviar formulario:", error);
            mostrarMensaje("Error de conexión al subir imagen.", "danger");
        } finally {
            setLoading(false);
        }
    };

    // 3. Cambiar estado activo/inactivo
    const handleToggleEstado = async (id) => {
        try {
            const res = await fetch(`${API_URL}/${id}/estado`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                cargarImagenes();
            } else {
                const data = await res.json();
                mostrarMensaje(`Error: ${data.message}`, "danger");
            }
        } catch (error) {
            console.error("Error al cambiar estado:", error);
        }
    };

    // 4. Actualizar orden
    const handleActualizarOrden = async (id, nuevoOrden) => {
        try {
            const res = await fetch(`${API_URL}/${id}/orden`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ orden: nuevoOrden })
            });
            if (res.ok) {
                cargarImagenes();
            } else {
                const data = await res.json();
                mostrarMensaje(`Error: ${data.message}`, "danger");
            }
        } catch (error) {
            console.error("Error al actualizar orden:", error);
        }
    };

    // 5. Eliminar imagen
    const handleEliminarImagen = async (id) => {
        if (!window.confirm("¿Seguro que querés eliminar esta imagen permanentemente?")) return;

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                mostrarMensaje("Imagen eliminada correctamente.");
                cargarImagenes();
            } else {
                const data = await res.json();
                mostrarMensaje(`Error: ${data.message}`, "danger");
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="col-lg-10 mx-auto">

                {/* Título */}
                <div className="d-flex align-items-center mb-2">
                    <h2 className="me-2">Carrusel</h2>
                    <span
                        style={{ cursor: "pointer", fontSize: "1.2rem" }}
                        className="text-primary"
                        onClick={() => setShowHelp(true)}
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
                    <span className="text-muted">Carrusel</span>
                </nav>

                {/* Botón volver */}
                <button
                    className="btn btn-dark mb-4"
                    onClick={() => navigate("/panel/admin")}
                >
                    ← Regresar al panel
                </button>

                {/* Toast de feedback */}
                {mensaje && (
                    <div className={`alert alert-${mensaje.tipo} alert-dismissible`} role="alert">
                        {mensaje.texto}
                    </div>
                )}

                {/* Formulario subir imagen */}
                <div className="card p-4 mb-5 shadow-sm">
                    <h3 className="card-title mb-3">Subir Nueva Imagen</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3 align-items-end">
                            <div className="col-md-6">
                                <label className="form-label">Archivo de Imagen</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={handleArchivoChange}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Orden numérico</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={orden}
                                    onChange={(e) => setOrden(e.target.value)}
                                    min="0"
                                />
                            </div>
                            <div className="col-md-3">
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? "Subiendo..." : "Subir Imagen"}
                                </button>
                            </div>
                        </div>

                        {/* Preview de la imagen seleccionada */}
                        {preview && (
                            <div className="mt-3">
                                <label className="form-label">Vista previa:</label>
                                <div>
                                    <img
                                        src={preview}
                                        alt="Vista previa"
                                        style={{
                                            maxHeight: "200px",
                                            maxWidth: "100%",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            border: "1px solid #dee2e6"
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Listado de imágenes */}
                <h3 className="mb-3">
                    Imágenes en el Carrusel
                    <span className="badge bg-secondary ms-2" style={{ fontSize: "14px" }}>
                        {imagenes.filter(i => i.activo).length} visibles / {imagenes.length} totales
                    </span>
                </h3>

                {cargando && <p className="text-muted">Cargando imágenes...</p>}

                {!cargando && (
                    <div className="row g-4">
                        {imagenes.length === 0 ? (
                            <div className="col-12">
                                <p className="text-muted">No hay imágenes en el carrusel actualmente.</p>
                            </div>
                        ) : (
                            imagenes.map((img) => (
                                <div className="col-md-4" key={img.id}>
                                    <div className="card h-100 shadow-sm">
                                        <img
                                            src={`http://localhost:3000${img.url}`}
                                            className="card-img-top"
                                            alt="Vista carrusel"
                                            style={{ height: "200px", objectFit: "cover" }}
                                        />
                                        <div className="card-body d-flex flex-column justify-content-between">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className={`badge ${img.activo ? "bg-success" : "bg-danger"}`}>
                                                    {img.activo ? "Visible" : "Oculto"}
                                                </span>
                                                <div className="d-flex align-items-center gap-2">
                                                    <label className="text-muted mb-0" style={{ fontSize: "13px" }}>Orden:</label>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        style={{ width: "65px" }}
                                                        defaultValue={img.orden}
                                                        onBlur={(e) => handleActualizarOrden(img.id, parseInt(e.target.value))}
                                                    />
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between mt-2">
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm ${img.activo ? "btn-warning" : "btn-success"}`}
                                                    onClick={() => handleToggleEstado(img.id)}
                                                >
                                                    {img.activo ? "Ocultar" : "Mostrar"}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleEliminarImagen(img.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

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
                                <p>
                                    Podés administrar la
                                    sección de 'Carrusel' que se encuentra en 'Home'.
                                    Implica subir, eliminar o cambiar la visibilidad
                                    y el orden de las imágenes.
                                </p>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default AdminCarrusel;