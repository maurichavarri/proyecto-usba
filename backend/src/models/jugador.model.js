import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const cols = {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    dni: {
        type: DataTypes.STRING(8),
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('activo', 'inactivo'),
        defaultValue: 'activo',
        allowNull: false
    }
}

const config = {
    tableName: 'jugador',
    timestamps: false
}

const Jugador = sequelize.define('Jugador', cols, config);

export default Jugador;