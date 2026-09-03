import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const alias = "Jugador";

const cols = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  dni: {
    type: DataTypes.STRING(8),
    allowNull: false,
  },
  dorsal: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  sexo: {
    type: DataTypes.ENUM("masculino", "femenino"),
    allowNull: false,
  },
  // Disponibilidad deportiva
  estado: {
    type: DataTypes.ENUM("activo", "inactivo"),
    defaultValue: "activo",
    allowNull: false,
  },
  // Indica si actualmente pertenece al plantel
  en_plantel: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  // Indica que este jugador es el delegado
  // propietario del equipo
  es_delegado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  // Solo tendrá valor para el jugador que
  // representa a un usuario delegado
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
};

const config = {
  tableName: "jugador",
  timestamps: false,
};

const Jugador = sequelize.define(alias, cols, config);

export default Jugador;