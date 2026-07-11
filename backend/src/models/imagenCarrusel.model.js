import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const alias = "CarruselImagen";

const cols = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    url: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    orden: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
};

const config = {
    tableName: 'carrusel_imagen',
    timestamps: true
};

const CarruselImagen = sequelize.define(alias, cols, config);

export default CarruselImagen;