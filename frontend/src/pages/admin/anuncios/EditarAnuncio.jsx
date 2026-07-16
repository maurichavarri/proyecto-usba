import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditarAnuncio = () => {

    const { id } = useParams();
    const navigate = useNavigate();
<<<<<<< HEAD
    const [showHelp, setShowHelp] = useState(false);
=======

>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91
    const [formData, setFormData] = useState({
        titulo: "",
        contenido: ""
    });
<<<<<<< HEAD

    const [mensaje, setMensaje] = useState("");
=======
    const [imagenActual, setImagenActual] = useState(null); // URL de imagen guardada en BD
    const [nuevaImagen, setNuevaImagen] = useState(null);   // Archivo nuevo seleccionado
    const [preview, setPreview] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(false);
>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91

    useEffect(() => {
        obtenerAnuncio();
    }, []);

    const obtenerAnuncio = async () => {
        try {
<<<<<<< HEAD
            const response = await fetch(`http://localhost:3000/api/v1/anuncios/${id}`);

            const data = await response.json();

            setFormData({
                titulo:
                    data.titulo || "",

                contenido:
                    data.contenido || ""
            });

        } catch (error) {

=======
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
>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91
            console.error(error);
        }
    };

<<<<<<< HEAD
    const handleChange =
        (e) => {

            setFormData({
                ...formData,
                [e.target.name]:
                    e.target.value
            });

            setMensaje("");
        };

    const validarFormulario = () => {

        if (
            !formData.titulo.trim()
        ) {
            return "El título es obligatorio.";
        }

        if (
            !formData.contenido.trim()
        ) {
            return "El contenido es obligatorio.";
        }

        return "";
    };

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            const error =
                validarFormulario();

            if (error) {
                setMensaje(error);
                return;
            }

            try {

                const token =
                    localStorage.getItem("token");

                const response =
                    await fetch(
                        `http://localhost:3000/api/v1/anuncios/${id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`
                            },

                            body:
                                JSON.stringify(formData)
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    setMensaje(
                        data.message
                    );

                    return;
                }

                navigate(
                    "/panel/admin/anuncios"
                );

            } catch (error) {

                console.error(error);

                setMensaje(
                    "Error al actualizar anuncio"
                );
            }
        };

    return (
        <div className="container mt-4 mb-5">

            <div className="col-md-10 mx-auto">

                {/* Título */}
                <div className="d-flex align-items-center mb-2">

                    <h2 className="me-2">
                        Editar Anuncio
                    </h2>

                    <span
                        className="text-primary"
                        style={{
                            cursor: "pointer",
                            fontSize: "1.2rem"
                        }}
                        onClick={() =>
                            setShowHelp(true)
                        }
                        title="Ayuda"
                    >
                        ❓
                    </span>

                </div>

                {/* Breadcrumb */}
                <nav
                    className="mb-3"
                    style={{
                        fontSize: "0.9rem"
                    }}
                >

                    <span
                        className="text-primary"
                        style={{
                            cursor: "pointer"
                        }}
                        onClick={() =>
                            navigate("/panel/admin")
                        }
                    >
                        Admin Dashboard
                    </span>

                    {" > "}

                    <span
                        className="text-primary"
                        style={{
                            cursor: "pointer"
                        }}
                        onClick={() =>
                            navigate(
                                "/panel/admin/anuncios"
                            )
                        }
                    >
                        Anuncios
                    </span>

                    {" > "}

                    <span className="text-muted">
                        Editar Anuncio
                    </span>

                </nav>

                <button
                    className="btn btn-dark mb-3"
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    Volver
                </button>

                <div className="card shadow-sm">

                    <div className="card-header bg-dark text-white">
                        <strong>
                            Formulario de edición
                        </strong>
                    </div>

                    <div className="card-body">

                        {
                            mensaje &&
                            (
                                <div className="alert alert-danger">
                                    {mensaje}
                                </div>
                            )
                        }

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <div className="mb-3">

                                <label className="form-label">
                                    Título
                                </label>

                                <input
                                    type="text"
                                    name="titulo"
                                    className="form-control"
                                    value={
                                        formData.titulo
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Contenido
                                </label>

                                <textarea
                                    name="contenido"
                                    rows="8"
                                    className="form-control"
                                    value={
                                        formData.contenido
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Guardar cambios
                            </button>

                        </form>

                    </div>

                </div>

                {/* Modal ayuda */}
                {
                    showHelp &&
                    (
                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor:
                                    "rgba(0,0,0,0.5)",
                                zIndex: 9999
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
                                    Desde aquí podés modificar un anuncio ya existente.
                                    Actualizá el título o contenido y presioná
                                    <strong className="text-primary">
                                        {" "}Guardar cambios
                                    </strong>.
                                </p>

                            </div>

                        </div>
                    )
                }

            </div>
=======
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
>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91

        </div>
    );
};

export default EditarAnuncio;