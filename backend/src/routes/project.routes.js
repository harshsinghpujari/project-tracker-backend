import express from 'express'
import { verifyToken} from '../middlewares/authMiddleware.js'
import { authorizeRole } from '../middlewares/roleMiddleware.js'
import {getAllProject, createProject, updateProject, getProjectById, deleteProject} from '../controllers/project.controller.js'


const router = express.Router()

router.post('/',verifyToken,authorizeRole("manager"),createProject);

router.get('/', verifyToken, getAllProject);

router.get('/:id',verifyToken, getProjectById);

router.put('/:id',verifyToken, authorizeRole("manager"),  updateProject);

router.delete('/:id',verifyToken, authorizeRole("manager"),  deleteProject);


export {router};