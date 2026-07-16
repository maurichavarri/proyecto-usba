import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TorneoForm = ({
    initialData,
    onSubmit,
    titulo,
    textoBoton
}) => {

    const navigate = useNavigate();

    const [mensaje, setMensaje] = useState("");

    const [formData, setFormData] = useState({
        nombre: "",
        fecha_inicio: "",
        fecha_cierre_inscripcion: "",
        fecha_fin: ""
    });

    useEffect(() => {

        if (initialData) {

            setFormData({
                nombre: initialData.nombre || "",
                fecha_inicio: initialData.fecha_inicio || "",
                fecha_cierre_inscripcion:
                    initialData.fecha_cierre_inscripcion || "",
                fecha_fin: initialData.fecha_fin || ""
            });
        }

    }, [initialData]);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMensaje("");

        if (
            formData.fecha_cierre_inscripcion >=
            formData.fecha_inicio
        ) {
            setMensaje(
                "La fecha de cierre de inscripción debe ser anterior al inicio del torneo"
            );
            return;
        }

        if (
            formData.fecha_inicio >=
            formData.fecha_fin
        ) {
            setMensaje(
                "La fecha de inicio debe ser anterior a la fecha de fin"
            );
            return;
        }

        const resultado =
            await onSubmit(formData);

        if (!resultado.ok) {

            setMensaje(resultado.message);
            return;
        }

        navigate("/panel/admin/torneos");
    };

    return (
        <div className="container mt-5 mb-5">

            <h2 className="mb-4">
                {titulo}
            </h2>

            <form onSubmit={handleSubmit}>

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

                <div className="mb-3">

                    <label className="form-label">
                        Fecha inicio
                    </label>

                    <input
                        type="date"
                        name="fecha_inicio"
                        className="form-control"
                        value={formData.fecha_inicio}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label">
                        Cierre de inscripción
                    </label>

                    <input
                        type="date"
                        name="fecha_cierre_inscripcion"
                        className="form-control"
                        value={
                            formData.fecha_cierre_inscripcion
                        }
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label">
                        Fecha fin
                    </label>

                    <input
                        type="date"
                        name="fecha_fin"
                        className="form-control"
                        value={formData.fecha_fin}
                        onChange={handleChange}
                        required
                    />

                </div>

                <button
                    className="btn btn-dark"
                >
                    {textoBoton}
                </button>

                {
                    mensaje &&
                    <div className="alert alert-danger mt-3">
                        {mensaje}
                    </div>
                }

            </form>

        </div>
    );
};

export default TorneoForm;