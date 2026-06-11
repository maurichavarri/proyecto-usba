import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const FormularioSede = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const editando = Boolean(id);

    const [formData, setFormData] = useState({
        nombre: "",
        direccion: ""
    });

    useEffect(() => {

        if (editando) {
            obtenerSede();
        }

    }, []);

    const obtenerSede = async () => {

        const response = await fetch(
            `http://localhost:3000/api/v1/sedes/${id}`
        );

        const data = await response.json();

        setFormData(data);
    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const token =
            localStorage.getItem("token");

        await fetch(

            editando
                ? `http://localhost:3000/api/v1/sedes/${id}`
                : "http://localhost:3000/api/v1/sedes",

            {
                method:
                    editando
                        ? "PUT"
                        : "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body: JSON.stringify(formData)
            }
        );

        navigate("/panel/admin/sedes");
    };

    return (
        <div className="container mt-5">

            <h2>
                {
                    editando
                        ? "Editar Sede"
                        : "Nueva Sede"
                }
            </h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label>Nombre</label>

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

                    <label>Dirección</label>

                    <input
                        type="text"
                        name="direccion"
                        className="form-control"
                        value={formData.direccion}
                        onChange={handleChange}
                        required
                    />

                </div>

                <button className="btn btn-dark">
                    Guardar
                </button>

            </form>

        </div>
    );
};

export default FormularioSede;