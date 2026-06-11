import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

const EditarAnuncio = () => {

    const { id } = useParams();

    const navigate =
        useNavigate();

    const [formData, setFormData] =
        useState({
            titulo: "",
            contenido: ""
        });

    const [mensaje, setMensaje] =
        useState("");

    useEffect(() => {

        obtenerAnuncio();

    }, []);

    const obtenerAnuncio =
        async () => {

            try {

                const response =
                    await fetch(
                        `http://localhost:3000/api/v1/anuncios/${id}`
                    );

                const data =
                    await response.json();

                setFormData({
                    titulo:
                        data.titulo || "",

                    contenido:
                        data.contenido || ""
                });

            } catch (error) {

                console.error(error);
            }
        };

    const handleChange =
        (e) => {

            setFormData({
                ...formData,

                [e.target.name]:
                    e.target.value
            });

            setMensaje("");
        };

    const handleSubmit =
        async (e) => {

            e.preventDefault();

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

                    setMensaje(data.message);

                    return;
                }

                navigate(
                    "/panel/admin/anuncios"
                );

            } catch (error) {

                console.error(error);
            }
        };

    return (
        <div className="container mt-5 mb-5 col-md-8">

            <h2 className="mb-4">
                Editar anuncio
            </h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label>
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

                    <label>
                        Contenido
                    </label>

                    <textarea
                        name="contenido"
                        className="form-control"
                        rows="6"
                        value={formData.contenido}
                        onChange={handleChange}
                    />

                </div>

                <button className="btn btn-dark">
                    Guardar cambios
                </button>

            </form>

            {
                mensaje &&
                <div className="alert alert-danger mt-3">
                    {mensaje}
                </div>
            }

        </div>
    );
};

export default EditarAnuncio;