import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

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
                ca: process.env.DB_CA?.replace(/\\n/g, '\n'),
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