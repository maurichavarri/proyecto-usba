import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const alias = "Torneo"

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
    fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fecha_fin: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('activo', 'inactivo'),
        defaultValue: 'activo'
    }
}

const config = {
    tableName: 'torneo', 
    timestamps: false
}

const Torneo = sequelize.define(alias, cols, config);

export default Torneo;