import express from 'express';
import cors from 'cors'; // Permite conexión con el front (React).
import morgan from 'morgan'; // Sirve para registrar las solicitudes HTTP que recibe tu servidor.
import dotenv from 'dotenv'; // Sirve para cargar variables de entorno desde un archivo .env

import routes from './routes/index.js';

dotenv.config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json()); // Permite recibir JSON
app.use(morgan('dev'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API USBA funcionando' });
});

// Rutas principales
app.use('/api/v1', routes);

// Manejo de rutas inexistentes
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: 'Error interno del servidor'
  });
});

export default app;