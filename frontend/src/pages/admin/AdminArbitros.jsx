import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminArbitros = () => {

    const [arbitros, setArbitros] = useState([]);

    useEffect(() => {
        obtenerArbitros();
    }, []);

    const obtenerArbitros = async () => {
        const response = await fetch("http://localhost:3000/api/v1/arbitros");
        const data = await response.json();
        setArbitros(data);
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Árbitros</h2>
                <Link
                    to="/panel/admin/arbitros/crear"
                    className="btn btn-dark"
                >
                    Nuevo árbitro
                </Link>

            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        arbitros.map((arbitro) => (
                            <tr key={arbitro.id}>
                                <td>
                                    {arbitro.nombre}
                                </td>
                                <td>
                                    {arbitro.apellido}
                                </td>
                                <td>
                                    <Link
                                        to={`/panel/admin/arbitros/editar/${arbitro.id}`}
                                        className="btn btn-warning btn-sm"
                                    >
                                        Editar
                                    </Link>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default AdminArbitros;