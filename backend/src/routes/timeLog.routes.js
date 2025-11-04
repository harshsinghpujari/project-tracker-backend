import express from "express"
import {
  createTimeLog, 
  getAllTimelog, 
  updateTimeLog, 
  deleteTimeLog
} from "../controllers/timeLog.controller.js"

import { verifyToken } from "../middlewares/authMiddleware.js";

export const router = express.Router();

router.post("/", verifyToken, createTimeLog);

router.get("/", verifyToken, getAllTimelog);

router.put("/:id", verifyToken, updateTimeLog);

router.delete("/:id", verifyToken, deleteTimeLog);

