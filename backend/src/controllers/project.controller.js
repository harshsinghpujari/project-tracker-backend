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

    // if(req.user.role === "admin"){
    //   projects = await Project.findAll();
    // }

    if (req.user.role === "manager") {
      projects = await Project.findAll({
        where: {manager_id: req.user.id},
        order: [["createdAt", "DESC"]],
      });
    }
    else if(req.user.role === "employee")
    {
      projects = [];
      return res.status(200).json({
      count: 0,
      projects,
      message: "No assigned projects yet for employee"
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

const updateProject = async(req, res) => {
try {
  
    const project = await Project.findByPk(req.params.id);
  
    if(!project) {
      return res.status(404).json({
        message: "Project not found"
      })
    }
  
    if(project.manager_id !== req.user.id)
    {
      return res.status(403).json({
        message: "Access denied: Unauthorized access"
      });
    }
  
    const {title, description, start_date, end_date, status} = req.body;
  
    if(!title && !description && !start_date && !end_date && !status){
      return res.status(400).json({
        message: "No fields provided for update"
      })
    }
  
    const updatedProject = await project.update({
      title: title,
      description: description,
      start_date: start_date,
      end_date: end_date,
      status: status
    });
  
    const safeProject = updatedProject.get({plain: true})
  
    return res.status(200).json({
      project: safeProject,
      message: "Project updated successfully"
    })
  
} catch (error) {
  return res.status(500).json({
    message: "Something went wrong while updating project"
  })
}
}

const getProjectById = async(req, res) => {
  try {
    const {id} = req.params;
    const project = await Project.findByPk(id);

    if (!project)
    {
      return res.status(404).json({
        message: "Project not found"
      })
    }
    if (project.manager_id !== req.user.id) {
       
      return res.status(403).json({
        message: "Access denied: Unauthorized access"
      });
    }

    const safeProject = project.get ({plain: true})

    return res.status(200).json({
      project: safeProject,
      message: "Project fetched successfully"
    })

  } catch (error) {
      console.error("Error fetching project:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching project",
      error: error.message
    });
  }
}

const deleteProject  = async(req, res) => {
  try {
    const {id} = req.params;

    const project = await Project.findByPk(id)

    if(!project) {
      return res.status(404).json({
        message: "Project not found"
      })
    }

    if(req.user.id !== project.manager_id){
      return res.status(403).json({
        message: "unauthorized access"
      })
    }
    await project.destroy();

    return res.status(200).json({
      message: `Project "${project.title}" deleted succesfully`
    })

  
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while deleting project"
    })
  }
}
export {getAllProject, createProject, updateProject, getProjectById, deleteProject}