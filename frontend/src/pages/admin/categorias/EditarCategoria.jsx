import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditarCategoria = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [showHelp, setShowHelp] = useState(false);

    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        edad_minima: "",
        edad_maxima: "",
        sexo: ""
    });

    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        obtenerCategoria();
    }, [id]);

    const obtenerCategoria = async () => {

        try {

            const response = await fetch(
                `http://localhost:3000/api/v1/categorias/${id}`
            );

            const data = await response.json();

            if (!response.ok) {
                setMensaje(
                    data.message ||
                    "Error al obtener la categoría"
                );
                return;
            }

            setFormData({
                nombre: data.nombre || "",
                descripcion: data.descripcion || "",
                edad_minima:
                    data.edad_minima !== null &&
                        data.edad_minima !== undefined
                        ? data.edad_minima
                        : "",
                edad_maxima:
                    data.edad_maxima !== null &&
                        data.edad_maxima !== undefined
                        ? data.edad_maxima
                        : "",
                sexo: data.sexo || ""
            });

        } catch (error) {

            console.error(error);

            setMensaje(
                "Error al obtener la categoría"
            );
        }
    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {

        if (!formData.nombre.trim()) {
            return "El nombre de la categoría es obligatorio.";
        }

        if (!formData.descripcion.trim()) {
            return "La descripción de la categoría es obligatoria.";
        }

        if (formData.edad_minima === "") {
            return "La edad mínima es obligatoria.";
        }

        if (formData.edad_maxima === "") {
            return "La edad máxima es obligatoria.";
        }

        const edadMinima = Number(
            formData.edad_minima
        );

        const edadMaxima = Number(
            formData.edad_maxima
        );

        if (
            !Number.isInteger(edadMinima) ||
            !Number.isInteger(edadMaxima)
        ) {
            return "Las edades deben ser números enteros.";
        }

        if (
            edadMinima < 0 ||
            edadMaxima < 0
        ) {
            return "Las edades no pueden ser negativas.";
        }

        if (edadMinima > edadMaxima) {
            return "La edad mínima no puede ser mayor que la edad máxima.";
        }

        if (!formData.sexo) {
            return "Debés seleccionar el sexo de la categoría.";
        }

        if (
            formData.sexo !== "masculino" &&
            formData.sexo !== "femenino"
        ) {
            return "El sexo seleccionado no es válido.";
        }

        return "";
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const validationError =
            validateForm();

        if (validationError) {
            setMensaje(validationError);
            return;
        }

        setMensaje("");

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:3000/api/v1/categorias/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        nombre:
                            formData.nombre.trim(),

                        descripcion:
                            formData.descripcion.trim(),

                        edad_minima:
                            Number(
                                formData.edad_minima
                            ),

                        edad_maxima:
                            Number(
                                formData.edad_maxima
                            ),

                        sexo:
                            formData.sexo
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                setMensaje(
                    data.message ||
                    "Error al actualizar categoría"
                );

                return;
            }

            navigate(
                "/panel/admin/categorias"
            );

        } catch (error) {

            console.error(error);

            setMensaje(
                "Error al actualizar categoría"
            );
        }
    };

    return (

        <div className="container mt-5 mb-5">

            <div className="col-md-10 mx-auto">

                {/* TÍTULO */}

                <div className="d-flex align-items-center mb-2">

                    <h2 className="me-2">
                        Editar Categoría
                    </h2>

                    <span
                        style={{
                            cursor: "pointer",
                            fontSize: "1.2rem"
                        }}
                        className="text-primary"
                        onClick={() =>
                            setShowHelp(true)
                        }
                        title="Ayuda"
                    >
                        ❓
                    </span>

                </div>


                {/* BREADCRUMB */}

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
                            navigate(
                                "/panel/admin"
                            )
                        }
                    >
                        Panel del Administrador
                    </span>

                    {" > "}

                    <span
                        className="text-primary"
                        style={{
                            cursor: "pointer"
                        }}
                        onClick={() =>
                            navigate(
                                "/panel/admin/categorias"
                            )
                        }
                    >
                        Categorías
                    </span>

                    {" > "}

                    <span className="text-muted">
                        Editar Categoría
                    </span>

                </nav>


                {/* REGRESAR */}

                <button
                    type="button"
                    className="btn btn-dark mb-3"
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    ← Regresar a gestión de categorías
                </button>


                {/* CARD */}

                <div className="card shadow-sm">

                    <div className="card-header bg-dark">

                        <strong className="text-white">
                            Formulario de edición
                        </strong>

                    </div>

                    <div className="card-body p-3">

                        {
                            mensaje &&
                            (
                                <div className="alert alert-danger mb-3">
                                    {mensaje}
                                </div>
                            )
                        }


                        <form onSubmit={handleSubmit}>


                            {/* NOMBRE */}

                            <div className="mb-3">

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


                            {/* DESCRIPCIÓN */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Descripción
                                </label>

                                <textarea
                                    name="descripcion"
                                    rows="4"
                                    className="form-control"
                                    value={
                                        formData.descripcion
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            {/* EDADES */}

                            <div className="row">

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Edad mínima
                                    </label>

                                    <input
                                        type="number"
                                        name="edad_minima"
                                        className="form-control"
                                        min="0"
                                        step="1"
                                        value={
                                            formData.edad_minima
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                    <small className="text-muted">
                                        Edad mínima permitida para participar.
                                    </small>

                                </div>


                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Edad máxima
                                    </label>

                                    <input
                                        type="number"
                                        name="edad_maxima"
                                        className="form-control"
                                        min="0"
                                        step="1"
                                        value={
                                            formData.edad_maxima
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                    <small className="text-muted">
                                        Edad máxima permitida para participar.
                                    </small>

                                </div>

                            </div>


                            {/* SEXO */}

                            <div className="mb-4">

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
                                        Seleccionar sexo
                                    </option>

                                    <option value="masculino">
                                        Masculino
                                    </option>

                                    <option value="femenino">
                                        Femenino
                                    </option>

                                </select>

                                <small className="text-muted">
                                    La categoría debe ser masculina o femenina.
                                </small>

                            </div>


                            {/* BOTÓN */}

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Guardar cambios
                            </button>

                        </form>

                    </div>

                </div>


                {/* MODAL AYUDA */}

                {
                    showHelp &&
                    (
                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor:
                                    "rgba(0,0,0,0.5)",
                                zIndex: 1050,
                                padding: "20px"
                            }}
                        >

                            <div
                                className="bg-white p-4 rounded shadow"
                                style={{
                                    maxWidth: "500px",
                                    width: "100%"
                                }}
                            >

                                <div className="d-flex justify-content-between align-items-center mb-3">

                                    <h5 className="mb-0">
                                        ¿Cómo funciona este apartado?
                                    </h5>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() =>
                                            setShowHelp(false)
                                        }
                                    />

                                </div>

                                <p>
                                    Desde aquí podés modificar los datos
                                    de una categoría existente.
                                </p>

                                <p>
                                    También podés modificar el rango de
                                    edad permitido y el sexo correspondiente
                                    a la categoría.
                                </p>

                                <p className="mb-0">
                                    Los cambios se aplicarán al presionar
                                    <strong> Guardar cambios</strong>.
                                </p>

                            </div>

                        </div>
                    )
                }

            </div>

        </div>
    );
};

export default EditarCategoria;