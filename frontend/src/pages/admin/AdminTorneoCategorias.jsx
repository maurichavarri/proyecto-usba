import { useEffect, useState } from "react";

const AdminTorneoCategorias = () => {

    const [torneos, setTorneos] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const [torneoId, setTorneoId] = useState("");
    const [categoriaId, setCategoriaId] = useState("");
    const [arancel, setArancel] = useState("");

    // Token
    const token = localStorage.getItem("token");

    // Obtener torneos
    const obtenerTorneos = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/v1/torneos");
            const data = await response.json();
            setTorneos(data);
        } catch (error) {
            console.error(error);
        }
    };

    // Obtener categorías
    const obtenerCategorias = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/v1/categorias");
            const data = await response.json();
            setCategorias(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        obtenerTorneos();
        obtenerCategorias();
    }, []);

    // Crear relación
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/v1/torneo-categorias",
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
            console.log(data);
            alert("Relación creada correctamente");
        } catch (error) {
            console.error(error);
            alert("Error al crear relación");
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <h2>Asignar Categoría a Torneo</h2>
            <form onSubmit={handleSubmit}>
                {/* Torneo */}
                <div className="mb-3">
                    <label className="form-label">Torneo</label>
                    <select
                        className="form-select"
                        value={torneoId}
                        onChange={(e) => setTorneoId(e.target.value)}
                        required
                    >
                        <option value="">
                            Seleccionar torneo
                        </option>
                        {
                            torneos.map((torneo) => (
                                <option
                                    key={torneo.id}
                                    value={torneo.id}
                                >
                                    {torneo.nombre}
                                </option>
                            ))
                        }

                    </select>
                </div>

                {/* Categoría */}
                <div className="mb-3">
                    <label className="form-label">
                        Categoría
                    </label>
                    <select
                        className="form-select"
                        value={categoriaId}
                        onChange={(e) => setCategoriaId(e.target.value)}
                        required
                    >
                        <option value="">
                            Seleccionar categoría
                        </option>
                        {
                            categorias.map((categoria) => (
                                <option
                                    key={categoria.id}
                                    value={categoria.id}
                                >
                                    {categoria.nombre}
                                </option>
                            ))
                        }
                    </select>
                </div>

                {/* Arancel */}
                <div className="mb-3">
                    <label className="form-label">
                        Arancel
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        value={arancel}
                        onChange={(e) => setArancel(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-dark"
                >
                    Guardar
                </button>
            </form>
        </div>
    );
};

export default AdminTorneoCategorias;