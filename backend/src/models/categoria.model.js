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
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}

const config = {
    tableName: 'categoria',
    timestamps: false
}

const Categoria = sequelize.define('Torneo', cols, config);

export default Categoria;