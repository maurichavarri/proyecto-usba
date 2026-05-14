export const getToken = () => {
    return localStorage.getItem("token");
};

export const getUsuario = () => {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
};