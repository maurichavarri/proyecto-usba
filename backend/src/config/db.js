import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME, // usba
    process.env.DB_USER, // root
    process.env.DB_PASS, // password
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, // Poner true si querés ver SQL en consola
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