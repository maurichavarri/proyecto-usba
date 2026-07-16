import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const alias = "Partido";

const cols = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    torneo_categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    inscripcion_local_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    inscripcion_visitante_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sede_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    arbitro_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    jornada: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    puntaje_local: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    puntaje_visitante: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'jugado', 'suspendido'),
        defaultValue: 'pendiente',
        allowNull: false
    },
    fase: {
        type: DataTypes.ENUM(
            'regular',
            'cuartos',
            'semifinal',
            'final'
        ),
        allowNull: false,
        defaultValue: 'regular'
    },
};

const config = {
    tableName: 'partido',
    timestamps: true
};

const Partido = sequelize.define(alias, cols, config);

export default Partido;