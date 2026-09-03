import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const alias = "Categoria";

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

  descripcion: {
    type: DataTypes.TEXT,
  },

  edad_minima: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  edad_maxima: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  sexo: {
    type: DataTypes.ENUM("masculino", "femenino"),
    allowNull: false,
  },

  // =========================
  // ESTADO
  // =========================

  estado: {
    type: DataTypes.ENUM("activo", "inactivo"),
    allowNull: false,
    defaultValue: "activo",
  },
};

const config = {
  tableName: "categoria",
  timestamps: false,
};

const Categoria = sequelize.define(alias, cols, config);

export default Categoria;
