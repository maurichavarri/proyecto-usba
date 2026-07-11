import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Bienvenida = sequelize.define('Bienvenida', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING(150),
        allowNull: false,
        defaultValue: 'Bienvenido a la USBA'
    },
    texto: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    imagen: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'bienvenida',
    timestamps: true
});

export default Bienvenida;