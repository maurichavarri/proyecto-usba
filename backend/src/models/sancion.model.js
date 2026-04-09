import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const cols = {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    descripcion: DataTypes.TEXT,
    fecha: DataTypes.DATEONLY
}

const config = {
    tableName: 'sancion',
    timestamps: false
}

const Sancion = sequelize.define('Sancion', cols, config);

export default Sancion;