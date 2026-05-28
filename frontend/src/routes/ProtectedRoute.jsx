import { Navigate } from "react-router-dom";
import { getToken, getUsuario } from "../utils/auth";

const ProtectedRoute = ({ children, roles = [] }) => {

    const token = getToken();
    const usuario = getUsuario();

    // Sin token
    if (!token) {
        return (
            <Navigate to="/auth/ingresar" replace/>
        );
    }

    // Sin permisos
    if (
        roles.length > 0 && !roles.includes(usuario?.rol)
    ) {
        return (
            <Navigate to="/" replace/>
        );
    }

    return children;
};

export default ProtectedRoute;