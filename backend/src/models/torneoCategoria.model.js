import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const cols = {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    arancel: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    }
}

const config = {
    tableName: 'torneo_categoria',
    timestamps: false
}

const TorneoCategoria = sequelize.define('TorneoCategoria', cols, config);

export default TorneoCategoria;