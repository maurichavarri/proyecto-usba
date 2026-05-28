import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

const EditarTorneo = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [formData, setFormData] =
        useState({
            nombre: "",
            fecha_inicio: "",
            fecha_fin: ""
        });

    useEffect(() => {

        obtenerTorneo();

    }, []);

    const obtenerTorneo = async () => {

        try {

            const response =
                await fetch(
                    `http://localhost:3000/api/v1/torneos/${id}`
                );

            const data =
                await response.json();

            setFormData(data);

        } catch (error) {

            console.error(error);
        }
    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem("token");

            const response =
                await fetch(
                    `http://localhost:3000/api/v1/torneos/${id}`,
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

                throw new Error(
                    data.message
                );
            }

            navigate(
                "/panel/admin/torneos"
            );

        } catch (error) {

            console.error(error);
        }
    };

    return (
        <div className="container mt-5 mb-5">

            <h2 className="mb-3">
                Editar Torneo
            </h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label>
                        Nombre
                    </label>

                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="form-control"
                    />

                </div>

                <div className="mb-3">

                    <label>
                        Fecha inicio
                    </label>

                    <input
                        type="date"
                        name="fecha_inicio"
                        value={formData.fecha_inicio}
                        onChange={handleChange}
                        className="form-control"
                    />

                </div>

                <div className="mb-3">

                    <label>
                        Fecha fin
                    </label>

                    <input
                        type="date"
                        name="fecha_fin"
                        value={formData.fecha_fin}
                        onChange={handleChange}
                        className="form-control"
                    />

                </div>

                <button className="btn btn-dark">
                    Guardar cambios
                </button>

            </form>

        </div>
    );
};

export default EditarTorneo;