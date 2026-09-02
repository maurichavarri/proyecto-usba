import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminPartido = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [showHelp, setShowHelp] = useState(false);
    const [partido, setPartido] = useState(null);
    const [sedes, setSedes] = useState([]);
    const [arbitros, setArbitros] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [mostrarModalIncompleto, setMostrarModalIncompleto] = useState(false);
    const [mostrarModalFinalizar, setMostrarModalFinalizar] = useState(false);

    const [formData, setFormData] = useState({
        fecha: "",
        sede_id: "",
        arbitro_id: "",
        estado: "pendiente",
        puntaje_local: "",
        puntaje_visitante: ""
    });

    useEffect(() => {
        obtenerPartido();
        obtenerSedes();
        obtenerArbitros();
    }, []);

    const formatearFechaHoraInput = (fecha) => {
        if (!fecha) return "";
        const date = new Date(fecha);
        const anio = date.getFullYear();
        const mes = String(date.getMonth() + 1).padStart(2, "0");
        const dia = String(date.getDate()).padStart(2, "0");
        const horas = String(date.getHours()).padStart(2, "0");
        const minutos = String(date.getMinutes()).padStart(2, "0");
        return `${anio}-${mes}-${dia}T${horas}:${minutos}`;
    };

    const obtenerPartido = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/partidos/${id}`);
            const data = await response.json();
            setPartido(data);
            setFormData({
                fecha: formatearFechaHoraInput(data.fecha),
                sede_id: data.sede_id || "",
                arbitro_id: data.arbitro_id || "",
                estado: data.estado || "pendiente",
                puntaje_local: data.puntaje_local ?? "",
                puntaje_visitante: data.puntaje_visitante ?? ""
            });
        } catch (error) {
            console.error(error);
        }
    };

    const obtenerSedes = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/v1/sedes");
            const data = await response.json();
            setSedes(data);
        } catch (error) {
            console.error(error);
        }
    };

    const obtenerArbitros = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/v1/arbitros");
            const data = await response.json();
            setArbitros(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
<<<<<<< HEAD
<<<<<<< HEAD
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
=======
        setFormData({ ...formData, [e.target.name]: e.target.value });
>>>>>>> 63c6e1b (cambios de administrador y delegados)
=======
        setFormData({ ...formData, [e.target.name]: e.target.value });
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
        setMensaje("");
    };

    const validarFormulario = () => {
<<<<<<< HEAD
<<<<<<< HEAD
        // Mientras no esté jugado, permitimos guardar incompleto.
        if (formData.estado !== "jugado") {
            return "";
        }

        // Para cerrar definitivamente el partido,
        // todos los campos son obligatorios.
        if (
            !formData.fecha ||
            !formData.sede_id ||
            !formData.arbitro_id ||
            formData.puntaje_local === "" ||
            formData.puntaje_visitante === ""
        ) {
            return "PARTIDO_INCOMPLETO";
=======
=======
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
        if (!formData.fecha) return "Debe indicar fecha y hora.";
        if (formData.estado === "jugado") {
            if (formData.puntaje_local === "" || formData.puntaje_visitante === "") {
                return "Debe cargar ambos resultados.";
            }
>>>>>>> 63c6e1b (cambios de administrador y delegados)
        }
        return "";
    };

<<<<<<< HEAD
    const guardarPartido = async () => {
=======
    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = validarFormulario();
        if (error) { setMensaje(error); return; }
<<<<<<< HEAD
>>>>>>> 63c6e1b (cambios de administrador y delegados)
=======
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0

        try {

            const token = localStorage.getItem("token");
            const payload = {
                ...formData,
                sede_id:
                    formData.sede_id === ""
                        ? null
                        : Number(formData.sede_id),

                arbitro_id:
                    formData.arbitro_id === ""
                        ? null
                        : Number(formData.arbitro_id),

                puntaje_local:
                    formData.puntaje_local === ""
                        ? null
                        : Number(formData.puntaje_local),

                puntaje_visitante:
                    formData.puntaje_visitante === ""
                        ? null
                        : Number(formData.puntaje_visitante)
            };

            if (payload.estado !== "jugado") {
                payload.puntaje_local = null;
                payload.puntaje_visitante = null;
            }

<<<<<<< HEAD
<<<<<<< HEAD
            const response = await fetch(
                `http://localhost:3000/api/v1/partidos/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                }
            );
=======
=======
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
            const response = await fetch(`http://localhost:3000/api/v1/partidos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
<<<<<<< HEAD
>>>>>>> 63c6e1b (cambios de administrador y delegados)
=======
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0

            const data = await response.json();
            if (!response.ok) { setMensaje(data.message); return; }

            setMensaje("Partido actualizado correctamente.");
            obtenerPartido();

        } catch (error) {
            console.error(error);
            setMensaje("Error al actualizar el partido.");
        }
    };

<<<<<<< HEAD
<<<<<<< HEAD
    const handleSubmit = async (e) => {

        e.preventDefault();

        const error = validarFormulario();

        if (error === "PARTIDO_INCOMPLETO") {
            setMostrarModalIncompleto(true);
            return;
        }

        // Si va a pasar a jugado, primero pedir confirmación.
        if (formData.estado === "jugado") {
            setMostrarModalFinalizar(true);
            return;
        }

        await guardarPartido();
    };

    if (!partido) {
        return (
            <div className="container mt-5">
                Cargando...
            </div>
        );
=======
    if (!partido) {
        return <div className="container mt-5">Cargando...</div>;
>>>>>>> 63c6e1b (cambios de administrador y delegados)
=======
    if (!partido) {
        return <div className="container mt-5">Cargando...</div>;
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
    }

    return (
        <div className="container mt-4 mb-5">
            <div className="col-lg-10 mx-auto">

                {/* Título */}
                <div className="d-flex align-items-center mb-2">
                    <h2 className="me-2">Gestionar Partido</h2>
                    <span
                        className="text-primary"
                        style={{ cursor: "pointer", fontSize: "1.2rem" }}
                        onClick={() => setShowHelp(true)}
                    >
                        ❓
                    </span>
                </div>

                {/* Breadcrumb */}
                <nav className="mb-3" style={{ fontSize: "0.9rem" }}>
                    <span
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/panel/admin")}
                    >
                        Panel del Administrador
                    </span>
                    {" > "}
                    <span className="text-muted">Partido</span>
                </nav>

                {/* Botón — navigate(-1) porque viene desde el fixture */}
                <button
                    className="btn btn-dark mb-3"
                    onClick={() => navigate(-1)}
                >
                    ← Regresar al fixture
                </button>

                {/* Encuentro */}
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-dark text-white">
                        <strong>Encuentro</strong>
                    </div>
                    <div className="card-body text-center">
                        <h4>{partido.local?.Equipo?.nombre}</h4>
                        <div className="text-muted mb-2">VS</div>
                        <h4>{partido.visitante?.Equipo?.nombre}</h4>
                        <hr />
                        <div className="row">
                            <div className="col-md-6">
                                <strong>Jornada:</strong> {partido.jornada}
                            </div>
                            <div className="col-md-6">
                                <strong>ID Partido:</strong> {partido.id}
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Programación */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-dark text-white">
                            <strong>Programación</strong>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Fecha y Hora</label>
                                    <input
                                        type="datetime-local"
                                        name="fecha"
                                        className="form-control"
                                        value={formData.fecha}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Estado</label>
                                    <select
                                        name="estado"
                                        className="form-select"
                                        value={formData.estado}
                                        onChange={handleChange}
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="jugado">Jugado</option>
                                        <option value="suspendido">Suspendido</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Sede</label>
                                    <select
                                        name="sede_id"
                                        className="form-select"
                                        value={formData.sede_id}
                                        onChange={handleChange}
                                    >
                                        <option value="">No asignado</option>
                                        {sedes.map((sede) => (
                                            <option key={sede.id} value={sede.id}>{sede.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Árbitro</label>
                                    <select
                                        name="arbitro_id"
                                        className="form-select"
                                        value={formData.arbitro_id}
                                        onChange={handleChange}
                                    >
                                        <option value="">No asignado</option>
                                        {arbitros.map((arbitro) => (
                                            <option key={arbitro.id} value={arbitro.id}>
                                                {arbitro.nombre} {arbitro.apellido}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resultado */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-dark text-white">
                            <strong>Resultado</strong>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Puntaje Local</label>
                                    <input
                                        type="number"
                                        min="0"
                                        name="puntaje_local"
                                        className="form-control"
                                        value={formData.puntaje_local}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Puntaje Visitante</label>
                                    <input
                                        type="number"
                                        min="0"
                                        name="puntaje_visitante"
                                        className="form-control"
                                        value={formData.puntaje_visitante}
                                        onChange={handleChange}
                                    />
<<<<<<< HEAD
                                </div>
                            </div>
                        </div>
                    </div>

                    {mensaje && <div className="alert alert-info">{mensaje}</div>}

<<<<<<< HEAD
                    {
                        partido.estado === "jugado" ? (
                            <div className="alert alert-success mb-0">
                                Partido finalizado. Los datos ya no pueden modificarse.
                            </div>
                        ) : (
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Guardar cambios
                            </button>
                        )
                    }

                </form>

                {
                    mostrarModalIncompleto && (

                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor: "rgba(0,0,0,0.5)",
                                zIndex: 1050
                            }}
                        >

                            <div
                                className="bg-white p-4 rounded shadow text-center"
                                style={{
                                    width: "90%",
                                    maxWidth: "480px"
                                }}
                            >

                                <div
                                    className="text-warning mb-3"
                                    style={{ fontSize: "3rem" }}
                                >
                                    ⚠
                                </div>

                                <h4>
                                    Datos incompletos
                                </h4>

                                <p className="text-muted">
                                    Para marcar el partido como jugado debe completar
                                    la fecha y hora, sede, árbitro y ambos resultados.
                                </p>

                                <button
                                    type="button"
                                    className="btn btn-dark"
                                    onClick={() =>
                                        setMostrarModalIncompleto(false)
                                    }
                                >
                                    Aceptar
                                </button>

                            </div>

                        </div>
                    )
                }

                {
                    mostrarModalFinalizar && (

                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor: "rgba(0,0,0,0.5)",
                                zIndex: 1050
                            }}
                        >

                            <div
                                className="bg-white p-4 rounded shadow"
                                style={{
                                    width: "90%",
                                    maxWidth: "500px"
                                }}
                            >

                                <div className="text-center">

                                    <div
                                        className="text-warning mb-2"
                                        style={{ fontSize: "3rem" }}
                                    >
                                        ⚠
                                    </div>

                                    <h4>
                                        Finalizar partido
                                    </h4>

                                    <p>
                                        ¿Estás seguro de marcar este partido como
                                        <strong> jugado</strong>?
                                    </p>

                                </div>

                                <div className="alert alert-warning">
                                    Una vez finalizado el partido, sus datos
                                    no podrán volver a modificarse.
                                </div>

                                <div className="d-flex justify-content-center gap-2">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            setMostrarModalFinalizar(false)
                                        }
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={async () => {

                                            setMostrarModalFinalizar(false);

                                            await guardarPartido();
                                        }}
                                    >
                                        Aceptar y finalizar
                                    </button>

=======
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
                                </div>
                            </div>
                        </div>
<<<<<<< HEAD
                    )
                }

=======
=======
                    </div>

                    {mensaje && <div className="alert alert-info">{mensaje}</div>}

>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
                    <button type="submit" className="btn btn-primary">
                        Guardar cambios
                    </button>
                </form>

                {/* Modal ayuda */}
                {showHelp && (
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
                    >
                        <div className="bg-white p-4 rounded shadow" style={{ maxWidth: "500px" }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5>¿Cómo funciona este apartado?</h5>
                                <button className="btn-close" onClick={() => setShowHelp(false)} />
                            </div>
                            <p>Desde aquí podés gestionar los datos de un partido: asignar sede, árbitro, fecha y cargar el resultado.</p>
                        </div>
                    </div>
                )}
<<<<<<< HEAD
>>>>>>> 63c6e1b (cambios de administrador y delegados)
=======
>>>>>>> f9795a5b6e129b64176c2a4300c271c304d9b0f0
            </div>
        </div>
    );
};

export default AdminPartido;