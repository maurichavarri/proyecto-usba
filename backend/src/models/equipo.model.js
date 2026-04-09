import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const cols = {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    descripcion: DataTypes.TEXT
}

const config = {
    tableName: 'equipo',
    timestamps: false
}

const Equipo = sequelize.define('Equipo', cols, config);

export default Equipo;