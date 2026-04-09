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
    fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fecha_fin: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}

const config = {
    tableName: 'torneo',
    timestamps: false
}

const Torneo = sequelize.define('Torneo', cols, config);

export default Torneo;