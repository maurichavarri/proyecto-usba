const verifyRole = (...rolesPermitidos) => {
    return (req, res, next) => {
        // Usuario viene de verifyToken
        const { rol } = req.usuario;

        // Verificar rol
        if (!rolesPermitidos.includes(rol)) {
            return res.status(403).json({
                message: 'No autorizado'
            });
        }
        next();
    };
};

export default verifyRole;