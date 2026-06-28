import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const JugadoresEquipo = () => {

    const { id } = useParams();
    const [jugadores, setJugadores] = useState([]);
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [dni, setDni] = useState("");

    useEffect(() => {
        obtenerJugadores();
    }, []);

    const obtenerJugadores = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:3000/api/v1/delegado/jugadores/equipo/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setJugadores(data);

        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/v1/delegado/jugadores",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        nombre,
                        apellido,
                        dni,
                        equipo_id: id
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            // Limpiar form
            setNombre("");
            setApellido("");
            setDni("");

            // Recargar jugadores
            obtenerJugadores();

        } catch (error) {
            alert(error.message);
            console.error(error);
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <h2 className="mb-4">
                Jugadores del equipo
            </h2>
            {/* Formulario */}
            <form
                onSubmit={handleSubmit}
                className="card p-4 shadow-sm mb-4"
            >
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <input
                            type="text"
                            placeholder="Nombre"
                            className="form-control"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <input
                            type="text"
                            placeholder="Apellido"
                            className="form-control"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <input
                            type="text"
                            placeholder="DNI"
                            className="form-control"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <button className="btn btn-dark">
                    Agregar jugador
                </button>
            </form>
            {/* Tabla */}
            <div className="card shadow-sm">
                <div className="card-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>DNI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                jugadores.map((jugador) => (

                                    <tr key={jugador.id}>

                                        <td>{jugador.nombre}</td>

                                        <td>{jugador.apellido}</td>

                                        <td>{jugador.dni}</td>

                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default JugadoresEquipo;