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
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    fixture_generado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    formato_competencia: {
        type: DataTypes.ENUM(
            'solo_liga',
            'playoff_4',
            'playoff_8'
        ),
        allowNull: false,
        defaultValue: 'solo_liga'
    }
}

const config = {
    tableName: 'torneo_categoria',
    timestamps: false
}

const TorneoCategoria = sequelize.define(alias, cols, config);

export default TorneoCategoria;