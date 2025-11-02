import express from 'express'
import { verifyToken} from '../middlewares/authMiddleware.js'
import { authorizeRole } from '../middlewares/roleMiddleware.js'
import {getAllProject, createProject, updateProject, getProjectById, deleteProject} from '../controllers/project.controller.js'


const router = express.Router()

router.post('/projects',verifyToken,authorizeRole("manager"),createProject);

router.get('/projects', verifyToken, getAllProject);

router.get('/projects/:id',verifyToken, getProjectById);

router.put('/projects/:id',verifyToken, authorizeRole("manager"),  updateProject);

router.delete('/projects/:id',verifyToken, authorizeRole("manager"),  deleteProject);


export {router};