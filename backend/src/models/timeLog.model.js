import { DataTypes } from "sequelize";
import sequelize from "../config/dbConnection.js";

const TimeLog = sequelize.define(
  'TimeLog',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    task_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Tasks",
        key: "id",
      },
      allowNull: false,
    },
    user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "id",
    },
    allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    hours_spent: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    
  });

export default TimeLog