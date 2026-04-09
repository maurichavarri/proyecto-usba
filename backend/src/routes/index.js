import { Router } from 'express';
//import torneoRoutes from './torneo.routes.js';

const router = Router();

//router.use('/torneos', torneoRoutes);
router.get('/torneos', (req,res)=>{
    res.send("Hola")
});

export default router;