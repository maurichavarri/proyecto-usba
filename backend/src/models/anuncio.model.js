import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const alias = "Anuncio";

const cols = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
    },
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM(
            'activo',
            'inactivo'
        ),
        defaultValue: 'activo'
    }
};

const config = {
    tableName: 'anuncio',
    timestamps: true
};

const Anuncio = sequelize.define(alias, cols, config);

export default Anuncio;