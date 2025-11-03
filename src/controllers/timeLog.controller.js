import Task from '../models/task.model.js'
import TimeLog from '../models/timeLog.model';
import Project from '../models/project.model.js'
import { Op } from 'sequelize';

const createTimeLog = async(req, res) => {
  try {

    const {task_id, hours_spent, description} = req.body;

    if(!task_id || !hours_spent || !description)
    {
      return res.status(400).json({
        message: "empty fields"
      })
    }

    const task = await Task.findByPk(task_id)

    if(!task)
    {
      return res.status(404).json({ message: "Task not found" });
    }
 
    if(req.user.role === "employee")
    {
      if(task.assigned_to !== req.user.id)
      return res.status(403).json({
        message: "Unauthorized access: You are not assigned to this task"
      })

      const timelog = await TimeLog.create({
        task_id,
        user_id: req.user.id,
        hours_spent,
        description,
      });

      return res.status(201).json({
        timelog,
        message: "Time log created successfully"
      });
    }
     return res.status(403).json({ message: "Only employees can log time" });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while creating time log",
      error: error.message,
    });
  }
}

const getAllTimelog = async(req, res) => {
  try {
    
    if(req.user.role ===  "employee") {
      const timeLogs = await TimeLog.findAll({
        where: {user_id:req.user.id}
      });
      
      return res.status(200).json({
      count: timeLogs.length,
      timeLogs,
      message: "TimeLogs of user fetched succesfully"
      })
    }

    else if( req.user.role === "manager")
    {
      const projects = await Project.findAll({
        where: {manager_id : req.user.id},
        attributes: ["id"]
      });

      const projectIds = projects.map(project => project.id)

      const tasks = await Task.findAll({
        where: {project_id:{[Op.in]:projectIds}},
        attributes: ["id"]
      });
      const taskIds = tasks.map(task => task.id)

      const timeLogs = await TimeLog.findAll({
        where:{task_id:{[Op.in]:taskIds}}
      })

      return res.status(200).json({
        count: timeLogs.length,
        timeLogs,
        message: "All Timelogs of projects assigned to manager fetched succesfully"
      });
    }
    else{
      return res.status(403).json({ message: "Unauthorized access" });
    }

  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while fetching timelogs"
    })
  }
}

const updateTimeLog = async(req, res) => {
  try {
    
    const {id} = req.params;
    const {hours_spent, description, date} = req.body;
    const timeLog = await TimeLog.findByPk(id)

    if(!timeLog)
    {
      return res.status(403).json({
        message: "timelog not found"
      })
    }

    if(req.user.role === "employee"){
      if(timeLog.user_id !== req.user.id){
        return res.status(403).json({
          message:"Unauthorized: Employee can only update their own logs"
        })
      }

      const updatedTimeLog = await timeLog.update({
        hours_spent,
        description
      });

      return res.status(200).json({
        timeLog: updatedTimeLog,
        message: "Timelog updated successfully"
      })

    }

    else if(req.user.role === "manager"){
      const projects = await Project.findAll({
        where: {manager_id:req.user.id},
        attributes: ["id"]
      });
      const projectIds = projects.map(project => project.id);

      const tasks = await Task.findAll({
        where: {project_id: {[Op.in]:projectIds}},
        attributes: ["id"]
      });
     
      const taskIds = tasks.map(task => task.id);

      if(!taskIds.includes(timeLog.task_id)){
        return res.status(403).json({
          message: "Unauthorized access"
        })
      }

      const updatedTimeLog = await timeLog.update({
        date,
        hours_spent,
        description 
      });
      return res.status(200).json({
        timeLog: updatedTimeLog,
        message: "TimeLog updatd succesfully"
      })
    }
    else{
      return res.status(404).json({
        message: "Bad request"
      })
    }


  } catch (error) {
        return res.status(500).json({
        message: "something went wrong while updating timelog",
        error: error.message
      })
    }
}

const deleteTimeLog = async (req, res) => {
  try {
    const { id } = req.params;

    const timeLog = await TimeLog.findByPk(id);
    if (!timeLog) {
      return res.status(404).json({ message: "TimeLog not found" });
    }

    if (req.user.role === "employee") {
      if (timeLog.user_id !== req.user.id) {
        return res.status(403).json({
          message: "Unauthorized: You can delete only your own timelogs",
        });
      }

      await timeLog.destroy();
      return res.status(200).json({
        message: "TimeLog deleted successfully",
      });
    }

    if (req.user.role === "manager") {
      const projects = await Project.findAll({
        where: { manager_id: req.user.id },
        attributes: ["id"],
      });
      const projectIds = projects.map((p) => p.id);

      const tasks = await Task.findAll({
        where: { project_id: { [Op.in]: projectIds } },
        attributes: ["id"],
      });
      const taskIds = tasks.map((t) => t.id);

      if (!taskIds.includes(timeLog.task_id)) {
        return res.status(403).json({
          message: "Unauthorized: You can only delete timelogs under your projects",
        });
      }

      await timeLog.destroy();
      return res.status(200).json({
        message: "TimeLog deleted successfully",
      });
    }

    return res.status(403).json({ message: "Unauthorized access" });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while deleting timelog",
      error: error.message,
    });
  }
};

export {createTimeLog, getAllTimelog, updateTimeLog, deleteTimeLog}