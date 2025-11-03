import  TimeLog  from "../models/timeLog.model.js";
import  Task  from "../models/task.model.js";
import Project from '../models/project.model.js'
import  User  from "../models/user.model.js";
import { Op } from "sequelize";

export const getReports = async (req, res) => {
  try {
 
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Only managers can view reports" });
    }

    const managerId = req.user.id;


    const projects = await Project.findAll({
      where: { manager_id: managerId },
      include: {
        model: Task,
        include: {
          model: TimeLog,
          include: { model: User, attributes: ["id", "username", "email"] }
        }
      }
    });

   
    const report = projects.map((project) => ({
      projectId: project.id,
      projectName: project.name,
      totalHours: project.Tasks.reduce(
        (sum, t) =>
          sum +
          t.TimeLogs.reduce((innerSum, log) => innerSum + log.hours_spent, 0),
        0
      ),
      tasks: project.Tasks.map((t) => ({
        taskId: t.id,
        taskName: t.title,
        totalHours: t.TimeLogs.reduce(
          (sum, log) => sum + log.hours_spent,
          0
        ),
      })),
    }));

    res.status(200).json({ report });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error generating report",
      error: error.message,
    });
  }
};


