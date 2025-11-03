import express from "express"
import {
  createTask, 
  getAllTasks, 
  updateTask, 
  deleteTask} 
  from '../controllers/task.controller.js'
import { verifyToken } from "../middlewares/authMiddleware.js"
import { authorizeRole } from "../middlewares/roleMiddleware.js"

const router = express.Router();

router.post('/',verifyToken, authorizeRole, createTask);
router.get('/',verifyToken, authorizeRole, getAllTasks)
router.put('/:id',verifyToken, authorizeRole, updateTask);
router.delete('/:id', verifyToken, authorizeRole, deleteTask)


export default router;