import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminTorneoCategorias = () => {

    const navigate = useNavigate();

    const [showHelp, setShowHelp] = useState(false);

    const [torneos, setTorneos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [torneoCategorias, setTorneoCategorias] = useState([]);

    const [torneoId, setTorneoId] = useState("");
    const [categoriaId, setCategoriaId] = useState("");
    const [arancel, setArancel] = useState("");

    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("success");

    const token = localStorage.getItem("token");

    useEffect(() => {
        obtenerTorneos();
        obtenerCategorias();
        obtenerTorneoCategorias();
    }, []);

    const obtenerTorneos = async () => {
        try {

            const response = await fetch(
                "http://localhost:3000/api/v1/torneos"
            );

            const data = await response.json();

            setTorneos(data);

        } catch (error) {
            console.error(error);
        }
    };

    const obtenerCategorias = async () => {
        try {

            const response = await fetch(
                "http://localhost:3000/api/v1/categorias"
            );

            const data = await response.json();

            setCategorias(data);

        } catch (error) {
            console.error(error);
        }
    };

    const obtenerTorneoCategorias = async () => {
        try {

            const response = await fetch(
                "http://localhost:3000/api/v1/torneo-categorias"
            );

            const data = await response.json();

            setTorneoCategorias(data);

        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMensaje("");

        try {

            const response = await fetch(
                "http://localhost:3000/api/v1/torneo-categorias",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        torneo_id: torneoId,
                        categoria_id: categoriaId,
                        arancel
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setTipoMensaje("danger");
                setMensaje(data.message);

                return;
            }

            setTipoMensaje("success");
            setMensaje(
                "Categoría asignada correctamente al torneo."
            );

            setTorneoId("");
            setCategoriaId("");
            setArancel("");

            obtenerTorneoCategorias();

        } catch (error) {

            console.error(error);

            setTipoMensaje("danger");
            setMensaje(
                "Error al crear la relación."
            );
        }
    };

    return (
        <div className="container mt-4 mb-5">

            <div className="col-lg-10 mx-auto">

                {/* Título */}
                <div className="d-flex align-items-center mb-2">

                    <h2 className="me-2">
                        Torneos y Categorías
                    </h2>

                    <span
                        className="text-primary"
                        style={{
                            cursor: "pointer",
                            fontSize: "1.2rem"
                        }}
                        title="Ayuda"
                        onClick={() =>
                            setShowHelp(true)
                        }
                    >
                        ❓
                    </span>

                </div>

                {/* Breadcrumb */}
                <nav
                    className="mb-3"
                    style={{ fontSize: "0.9rem" }}
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
                        Torneos - Categorías
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

                {/* FORMULARIO */}

                <div className="card shadow-sm mb-4">

                    <div className="card-header bg-dark text-white">

                        <strong>
                            Asignar categoría a torneo
                        </strong>

                    </div>

                    <div className="card-body">

                        {
                            mensaje &&
                            (
                                <div
                                    className={`alert alert-${tipoMensaje}`}
                                >
                                    {mensaje}
                                </div>
                            )
                        }

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">

                                <label className="form-label">
                                    Torneo
                                </label>

                                <select
                                    className="form-select"
                                    value={torneoId}
                                    onChange={(e) =>
                                        setTorneoId(
                                            e.target.value
                                        )
                                    }
                                    required
                                >

                                    <option value="">
                                        Seleccionar torneo
                                    </option>

                                    {
                                        torneos.map(
                                            (torneo) => (
                                                <option
                                                    key={torneo.id}
                                                    value={torneo.id}
                                                >
                                                    {
                                                        torneo.nombre
                                                    }
                                                </option>
                                            )
                                        )
                                    }

                                </select>

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Categoría
                                </label>

                                <select
                                    className="form-select"
                                    value={categoriaId}
                                    onChange={(e) =>
                                        setCategoriaId(
                                            e.target.value
                                        )
                                    }
                                    required
                                >

                                    <option value="">
                                        Seleccionar categoría
                                    </option>

                                    {
                                        categorias.map(
                                            (categoria) => (
                                                <option
                                                    key={categoria.id}
                                                    value={categoria.id}
                                                >
                                                    {
                                                        categoria.nombre
                                                    }
                                                </option>
                                            )
                                        )
                                    }

                                </select>

                            </div>

                            <div className="mb-4">

                                <label className="form-label">
                                    Arancel
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    value={arancel}
                                    onChange={(e) =>
                                        setArancel(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Guardar relación
                            </button>

                        </form>

                    </div>

                </div>

                {/* TABLA */}

                <div className="card shadow-sm">

                    <div className="card-header bg-dark text-white">

                        <strong>
                            Categorías asignadas
                        </strong>

                    </div>

                    <div className="card-body">

                        <div className="table-responsive">

                            <table className="table table-hover align-middle">

                                <thead>

                                    <tr>

                                        <th>
                                            Torneo
                                        </th>

                                        <th>
                                            Categoría
                                        </th>

                                        <th>
                                            Equipos
                                        </th>

                                        <th>
                                            Fixture
                                        </th>

                                        <th>
                                            Arancel
                                        </th>

                                        <th>
                                            Acciones
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        torneoCategorias.map(
                                            (tc) => (

                                                <tr
                                                    key={tc.id}
                                                >

                                                    <td>
                                                        {
                                                            tc.torneo?.nombre
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            tc.categoria?.nombre
                                                        }
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={
                                                                Number(
                                                                    tc.equipos_inscriptos
                                                                ) >= 2
                                                                    ? "badge bg-success"
                                                                    : "badge bg-warning text-dark"
                                                            }
                                                        >
                                                            {
                                                                tc.equipos_inscriptos || 0
                                                            }
                                                            {" "}
                                                            equipos
                                                        </span>

                                                    </td>

                                                    <td>

                                                        {
                                                            Number(
                                                                tc.equipos_inscriptos
                                                            ) >= 2
                                                                ? (
                                                                    <span className="badge bg-success">
                                                                        Listo
                                                                    </span>
                                                                )
                                                                : (
                                                                    <span className="badge bg-secondary">
                                                                        Pendiente
                                                                    </span>
                                                                )
                                                        }

                                                    </td>

                                                    <td>

                                                        <span className="badge bg-primary">
                                                            $
                                                            {
                                                                tc.arancel
                                                            }
                                                        </span>

                                                    </td>

                                                    <td>

                                                        <Link
                                                            to={`/panel/admin/fixture/${tc.id}`}
                                                            className="btn btn-dark btn-sm"
                                                        >
                                                            Ver Fixture
                                                        </Link>

                                                    </td>

                                                </tr>
                                            )
                                        )
                                    }

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

                {/* Modal ayuda */}

                {
                    showHelp && (
                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor:
                                    "rgba(0,0,0,0.5)",
                                zIndex: 1050
                            }}
                        >

                            <div
                                className="bg-white p-4 rounded shadow"
                                style={{
                                    maxWidth: "500px"
                                }}
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

                                <p>
                                    Desde aquí podés asociar
                                    categorías a los torneos.
                                </p>

                                <p>
                                    También podés consultar
                                    cuántos equipos están
                                    inscriptos y acceder al
                                    fixture de cada categoría.
                                </p>

                            </div>

                        </div>
                    )
                }

            </div>

        </div>
    );
};

export default AdminTorneoCategorias;