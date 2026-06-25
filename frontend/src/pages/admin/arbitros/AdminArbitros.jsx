import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminArbitros = () => {

    const navigate = useNavigate();

    const [arbitros, setArbitros] = useState([]);
    const [showHelp, setShowHelp] = useState(false);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        obtenerArbitros();
    }, []);

    const obtenerArbitros = async () => {

        try {

            const response = await fetch(
                "http://localhost:3000/api/v1/arbitros"
            );

            const data = await response.json();

            setArbitros(data);

        } catch (error) {

            console.error(error);
        }
    };

    const arbitrosFiltrados = arbitros.filter((arbitro) => {

        const texto = busqueda.toLowerCase();

        return (
            arbitro.nombre?.toLowerCase().includes(texto) ||
            arbitro.apellido?.toLowerCase().includes(texto) ||
            arbitro.usuario?.correo?.toLowerCase().includes(texto)
        );
    });

    return (
        <div className="container mt-4 mb-5">

            <div className="d-flex align-items-center mb-2">

                <h2 className="me-2">
                    Gestión de Árbitros
                </h2>

                <span
                    className="text-primary"
                    style={{
                        cursor: "pointer",
                        fontSize: "1.2rem"
                    }}
                    onClick={() => setShowHelp(true)}
                >
                    ❓
                </span>

            </div>

            <nav
                className="mb-3"
                style={{ fontSize: "0.9rem" }}
            >
                <span
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                        navigate("/panel/admin")
                    }
                >
                    Admin Dashboard
                </span>

                {" > "}

                <span className="text-muted">
                    Árbitros
                </span>
            </nav>

            <div className="d-flex justify-content-between align-items-center mb-3">

                <button
                    className="btn btn-dark"
                    onClick={() => navigate(-1)}
                >
                    Volver
                </button>

                <Link
                    to="/panel/admin/arbitros/crear"
                    className="btn btn-primary"
                >
                    Nuevo árbitro
                </Link>

            </div>

            <div className="card shadow-sm">

                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">

                    <strong>
                        Listado de árbitros
                    </strong>

                    <input
                        type="text"
                        className="form-control w-auto"
                        placeholder="Buscar..."
                        value={busqueda}
                        onChange={(e) =>
                            setBusqueda(e.target.value)
                        }
                    />

                </div>

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table align-middle">

                            <thead>

                                <tr>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Correo</th>
                                    <th>Acciones</th>
                                </tr>

                            </thead>

                            <tbody>

                                {
                                    arbitrosFiltrados.length > 0 ? (

                                        arbitrosFiltrados.map((arbitro) => (

                                            <tr key={arbitro.id}>

                                                <td>
                                                    {arbitro.nombre}
                                                </td>

                                                <td>
                                                    {arbitro.apellido}
                                                </td>

                                                <td>
                                                    {
                                                        arbitro.usuario?.correo ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>

                                                    <Link
                                                        to={`/panel/admin/arbitros/editar/${arbitro.id}`}
                                                        className="btn btn-primary btn-sm"
                                                    >
                                                        Editar
                                                    </Link>

                                                </td>

                                            </tr>
                                        ))

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="4"
                                                className="text-center text-muted"
                                            >
                                                No se encontraron árbitros.
                                            </td>

                                        </tr>
                                    )
                                }

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

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
                                Desde aquí podés gestionar los árbitros
                                del sistema.
                            </p>

                            <p>
                                Podrás registrar nuevos árbitros,
                                modificar sus datos y posteriormente
                                asignarlos a partidos dentro de los
                                distintos torneos.
                            </p>

                        </div>

                    </div>
                )
            }

        </div>
    );

};

export default AdminArbitros;