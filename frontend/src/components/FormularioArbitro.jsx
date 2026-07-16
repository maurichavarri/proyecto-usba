import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const FormularioArbitro = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const editando = Boolean(id);

    const [formData, setFormData] = useState({
        nombre: "",
        apellido: ""
    });

    useEffect(() => {

        if (editando) {
            obtenerArbitro();
        }

    }, []);

    const obtenerArbitro = async () => {

        const response = await fetch(
            `http://localhost:3000/api/v1/arbitros/${id}`
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
                ? `http://localhost:3000/api/v1/arbitros/${id}`
                : "http://localhost:3000/api/v1/arbitros",

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

        navigate("/panel/admin/arbitros");
    };

    return (
        <div className="container mt-5">

            <h2>
                {
                    editando
                        ? "Editar Árbitro"
                        : "Nuevo Árbitro"
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

                    <label>Apellido</label>

                    <input
                        type="text"
                        name="apellido"
                        className="form-control"
                        value={formData.apellido}
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

export default FormularioArbitro;