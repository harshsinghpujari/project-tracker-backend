import express from "express";
import {
  createTask, 
  getAllTasks, 
  updateTask, 
  deleteTask} 
  from '../controllers/task.controller.js'
import { verifyToken } from "../middlewares/authMiddleware.js"
import { authorizeRole } from "../middlewares/roleMiddleware.js"

export const router = express.Router();

router.post('/',verifyToken, authorizeRole("manager"), createTask);
router.get('/',verifyToken, getAllTasks)
router.put('/:id',verifyToken, updateTask);
router.delete('/:id', verifyToken, authorizeRole("manager"), deleteTask);