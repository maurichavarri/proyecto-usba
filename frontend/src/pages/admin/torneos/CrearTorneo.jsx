import TorneoForm from "../../../components/TorneoForm";

const CrearTorneo = () => {
    const handleCreate = async (formData) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/v1/torneos/crear",
                {
                    method: "POST",
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
                message:"Error al crear torneo"
            };
        }
    };

    return (
        <TorneoForm
            titulo="Crear Torneo"
            textoBoton="Crear torneo"
            initialData={null}
            onSubmit={handleCreate}
        />
    );
};

export default CrearTorneo;