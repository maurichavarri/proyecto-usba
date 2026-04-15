import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const alias = "Usuario"

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
    }
}

const config = {
    tableName: 'arbitro',
    timestamps: false
}

const Arbitro = sequelize.define(alias, cols, config);

export default Arbitro;