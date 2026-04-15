import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const alias = "Partido"

const cols = {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    puntaje_local: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    puntaje_visitante: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'jugado', 'suspendido'),
        defaultValue: 'pendiente',
        allowNull: false
    }
}

const config = {
    tableName: 'partido',
    timestamps: false
}

const Partido = sequelize.define(alias, cols, config);

export default Partido;