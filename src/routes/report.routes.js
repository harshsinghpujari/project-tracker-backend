import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getReports } from "../controllers/report.controller.js";

export const router = express.Router();

router.get("/", verifyToken, getReports);

