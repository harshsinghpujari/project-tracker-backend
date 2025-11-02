import Project from "../models/project.model.js";


const createProject = async (req, res) => {
try {
    const {title, description, start_date, end_date, status} = req.body;
  
    if(!title || !description || !start_date || !end_date || !status) {
      return res.status(400).json({
        message: "All fields are required"
      })
    }
  
    const newProject = await Project.create({
      title: title,
      description: description,
      start_date: start_date,
      end_date: end_date,
      status: status,
      manager_id: req.user.id,
    })

    const projectData = newProject.get({plain: true})
  
    return res.status(201).json({
      project:projectData,
      message: "Project created successfully"
  })

} catch (error) {
  return res.status(500).json({
    message: "something went wrong while creating project"
  })
}
}

const getAllProject = async(req, res) => {
  try {
    let projects;

    if(req.user.role === "admin"){
      projects = await Project.findAll();
    }
    else if (req.user.role === "manager") {
      projects = await Project.findAll({
        where: req.user.role === "manager" ? {manager_id: req.user.id} : undefined,
        order: [["createdAt", "DESC"]],
      });
    }
    else
    {
      return res.status(403).json({
        message: "Access denied: you are not allowed to view all projects"
      });
    }

    return res.status(200).json({
      count: projects.length,
      projects,
      message: "Projects fetched successfully"
    })
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching projects",
      error: error.message
    });
  }
}

export {getAllProject, createProject}