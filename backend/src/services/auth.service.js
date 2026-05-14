import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.model.js';

export const registerService = async (data) => {

    const { correo, contraseña } = data;

    // Validaciones
    if (!correo || !contraseña) {
        const error = new Error('Correo y contraseña son obligatorios');
        error.status = 400;
        throw error;
    }

    // Verificar existencia
    const existe = await Usuario.findOne({
        where: { correo }
    });

    if (existe) {
        const error = new Error('El correo ya está registrado');
        error.status = 400;
        throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear usuario
    const usuario = await Usuario.create({
        correo,
        contraseña: hashedPassword,
        rol: 'delegado'
    });

    return {
        id: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol
    };
};

export const loginService = async (data) => {

    const { correo, contraseña } = data;

    // Validaciones
    if (!correo || !contraseña) {
        const error = new Error('Correo y contraseña son obligatorios');
        error.status = 400;
        throw error;
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({
        where: { correo }
    });

    if (!usuario) {
        const error = new Error('Credenciales inválidas');
        error.status = 401;
        throw error;
    }

    // Comparar password
    const passwordValida = await bcrypt.compare(
        contraseña,
        usuario.contraseña
    );

    if (!passwordValida) {
        const error = new Error('Credenciales inválidas');
        error.status = 401;
        throw error;
    }

    // Generar JWT
    const token = jwt.sign(
        {
            id: usuario.id,
            rol: usuario.rol
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '7d'
        }
    );

    // Respuesta
    return {
        usuario: {
            id: usuario.id,
            correo: usuario.correo,
            rol: usuario.rol
        },
        token
    };
};