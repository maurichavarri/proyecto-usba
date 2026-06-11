import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

const CrearAnuncio = () => {

    const navigate =
        useNavigate();

    const [titulo, setTitulo] =
        useState("");

    const [contenido, setContenido] =
        useState("");

    const [mensaje, setMensaje] =
        useState("");

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            try {

                const token =
                    localStorage.getItem("token");

                const response =
                    await fetch(
                        "http://localhost:3000/api/v1/anuncios/crear",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({
                                titulo,
                                contenido
                            })
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
                Crear anuncio
            </h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label>
                        Título
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        value={titulo}
                        onChange={(e) => {

                            setTitulo(
                                e.target.value
                            );

                            setMensaje("");
                        }}
                    />

                </div>

                <div className="mb-3">

                    <label>
                        Contenido
                    </label>

                    <textarea
                        className="form-control"
                        rows="6"
                        value={contenido}
                        onChange={(e) => {

                            setContenido(
                                e.target.value
                            );

                            setMensaje("");
                        }}
                    />

                </div>

                <button className="btn btn-dark">
                    Crear anuncio
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

export default CrearAnuncio;