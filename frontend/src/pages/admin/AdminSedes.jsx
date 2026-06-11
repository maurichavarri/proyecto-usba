import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminSedes = () => {
    const [sedes, setSedes] = useState([]);
    useEffect(() => {
        obtenerSedes();
    }, []);

    const obtenerSedes = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/v1/sedes");
            const data = await response.json();
            setSedes(data);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Sedes</h2>
                <Link
                    to="/panel/admin/sedes/crear"
                    className="btn btn-dark"
                >
                    Nueva sede
                </Link>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Dirección</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                sedes.map((sede) => (
                                    <tr key={sede.id}>
                                        <td>
                                            {sede.nombre}
                                        </td>
                                        <td>
                                            {sede.direccion}
                                        </td>
                                        <td>
                                            <Link
                                                to={`/panel/admin/sedes/editar/${sede.id}`}
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
            </div>
        </div>
    );
};

export default AdminSedes;