import express from "express"
import {
  createTimeLog, 
  getAllTimelog, 
  updateTimeLog, 
  deleteTimeLog
} from "../controllers/timeLog.controller.js"

import { verifyToken } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, authorizeRole, createTimeLog);

router.get("/", verifyToken, authorizeRole, getAllTimelog);

router.put("/:id", verifyToken, authorizeRole, updateTimeLog);

router.delete("/:id", verifyToken, authorizeRole, deleteTimeLog);

export default router;