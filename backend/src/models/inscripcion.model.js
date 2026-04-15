import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const alias = "Inscripcion"

const cols = {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'confirmado', 'rechazado', 'cancelado'),
        defaultValue: 'pendiente',
        allowNull: false
    }
}

const config = {
    tableName: 'inscripcion',
    timestamps: false
}

const Inscripcion = sequelize.define(alias, cols, config);

export default Inscripcion;