// src/app.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './config/db.js';

// Importar rutas
import equipoRoutes from './routes/equipo.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rutas
app.use('/api/v1/delegado/equipos', equipoRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API USBA funcionando' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📡 API disponible en http://localhost:${PORT}/api/v1`);
});

// Probar conexión a la base de datos
try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente');
} catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
}