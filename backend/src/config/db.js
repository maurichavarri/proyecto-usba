import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const caPath = path.join(__dirname, '../../ca.pem'); // backend/ca.pem

// Obtiene el certificado: primero del archivo local, luego de la variable DB_CA (Render)
const getCA = () => {
    if (fs.existsSync(caPath)) {
        return fs.readFileSync(caPath, 'utf8');
    }
    if (process.env.DB_CA) {
        return process.env.DB_CA.replace(/\\n/g, '\n');
    }
    return undefined;
};

const sequelize = new Sequelize(
    process.env.DB_NAME, // usba
    process.env.DB_USER, // avnadmin (en Aiven)
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT, // el puerto que muestra Aiven
        dialect: 'mysql',
        timezone: '-03:00',
        logging: false, // Poner true si querés ver SQL en consola
        dialectOptions: {
            ssl: {
                ca: getCA(),
                rejectUnauthorized: true,
            },
        },
    }
);

// Test de conexión
export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a MySQL establecida correctamente');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
};

export default sequelize;