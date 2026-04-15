import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const alias = "Categoria" 

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
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('activo', 'inactivo'),
        defaultValue: 'activo'
    }
}

const config = {
    tableName: 'categoria',
    timestamps: false
}

const Categoria = sequelize.define(alias, cols, config);

export default Categoria;