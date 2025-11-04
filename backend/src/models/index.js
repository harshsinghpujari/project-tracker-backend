import sequelize from "../config/dbConnection.js";
import User from "./user.model.js";
import Project from "./project.model.js";
import Task from "./task.model.js";
import TimeLog from "./timeLog.model.js";

//User(manager) and project(one to many relation)
User.hasMany(Project, {foreignKey: 'manager_id'});
Project.belongsTo(User, { as: "manager",  foreignKey: "manager_id"});

//User(employee) and Task (one to many relation)
User.hasMany(Task, {foreignKey: "assigned_to"})
Task.belongsTo(User, {as: "employee", foreignKey: "assigned_to"});

//project and Task (one to many relation)
Project.hasMany(Task,{foreignKey:"project_id"})
Task.belongsTo(Project,{foreignKey: "project_id"})

//Task and Timelog(one to many relation)
Task.hasMany(TimeLog, {foreignKey: "task_id"})
TimeLog.belongsTo(Task, {foreignKey: "task_id"})

//User and Timelog(one to many relation)
User.hasMany(TimeLog, { foreignKey: "user_id" });
TimeLog.belongsTo(User, { foreignKey: "user_id" });

export {sequelize, User, Project, Task, TimeLog};