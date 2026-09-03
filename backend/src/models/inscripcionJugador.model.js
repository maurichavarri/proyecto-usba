import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const InscripcionJugador = sequelize.define(
  "InscripcionJugador",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    inscripcion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    jugador_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

    es_delegado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "inscripcion_jugador",
    timestamps: false,

    indexes: [
      {
        unique: true,
        fields: ["inscripcion_id", "jugador_id"],
      },
    ],
  },
);

export default InscripcionJugador;