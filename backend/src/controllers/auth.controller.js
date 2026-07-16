import { registerService, loginService } from '../services/auth.service.js';

export const register = async (req, res, next) => {
    try {
        const usuario = await registerService(req.body);

        res.status(201).json(usuario);

    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {

        const data = await loginService(req.body);

        res.json(data);

    } catch (error) {
        next(error);
    }
};