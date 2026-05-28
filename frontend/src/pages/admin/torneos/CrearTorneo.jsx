import { useState } from "react";

import { useNavigate } from "react-router-dom";

const CrearTorneo = () => {

    const navigate = useNavigate();

    const [formData, setFormData] =
        useState({
            nombre: "",
            fecha_inicio: "",
            fecha_fin: ""
        });

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
                    "http://localhost:3000/api/v1/torneos/crear",
                    {
                        method: "POST",

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
                Crear Torneo
            </h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label>
                        Nombre
                    </label>

                    <input
                        type="text"
                        name="nombre"
                        className="form-control"
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="mb-3">

                    <label>
                        Fecha inicio
                    </label>

                    <input
                        type="date"
                        name="fecha_inicio"
                        className="form-control"
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="mb-3">

                    <label>
                        Fecha fin
                    </label>

                    <input
                        type="date"
                        name="fecha_fin"
                        className="form-control"
                        onChange={handleChange}
                        required
                    />

                </div>

                <button className="btn btn-dark">
                    Crear torneo
                </button>

            </form>

        </div>
    );
};

export default CrearTorneo;