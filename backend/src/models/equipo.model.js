import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const alias = "Equipo";

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
    descripcion: DataTypes.TEXT,
    id_usuario_creador: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // 👇 AGREGA ESTAS LÍNEAS 👇
    creado_en: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW // Esto insertará la fecha y hora actual automáticamente
    }
};

const config = {
    tableName: 'equipo',
    timestamps: false // Mantenemos esto en false para que no cree createdAt/updatedAt
};

const Equipo = sequelize.define(alias, cols, config);

export default Equipo;