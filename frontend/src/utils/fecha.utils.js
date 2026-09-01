export const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
};

export const obtenerFechaActual = () => {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
};

export const inscripcionesAbiertas = (fechaCierre) => {
    if (!fechaCierre) return false;
    return obtenerFechaActual() <= fechaCierre;
};