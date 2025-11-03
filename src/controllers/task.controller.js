import Task from "../models/task.model.js"
import Project from "../models/project.model.js"
import User from "../models/user.model.js"
import { Op } from "sequelize"

const createTask = async(req, res) => {

  try {
    if(req.user.role !== "manager") {
      return res.status(401).json({
        message: "Unauthorized access"
      })
    }
  
    const {title, description, priority, due_date, assigned_to, project_id} = req.body;
  
    if(!title || !description || !priority || !due_date ||!assigned_to || !project_id){
      return res.status(400).json({
        message: "Empty fields"
      })
    }
  
    const project = await Project.findByPk(project_id);
  
    if(!project) {
      return res.status(404).json({
        message: "Project not found"
      })
    }
  
    const assigned_employee = await User.findByPk(assigned_to);
  
    if(!assigned_employee)
    {
      return res.status(404).json({
        message: "employee not found"
      })
    }
    
    if (project.manager_id !== req.user.id) {
    return res.status(403).json({ message: "You can only create tasks under your own projects" });
    }

  
  
    const task = await Task.create({
      title: title,
      description: description,
      priority: priority,
      due_date: due_date,
      project_id: project_id,
      assigned_to: assigned_to,
    })
  
    const safeTask = await task.get({plain: true});
  
    return res.status(201).json({
      task: safeTask,
      message: "Task created succesfully"
    })
  
  
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while creating task"
    })
  }

}

const getAllTasks = async(req, res) => {
  try {
    let tasks;

    const {page=1, limit=10, status, priority} = req.query;
    const offset = (page - 1) * limit;

    const filter = {};
    if(status) filter.status = status;
    if(priority) filter.priority = priority;

    if(req.user.role === "manager")
    {
      const projects = await Project.findAll({
        where: {manager_id : req.user.id},
        attributes: ["id"]
      });

      const projectIds = projects.map(project => project.id)

       tasks = await Task.findAll({
        where: {project_id : {[Op.in]: projectIds},
      ...filter,
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      });
    }
    else if (req.user.role === "employee"){
     tasks =  await Task.findAll({
        where: {assigned_to:req.user.id}
      });
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }
       return res.status(200).json({
      count: tasks.length,
      currentPage: parseInt(page),
      limit: parseInt(limit),
      tasks,
      message: "All tasks fetched successfully",
    });
  }
 catch (error) {
     return res.status(500).json({
        message: "something went wrong while fetching all tasks",
      error: error.message})
  }
}

const updateTask = async(req, res) => {
  try {
    const {id} = req.params;
    const {title, description, assigned_to, due_date, priority, status, progress_percentage} = req.body;

    const task = await Task.findByPk(id);

    if(!task) {
      return res.status(404).json({
        message: "Task not found"
      })
    }

    if(req.user.role === "manager"){
      const projects = await Project.findAll({
        where: {manager_id: req.user.id},
        attributes: ["id"]
      });
      const projectIds = projects.map(project => project.id);

      if(!projectIds.includes(task.project_id)){
        return res.status(404).json({
          message: "Unauthorized to update this task"
        });
      };

     const updatedTask = await task.update({
        title: title,
        description: description,
        assigned_to: assigned_to,
        priority: priority,
        due_date: due_date,
      })

      return res.status(200).json(
        {
          updatedTask,
          message: "Task updated successfully"
        }
      )

    }
    else if (req.user.role === "employee") {
      if(task.assigned_to !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized to update this task" });
      }
      const updatedTask = await task.update({
          status: status,
          progress_percentage: progress_percentage,
      })

      return res.status(200).json(
        {
          updatedTask,
          message: "Task updated successfully"
        }
      );
    }

  } catch (error) {
      return res.status(500).json({
    message: "Something went wrong while updating task",
    error: error.message,
  });
  }
}

const deleteTask = async(req, res) => {
try {
    const {id}  = req.params;
  
    const task = await Task.findByPk(id);
  
    if(req.user.role !=="manager") {
      return res.status(403).json({
        message: "Unauthorized access"
      })
    }
  
    const projects = await Project.findAll({
      where: {manager_id:req.user.id},
      attributes: ["id"]
    });
  
    const projectIds = projects.map(project => project.id);
  
    if(!projectIds.includes(task.project_id)){
      return res.status(404).json({
        message: "Task does not belongs to this manager"
      })
    }
  
    await task.destroy();
  
    return res.status(200).json({
      message: "Task is deleted succesfully"
    })
  
} catch (error) {
  return res.status(500).json({
    message: "Something went wrong while deleting task"
  })
}
}
export {createTask, getAllTasks, updateTask, deleteTask}