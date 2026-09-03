import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const alias = "Delegado";

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
    unique: true,
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  sexo: {
    type: DataTypes.ENUM("masculino", "femenino"),
    allowNull: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
};

const config = {
  tableName: "delegado",
  timestamps: false,
};

const Delegado = sequelize.define(alias, cols, config);

export default Delegado;