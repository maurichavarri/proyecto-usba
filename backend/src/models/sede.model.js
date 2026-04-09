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
    direccion: {
        type: DataTypes.STRING(150),
        allowNull: false
    }
}

const config = {
    tableName: 'sede',
    timestamps: false
}

const Sede = sequelize.define('Sede', cols, config);

export default Sede;