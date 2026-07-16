import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CrearAnuncio = () => {

    const navigate = useNavigate();

<<<<<<< HEAD
    const [showHelp, setShowHelp] = useState(false);

    const [formData, setFormData] = useState({
        titulo: "",
        contenido: ""
    });

    const [mensaje, setMensaje] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setMensaje("");
    };

    const validarFormulario = () => {

        if (!formData.titulo.trim()) {
            return "El título es obligatorio.";
        }

        if (!formData.contenido.trim()) {
            return "El contenido es obligatorio.";
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

        try {

            const token = localStorage.getItem("token");

=======
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

>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91
            const response = await fetch(
                "http://localhost:3000/api/v1/anuncios/crear",
                {
                    method: "POST",
<<<<<<< HEAD

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify(formData)
=======
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91
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
<<<<<<< HEAD
            setMensaje("Error al crear el anuncio.");
=======
            setMensaje("Error al crear el anuncio");
        } finally {
            setLoading(false);
>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91
        }
    };

    return (
<<<<<<< HEAD
        <div className="container mt-4 mb-5">

            <div className="col-md-8 mx-auto">

                {/* Título */}
                <div className="d-flex align-items-center mb-2">

                    <h2 className="me-2">
                        Crear Anuncio
                    </h2>

                    <span
                        className="text-primary"
                        style={{
                            cursor: "pointer",
                            fontSize: "1.2rem"
                        }}
                        onClick={() => setShowHelp(true)}
                        title="Ayuda"
                    >
                        ❓
                    </span>

                </div>

                {/* Breadcrumb */}
                <nav
                    className="mb-3"
                    style={{ fontSize: "0.9rem" }}
                >
                    <span
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                            navigate("/panel/admin")
                        }
                    >
                        Admin Dashboard
                    </span>

                    {" > "}

                    <span
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                            navigate("/panel/admin/anuncios")
                        }
                    >
                        Anuncios
                    </span>

                    {" > "}

                    <span className="text-muted">
                        Crear Anuncio
                    </span>

                </nav>

                <button
                    className="btn btn-dark mb-3"
                    onClick={() => navigate(-1)}
                >
                    Volver
                </button>

                {/* Formulario */}
                <div className="card shadow-sm">

                    <div className="card-header bg-dark text-white">
                        <strong>
                            Formulario de creación
                        </strong>
                    </div>

                    <div className="card-body">

                        {
                            mensaje &&
                            <div className="alert alert-danger">
                                {mensaje}
                            </div>
                        }

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">

                                <label className="form-label">
                                    Título
                                </label>

                                <input
                                    type="text"
                                    name="titulo"
                                    className="form-control"
                                    value={formData.titulo}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Contenido
                                </label>

                                <textarea
                                    name="contenido"
                                    className="form-control"
                                    rows="8"
                                    value={formData.contenido}
                                    onChange={handleChange}
                                />

                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Crear anuncio
                            </button>

                        </form>

                    </div>

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
                                    maxWidth: "500px"
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
                                    Desde aquí podés crear
                                    comunicados oficiales para
                                    los usuarios del sistema.
                                </p>

                                <p>
                                    Completá el título y el
                                    contenido del anuncio.
                                    Luego presioná
                                    <strong className="text-primary">
                                        {" "}Crear anuncio
                                    </strong>.
                                </p>

                            </div>

                        </div>
                    )
                }

            </div>
=======
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
>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91

        </div>
    );
};

export default CrearAnuncio;