import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminPartido = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [showHelp, setShowHelp] = useState(false);
    const [partido, setPartido] = useState(null);
    const [sedes, setSedes] = useState([]);
    const [arbitros, setArbitros] = useState([]);

    const [formData, setFormData] = useState({
        fecha: "",
        sede_id: "",
        arbitro_id: "",
        estado: "pendiente",
        puntaje_local: "",
        puntaje_visitante: ""
    });

    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        obtenerPartido();
        obtenerSedes();
        obtenerArbitros();
    }, []);

    const obtenerPartido = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/partidos/${id}`);
            const data = await response.json();
            setPartido(data);
            setFormData({
                fecha: data.fecha ? new Date(data.fecha).toISOString().slice(0, 16) : "",
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

            const response =
                await fetch(
                    "http://localhost:3000/api/v1/sedes"
                );

            const data =
                await response.json();

            setSedes(data);

        } catch (error) {

            console.error(error);
        }
    };

    const obtenerArbitros = async () => {

        try {

            const response =
                await fetch(
                    "http://localhost:3000/api/v1/arbitros"
                );

            const data =
                await response.json();

            setArbitros(data);

        } catch (error) {

            console.error(error);
        }
    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setMensaje("");
    };

    const validarFormulario = () => {

        if (!formData.fecha) {
            return "Debe indicar fecha y hora.";
        }

        if (
            formData.estado === "jugado"
        ) {

            if (
                formData.puntaje_local === "" ||
                formData.puntaje_visitante === ""
            ) {
                return "Debe cargar ambos resultados.";
            }
        }

        return "";
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const error = validarFormulario();

        if (error) {
            setMensaje(error);
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const payload = {
                ...formData,
                sede_id: formData.sede_id === "" ? null : Number(formData.sede_id),
                arbitro_id: formData.arbitro_id === "" ? null : Number(formData.arbitro_id),
                puntaje_local: formData.puntaje_local === "" ? null : Number(formData.puntaje_local),
                puntaje_visitante: formData.puntaje_visitante === "" ? null : Number(formData.puntaje_visitante)
            };

            if (payload.estado !== "jugado") {
                payload.puntaje_local = null;
                payload.puntaje_visitante = null;
            }

            const response = await fetch(`http://localhost:3000/api/v1/partidos/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMensaje(data.message);
                return;
            }

            setMensaje("Partido actualizado correctamente.");

            obtenerPartido();

        } catch (error) {
            console.error(error);
            setMensaje("Error al actualizar el partido.");
        }
    };

    if (!partido) {

        return (
            <div className="container mt-5">
                Cargando...
            </div>
        );
    }

    return (
        <div className="container mt-4 mb-5">

            <div className="col-lg-10 mx-auto">

                <div className="d-flex align-items-center mb-2">

                    <h2 className="me-2">
                        Gestionar Partido
                    </h2>

                    <span
                        className="text-primary"
                        style={{
                            cursor: "pointer",
                            fontSize: "1.2rem"
                        }}
                        onClick={() =>
                            setShowHelp(true)
                        }
                    >
                        ❓
                    </span>

                </div>

                <nav
                    className="mb-3"
                    style={{
                        fontSize: "0.9rem"
                    }}
                >
                    <span
                        className="text-primary"
                        style={{
                            cursor: "pointer"
                        }}
                        onClick={() =>
                            navigate("/panel/admin")
                        }
                    >
                        Admin Dashboard
                    </span>

                    {" > "}

                    <span className="text-muted">
                        Partido
                    </span>

                </nav>

                <button
                    className="btn btn-dark mb-3"
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    Volver
                </button>

                <div className="card shadow-sm mb-4">

                    <div className="card-header bg-dark text-white">
                        <strong>
                            Encuentro
                        </strong>
                    </div>

                    <div className="card-body text-center">

                        <h4>
                            {
                                partido.local?.Equipo?.nombre
                            }
                        </h4>

                        <div className="text-muted mb-2">
                            VS
                        </div>

                        <h4>
                            {
                                partido.visitante?.Equipo?.nombre
                            }
                        </h4>

                        <hr />

                        <div className="row">

                            <div className="col-md-6">
                                <strong>
                                    Jornada:
                                </strong>{" "}
                                {partido.jornada}
                            </div>

                            <div className="col-md-6">
                                <strong>
                                    ID Partido:
                                </strong>{" "}
                                {partido.id}
                            </div>

                        </div>

                    </div>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="card shadow-sm mb-4">

                        <div className="card-header bg-dark text-white">
                            <strong>
                                Programación
                            </strong>
                        </div>

                        <div className="card-body">

                            <div className="row">

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Fecha y Hora
                                    </label>

                                    <input
                                        type="datetime-local"
                                        name="fecha"
                                        className="form-control"
                                        value={formData.fecha}
                                        onChange={handleChange}
                                    />

                                </div>

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Estado
                                    </label>

                                    <select
                                        name="estado"
                                        className="form-select"
                                        value={formData.estado}
                                        onChange={handleChange}
                                    >
                                        <option value="pendiente">
                                            Pendiente
                                        </option>

                                        <option value="jugado">
                                            Jugado
                                        </option>

                                        <option value="suspendido">
                                            Suspendido
                                        </option>

                                    </select>

                                </div>

                            </div>

                            <div className="row">

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Sede
                                    </label>

                                    <select
                                        name="sede_id"
                                        className="form-select"
                                        value={formData.sede_id}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            No asignado
                                        </option>

                                        {
                                            sedes.map((sede) => (
                                                <option
                                                    key={sede.id}
                                                    value={sede.id}
                                                >
                                                    {sede.nombre}
                                                </option>
                                            ))
                                        }

                                    </select>

                                </div>

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Árbitro
                                    </label>

                                    <select
                                        name="arbitro_id"
                                        className="form-select"
                                        value={formData.arbitro_id}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            No asignado
                                        </option>

                                        {
                                            arbitros.map((arbitro) => (
                                                <option
                                                    key={arbitro.id}
                                                    value={arbitro.id}
                                                >
                                                    {arbitro.nombre} {arbitro.apellido}
                                                </option>
                                            ))
                                        }

                                    </select>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="card shadow-sm mb-4">

                        <div className="card-header bg-dark text-white">
                            <strong>
                                Resultado
                            </strong>
                        </div>

                        <div className="card-body">

                            <div className="row">

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Puntaje Local
                                    </label>

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

                                    <label className="form-label">
                                        Puntaje Visitante
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        name="puntaje_visitante"
                                        className="form-control"
                                        value={formData.puntaje_visitante}
                                        onChange={handleChange}
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                    {
                        mensaje &&
                        <div className="alert alert-info">
                            {mensaje}
                        </div>
                    }

                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Guardar cambios
                    </button>

                </form>

            </div>

        </div>
    );

};

export default AdminPartido;