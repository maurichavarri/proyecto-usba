import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const alias = "Sancion";

const cols = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    jugador_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    partido_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    falta: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM(
            'tecnica',
            'antideportiva',
            'descalificante',
            'expulsion',
            'otra'
        ),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fechas_suspension: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    fechas_cumplidas: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    estado: {
        type: DataTypes.ENUM(
            'activa',
            'cumplida'
        ),
        allowNull: false,
        defaultValue: 'activa'
    }
};

const config = {
    tableName: 'sancion',
    timestamps: false
};

const Sancion = sequelize.define(alias, cols, config);

export default Sancion;