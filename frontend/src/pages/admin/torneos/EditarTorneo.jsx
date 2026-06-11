import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TorneoForm from "../../../components/TorneoForm";

const EditarTorneo = () => {
    const { id } = useParams();
    const [torneo, setTorneo] = useState(null);
    useEffect(() => {
        obtenerTorneo();
    }, []);

    const obtenerTorneo = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/torneos/${id}`);
            const data = await response.json();
            setTorneo(data);

        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (formData) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:3000/api/v1/torneos/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            return {
                ok: response.ok,
                message: data.message
            };

        } catch (error) {

            console.error(error);

            return {
                ok: false,
                message: "Error al actualizar torneo"
            };
        }
    };

    if (!torneo) {
        return (
            <div className="container mt-5">
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <TorneoForm
            titulo="Editar Torneo"
            textoBoton="Guardar cambios"
            initialData={torneo}
            onSubmit={handleUpdate}
        />
    );
};

export default EditarTorneo;