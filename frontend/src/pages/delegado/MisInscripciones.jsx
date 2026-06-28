import { useEffect, useState } from "react";

const MisInscripciones = () => {

    const [inscripciones, setInscripciones] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [torneoCategorias, setTorneoCategorias] = useState([]);

    const [equipoId, setEquipoId] = useState("");
    const [torneoCategoriaId, setTorneoCategoriaId] = useState("");

    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        obtenerInscripciones();
        obtenerEquipos();
        obtenerTorneoCategorias();
    }, []);

    // =========================
    // INSCRIPCIONES
    // =========================

    const obtenerInscripciones = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/v1/delegado/inscripciones",
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

            setInscripciones(data);

        } catch (error) {
            console.error(error);
        }
    };

    // =========================
    // EQUIPOS
    // =========================

    const obtenerEquipos = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/v1/delegado/equipos",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();
            setEquipos(data);

        } catch (error) {
            console.error(error);
        }
    };

    // =========================
    // TORNEO CATEGORÍAS
    // =========================

    const obtenerTorneoCategorias = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/v1/torneo-categorias");
            const data = await response.json();
            setTorneoCategorias(data);

        } catch (error) {
            console.error(error);
        }
    };

    // =========================
    // CREAR INSCRIPCIÓN
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();
        setMensaje("");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/v1/delegado/inscripciones",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        equipo_id: equipoId,
                        torneo_categoria_id: torneoCategoriaId
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setMensaje("Inscripción creada correctamente");
            setEquipoId("");
            setTorneoCategoriaId("");
            obtenerInscripciones();

        } catch (error) {
            setMensaje(error.message);
        }
    };

    return (
        <div className="container mt-4 mb-5">
            <h2 className="mb-4">
                Mis Inscripciones
            </h2>

            {/* FORMULARIO */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="mb-3">
                        Nueva Inscripción
                    </h5>
                    {
                        mensaje && (
                            <div className="alert alert-info">
                                {mensaje}
                            </div>
                        )
                    }

                    <form onSubmit={handleSubmit}>

                        {/* EQUIPO */}
                        <div className="mb-3">
                            <label className="form-label">
                                Equipo
                            </label>
                            <select
                                className="form-select"
                                value={equipoId}
                                onChange={(e) =>
                                    setEquipoId(e.target.value)
                                }
                                required
                            >
                                <option value="">
                                    Seleccionar equipo
                                </option>
                                {
                                    equipos.map((equipo) => (
                                        <option
                                            key={equipo.id}
                                            value={equipo.id}
                                        >
                                            {equipo.nombre}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        {/* TORNEO CATEGORÍA */}
                        <div className="mb-3">
                            <label className="form-label">
                                Torneo / Categoría
                            </label>
                            <select
                                className="form-select"
                                value={torneoCategoriaId}
                                onChange={(e) =>
                                    setTorneoCategoriaId(e.target.value)
                                }
                                required
                            >
                                <option value="">
                                    Seleccionar torneo
                                </option>
                                {
                                    torneoCategorias.map((tc) => (
                                        <option
                                            key={tc.id}
                                            value={tc.id}
                                        >
                                            {tc.torneo?.nombre} - {tc.categoria?.nombre}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                        <button className="btn btn-dark">
                            Inscribirse
                        </button>
                    </form>
                </div>
            </div>

            {/* TABLA */}
            <div className="card shadow-sm">
                <div className="card-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Equipo</th>
                                <th>Torneo</th>
                                <th>Categoría</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                inscripciones.map((inscripcion) => (
                                    <tr key={inscripcion.id}>
                                        <td>
                                            {inscripcion.Equipo?.nombre}
                                        </td>
                                        <td>
                                            {
                                                inscripcion.torneoCategoria?.torneo?.nombre
                                            }
                                        </td>
                                        <td>
                                            {
                                                inscripcion.torneoCategoria?.categoria?.nombre
                                            }
                                        </td>
                                        <td>
                                            <span
                                                className={
                                                    inscripcion.estado === 'confirmado'
                                                        ? 'badge bg-success'
                                                        : inscripcion.estado === 'rechazado'
                                                            ? 'badge bg-danger'
                                                            : 'badge bg-warning text-dark'
                                                }
                                            >
                                                {inscripcion.estado}
                                            </span>
                                        </td>
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

export default MisInscripciones;