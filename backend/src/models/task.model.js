import { DataTypes } from "sequelize";
import sequelize from "../config/dbConnection.js";

const Task = sequelize.define(
  'Task',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      references: {
        model:"Users",
        key:"id",
      },
      allowNull: false,
    },
    project_id: {
      type: DataTypes.INTEGER,
      references:{
        model:"Projects",
        key:"id",
      },
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM("Pending", "In Progress", "completed"),
      defaultValue: "Pending",
    },
    priority: {
      type: DataTypes.ENUM("Low", "Medium", "High"),
      defaultValue: "Medium"
    },
    progress_percentage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }

  });

export default Task