import { useEffect, useState } from "react";
<<<<<<< HEAD
import { useParams } from "react-router-dom";

const JugadoresEquipo = () => {

    const { id } = useParams();
    const [jugadores, setJugadores] = useState([]);
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [dni, setDni] = useState("");
=======
import { useParams, Link, useNavigate } from "react-router-dom";

const JugadoresEquipo = () => {

    const navigate = useNavigate();

    const { id } = useParams();
    const [jugadores, setJugadores] = useState([]);
    const [jugadorEditando, setJugadorEditando] = useState(null);

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [dni, setDni] = useState("");
    const [dorsal, setDorsal] = useState("");

    const [mensaje, setMensaje] = useState("");
    const [showHelp, setShowHelp] = useState(false);
>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91

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

<<<<<<< HEAD
=======
    const editarJugador = (jugador) => {
        setJugadorEditando(jugador);
        setNombre(jugador.nombre);
        setApellido(jugador.apellido);
        setDni(jugador.dni);
        setDorsal(jugador.dorsal);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };

    const cambiarEstadoJugador = async (jugador) => {
        const confirmar = window.confirm(
            jugador.estado === "activo"
                ? `¿Desea desactivar a ${jugador.nombre} ${jugador.apellido}?`
                : `¿Desea reactivar a ${jugador.nombre} ${jugador.apellido}?`
        );

        if (!confirmar) return;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:3000/api/v1/delegado/jugadores/${jugador.id}/estado`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setMensaje(data.message);
            obtenerJugadores();
        }
        catch (error) {
            console.error(error);
        }
    };

>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
<<<<<<< HEAD
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
=======
            const url = jugadorEditando ? `http://localhost:3000/api/v1/delegado/jugadores/${jugadorEditando.id}` : "http://localhost:3000/api/v1/delegado/jugadores";
            const metodo = jugadorEditando ? "PUT" : "POST";

            const response = await fetch(url, {
                method: metodo,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    nombre: nombre.trim(),
                    apellido: apellido.trim(),
                    dni,
                    dorsal: Number(dorsal),
                    equipo_id: id
                })
            });
>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            // Limpiar form
            setNombre("");
            setApellido("");
            setDni("");
<<<<<<< HEAD
=======
            setDorsal("");
            setJugadorEditando(null);
            setMensaje(jugadorEditando ? "Jugador actualizado correctamente." : "Jugador agregado correctamente.");
>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91

            // Recargar jugadores
            obtenerJugadores();

        } catch (error) {
<<<<<<< HEAD
            alert(error.message);
=======
            setMensaje(error.message);
>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91
            console.error(error);
        }
    };

    return (
        <div className="container mt-5 mb-5">
<<<<<<< HEAD
            <h2 className="mb-4">
                Jugadores del equipo
            </h2>
=======
            {/* Título */}
            <div className="d-flex align-items-center mb-2">
                <h2 className="me-2">
                    Gestión de Jugadores
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
                >
                    ❓
                </span>
            </div>

            {/* Breadcrumb */}
            <nav className="mb-3" style={{ fontSize: "0.9rem" }}>
                <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/panel/delegado")}>
                    Delegado Dashboard
                </span>

                {" > "}

                <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/panel/delegado/equipos")}>
                    Mis Equipos
                </span>

                {" > "}

                <span className="text-muted">
                    Jugadores
                </span>
            </nav>

            {/* Botones */}
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-dark" onClick={() => navigate(-1)}>
                    Volver
                </button>
            </div>

            {
                mensaje &&
                <div className="alert alert-success">
                    {mensaje}
                </div>
            }

>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91
            {/* Formulario */}
            <form
                onSubmit={handleSubmit}
                className="card p-4 shadow-sm mb-4"
            >
                <div className="row">
<<<<<<< HEAD
                    <div className="col-md-4 mb-3">
=======
                    <div className="col-md-3 mb-3">
>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91
                        <input
                            type="text"
                            placeholder="Nombre"
                            className="form-control"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
<<<<<<< HEAD
                    <div className="col-md-4 mb-3">
=======

                    <div className="col-md-3 mb-3">
>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91
                        <input
                            type="text"
                            placeholder="Apellido"
                            className="form-control"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            required
                        />
                    </div>
<<<<<<< HEAD
                    <div className="col-md-4 mb-3">
                        <input
                            type="text"
                            placeholder="DNI"
                            className="form-control"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
=======

                    <div className="col-md-3 mb-3">
                        <input
                            type="number"
                            placeholder="DNI"
                            className="form-control"
                            value={dni}
                            min="1000000"
                            max="99999999"
                            onChange={(e) =>
                                setDni(e.target.value.replace(/\D/g, ""))
                            }
                            required
                        />
                    </div>

                    <div className="col-md-3 mb-3">
                        <input
                            type="number"
                            placeholder="Dorsal"
                            className="form-control"
                            value={dorsal}
                            min="0"
                            max="99"
                            onChange={(e) => setDorsal(e.target.value)}
>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91
                            required
                        />
                    </div>
                </div>
<<<<<<< HEAD
                <button className="btn btn-dark">
                    Agregar jugador
                </button>
            </form>
=======

                <div className="gap-2">
                    <button className="btn btn-dark">
                        {
                            jugadorEditando
                                ? "Guardar cambios"
                                : "Agregar jugador"
                        }
                    </button>
                    {
                        jugadorEditando &&
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setJugadorEditando(null);
                                setNombre("");
                                setApellido("");
                                setDni("");
                                setDorsal("");
                            }}
                        >
                            Cancelar
                        </button>
                    }
                </div>
            </form>

>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91
            {/* Tabla */}
            <div className="card shadow-sm">
                <div className="card-body">
                    <table className="table">
<<<<<<< HEAD
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
=======
                        <thead className="table-dark">
                            <tr>
                                <th>Dorsal</th>
                                <th>Jugador</th>
                                <th>DNI</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                jugadores
                                    .sort((a, b) => a.dorsal - b.dorsal)
                                    .map((jugador) => (
                                        <tr key={jugador.id}>
                                            <td><strong>#{jugador.dorsal}</strong></td>
                                            <td>{jugador.nombre} {jugador.apellido}</td>
                                            <td>{jugador.dni}</td>
                                            <td>
                                                {
                                                    jugador.estado === "activo"
                                                        ? (
                                                            <span className="badge bg-success">
                                                                Activo
                                                            </span>
                                                        )
                                                        : (
                                                            <span className="badge bg-danger">
                                                                Inactivo
                                                            </span>
                                                        )
                                                }
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-outline-dark btn-sm"
                                                        onClick={() => editarJugador(jugador)}
                                                    >
                                                        Editar
                                                    </button>

                                                    <button className={jugador.estado === "activo"
                                                        ? "btn btn-outline-danger btn-sm"
                                                        : "btn btn-outline-success btn-sm"
                                                    }
                                                        onClick={() => cambiarEstadoJugador(jugador)}
                                                    >
                                                        {
                                                            jugador.estado === "activo"
                                                                ? "Desactivar"
                                                                : "Activar"
                                                        }
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91
                            }
                        </tbody>
                    </table>
                </div>
            </div>
<<<<<<< HEAD
=======

            {/* Modal Ayuda */}
            {
                showHelp && (
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                        style={{
                            backgroundColor: "rgba(0,0,0,0.5)",
                            zIndex: 1050
                        }}
                    >

                        <div
                            className="bg-white p-4 rounded shadow"
                            style={{ maxWidth: "550px" }}
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

                            <p>Desde esta sección podés administrar todos los jugadores de tu equipo.</p>

                            <ul>
                                <li>Crear nuevos jugadores.</li>
                                <li>Modificar los jugadores.</li>
                                <li>Desactivarlos o activarlos.</li>
                            </ul>
                        </div>
                    </div>
                )
            }
>>>>>>> 0b8be21bc3b50ac81593f59fd22c154e50f8db91
        </div>
    );
};

export default JugadoresEquipo;