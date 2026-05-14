import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    try {
        // Header Authorization
        const authHeader = req.headers.authorization;

        // Verificar existencia
        if (!authHeader) {
            return res.status(401).json({
                message: 'Token no proporcionado'
            });
        }

        // Formato: Bearer TOKEN
        const token = authHeader.split(' ')[1];

        // Verificar token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Guardar usuario en request
        req.usuario = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Token inválido'
        });
    }
};

export default verifyToken;