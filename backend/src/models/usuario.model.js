import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const alias = "Usuario"

const cols = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    correo: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
    },
    contraseña: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    rol: {
        type: DataTypes.ENUM('admin', 'delegado', 'arbitro'),
        allowNull: false
    }
} 

const config = {
    tableName: 'usuario',
    timestamps: false
}

const Usuario = sequelize.define(alias, cols, config);

export default Usuario;