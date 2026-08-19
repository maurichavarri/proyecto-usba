import { useEffect, useState } from "react";
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

    const [historialJugador, setHistorialJugador] = useState(null);
    const [mostrarHistorial, setMostrarHistorial] = useState(false);
    const [cargandoHistorial, setCargandoHistorial] = useState(false);

    const [mensaje, setMensaje] = useState("");
    const [showHelp, setShowHelp] = useState(false);

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

    const verHistorial = async (jugador) => {
        try {
            setCargandoHistorial(true);
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:3000/api/v1/delegado/jugadores/${jugador.id}/sanciones`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(
                    data.message || "Error al obtener el historial"
                );
            }
            setHistorialJugador(data);
            setMostrarHistorial(true);
        } catch (error) {
            console.error(error);
            setMensaje(error.message);
        } finally {
            setCargandoHistorial(false);
        }
    };

    /*const cambiarEstadoJugador = async (jugador) => {
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
    };*/

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
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

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            // Limpiar form
            setNombre("");
            setApellido("");
            setDni("");
            setDorsal("");
            setJugadorEditando(null);
            setMensaje(jugadorEditando ? "Jugador actualizado correctamente." : "Jugador agregado correctamente.");

            // Recargar jugadores
            obtenerJugadores();

        } catch (error) {
            setMensaje(error.message);
            console.error(error);
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="col-lg-10 mx-auto">

                {/* Título */}
                <div className="d-flex align-items-center mb-2">
                    <h2 className="me-2">Gestión de Jugadores</h2>
                    <span style={{ cursor: "pointer", fontSize: "1.2rem" }}
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

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="card p-4 shadow-sm mb-4">
                    <div className="row">
                        <div className="col-md-3 mb-3">
                            <input
                                type="text"
                                placeholder="Nombre"
                                className="form-control"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-md-3 mb-3">
                            <input
                                type="text"
                                placeholder="Apellido"
                                className="form-control"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                                required
                            />
                        </div>

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
                                required
                            />
                        </div>
                    </div>

                    <div className="gap-2">
                        <button className="btn btn-primary">
                            {
                                jugadorEditando
                                    ? "Guardar Cambios"
                                    : "Agregar Jugador"
                            }
                        </button>
                        {
                            jugadorEditando &&
                            <button
                                type="button"
                                className="btn ms-2 btn-secondary"
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

                {/* Tabla */}
                <div className="card shadow-sm">

                    <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                        <strong>
                            Listado de Jugadores
                        </strong>
                    </div>

                    <div className="card-body">
                        {
                            jugadores.length === 0 ?
                                (
                                    <div className="alert alert-info mb-0">
                                        No existen jugadores registrados.
                                    </div>
                                ) :
                                (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead>
                                                <tr>
                                                    <th>Dorsal</th>
                                                    <th>Jugador</th>
                                                    <th>DNI</th>
                                                    <th>Disponibilidad</th>
                                                    <th>Disciplina</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {
                                                    jugadores
                                                        .sort((a, b) => a.dorsal - b.dorsal)
                                                        .map((jugador) => {

                                                            const sancionesActivas = jugador.sanciones || [];
                                                            const estaSuspendido = sancionesActivas.length > 0;

                                                            return (
                                                                <tr key={jugador.id}>

                                                                    <td>
                                                                        <strong>#{jugador.dorsal}</strong>
                                                                    </td>

                                                                    <td>
                                                                        {jugador.nombre} {jugador.apellido}
                                                                    </td>

                                                                    <td>
                                                                        {jugador.dni}
                                                                    </td>

                                                                    <td>

                                                                        {
                                                                            estaSuspendido ? (

                                                                                <span className="badge bg-danger">
                                                                                    Suspendido
                                                                                </span>

                                                                            ) : jugador.estado === "activo" ? (

                                                                                <span className="badge bg-success">
                                                                                    Disponible
                                                                                </span>

                                                                            ) : (

                                                                                <span className="badge bg-secondary">
                                                                                    Inactivo
                                                                                </span>

                                                                            )
                                                                        }

                                                                    </td>

                                                                    <td>

                                                                        {
                                                                            sancionesActivas.length === 0 ? (

                                                                                <span className="text-muted">
                                                                                    Sin sanciones activas
                                                                                </span>

                                                                            ) : (

                                                                                sancionesActivas.map((sancion) => {

                                                                                    const restantes =
                                                                                        sancion.fechas_suspension -
                                                                                        sancion.fechas_cumplidas;

                                                                                    return (
                                                                                        <div key={sancion.id}>

                                                                                            <strong>
                                                                                                {sancion.falta}
                                                                                            </strong>

                                                                                            <br />

                                                                                            <small className="text-danger">

                                                                                                {sancion.fechas_cumplidas}
                                                                                                {" de "}
                                                                                                {sancion.fechas_suspension}
                                                                                                {" fechas cumplidas"}

                                                                                                {" · "}

                                                                                                {restantes}
                                                                                                {" restante(s)"}
                                                                                            </small>
                                                                                        </div>
                                                                                    );
                                                                                })
                                                                            )
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        <div className="d-flex gap-2">
                                                                            <button
                                                                                className="btn btn-dark btn-sm"
                                                                                onClick={() => editarJugador(jugador)}
                                                                            >
                                                                                Editar
                                                                            </button>

                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-primary btn-sm"
                                                                                onClick={() => verHistorial(jugador)}
                                                                                disabled={cargandoHistorial}
                                                                            >
                                                                                Historial
                                                                            </button>

                                                                            {/* 
                                                                    <button className={jugador.estado === "activo"
                                                                        ? "btn btn-danger btn-sm"
                                                                        : "btn btn-success btn-sm"
                                                                    }
                                                                        onClick={() => cambiarEstadoJugador(jugador)}
                                                                    >
                                                                        {
                                                                            jugador.estado === "activo"
                                                                                ? "Desactivar"
                                                                                : "Activar"
                                                                        }
                                                                    </button>
                                                                    */}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                )
                        }
                    </div >
                </div >

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

                {/* Modal de Historial */}
                {
                    mostrarHistorial && historialJugador && (
                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor: "rgba(0,0,0,0.5)",
                                zIndex: 1050
                            }}
                        >
                            <div
                                className="bg-white rounded shadow"
                                style={{
                                    width: "90%",
                                    maxWidth: "750px",
                                    maxHeight: "85vh",
                                    overflowY: "auto"
                                }}
                            >

                                {/* CABECERA */}
                                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                                    <div>
                                        <h5 className="mb-0">
                                            Historial disciplinario
                                        </h5>
                                        <small className="text-muted">
                                            #{historialJugador.jugador.dorsal}{" "}
                                            {historialJugador.jugador.nombre}{" "}
                                            {historialJugador.jugador.apellido}
                                        </small>
                                    </div>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => {
                                            setMostrarHistorial(false);
                                            setHistorialJugador(null);
                                        }}
                                    />
                                </div>

                                {/* CUERPO */}
                                <div className="p-3">
                                    {
                                        historialJugador.sanciones.length === 0 ? (
                                            <div className="alert alert-info mb-0">
                                                El jugador no posee antecedentes disciplinarios.
                                            </div>
                                        ) : (
                                            historialJugador.sanciones.map((sancion) => {
                                                const restantes = sancion.fechas_suspension - sancion.fechas_cumplidas;
                                                return (
                                                    <div key={sancion.id} className="card mb-3">
                                                        <div className="card-body">
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <div>
                                                                    <h6 className="mb-1">
                                                                        {sancion.falta}
                                                                    </h6>
                                                                    <span className="text-muted">
                                                                        {
                                                                            sancion.tipo
                                                                                .charAt(0)
                                                                                .toUpperCase()
                                                                            +
                                                                            sancion.tipo.slice(1)
                                                                        }
                                                                    </span>
                                                                </div>
                                                                {
                                                                    sancion.estado === "activa"
                                                                        ? (
                                                                            <span className="badge bg-danger">
                                                                                Activa
                                                                            </span>
                                                                        )
                                                                        : (
                                                                            <span className="badge bg-success">
                                                                                Cumplida
                                                                            </span>
                                                                        )
                                                                }
                                                            </div>
                                                            <hr />
                                                            <p className="mb-2">
                                                                <strong>
                                                                    Fecha:
                                                                </strong>
                                                                {" "}
                                                                {
                                                                    new Date(
                                                                        sancion.fecha + "T00:00:00"
                                                                    ).toLocaleDateString("es-AR")
                                                                }
                                                            </p>
                                                            {
                                                                sancion.partido && (
                                                                    <p className="mb-2">
                                                                        <strong>
                                                                            Partido:
                                                                        </strong>
                                                                        {" "}
                                                                        {
                                                                            sancion.partido.fase === "regular"
                                                                                ? `Fase regular - Jornada ${sancion.partido.jornada}`
                                                                                : sancion.partido.fase === "cuartos"
                                                                                    ? "Cuartos de final"
                                                                                    : sancion.partido.fase === "semifinal"
                                                                                        ? "Semifinal"
                                                                                        : "Final"
                                                                        }
                                                                    </p>
                                                                )
                                                            }
                                                            <p className="mb-2">
                                                                <strong>
                                                                    Suspensión:
                                                                </strong>
                                                                {" "}
                                                                {sancion.fechas_suspension} fecha(s)
                                                            </p>
                                                            {
                                                                sancion.fechas_suspension > 0 && (
                                                                    <p className="mb-2">
                                                                        <strong>
                                                                            Cumplimiento:
                                                                        </strong>
                                                                        {" "}
                                                                        {sancion.fechas_cumplidas}
                                                                        {" de "}
                                                                        {sancion.fechas_suspension}
                                                                        {
                                                                            sancion.estado === "activa" && (
                                                                                <>
                                                                                    {" · "}
                                                                                    {restantes} restante(s)
                                                                                </>
                                                                            )
                                                                        }
                                                                    </p>
                                                                )
                                                            }
                                                            <p className="mb-0">
                                                                <strong>
                                                                    Explicación:
                                                                </strong>
                                                                <br />
                                                                {sancion.descripcion}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )
                                    }
                                </div>

                                {/* PIE */}
                                <div className="p-3 border-top text-end">
                                    <button
                                        type="button"
                                        className="btn btn-dark"
                                        onClick={() => {
                                            setMostrarHistorial(false);
                                            setHistorialJugador(null);
                                        }}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
        </div >
    );
};

export default JugadoresEquipo;