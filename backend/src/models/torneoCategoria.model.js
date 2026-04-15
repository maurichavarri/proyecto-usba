import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const alias = "TorneoCategoria"

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

const TorneoCategoria = sequelize.define(alias, cols, config);

export default TorneoCategoria;