import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const alias = "Anuncio"

const cols = {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fecha : {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}

const config = {
    tableName: 'anuncio',
    timestamps: false
}

const Anuncio = sequelize.define(alias, cols, config);

export default Anuncio;