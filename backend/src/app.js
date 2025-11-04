import express from "express"
import cors from 'cors'
import { router as userRoutes } from "./routes/user.routes.js";
import { router as projectRoutes } from "./routes/project.routes.js";
import {router as taskRoutes} from "./routes/task.routes.js";
import {router as timeLogRoutes} from "./routes/timeLog.routes.js"
import { router as reportRoutes } from "./routes/report.routes.js";

const app = express();
app.use(cors({
  origin: 'http://localhost:5174', 
  credentials: true                 
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running succesfully!");
})

app.get("/api/health", (req, res) => {
  res.json({ message: "API is working" });
});


app.use("/api/users",userRoutes);

app.use("/api/projects",projectRoutes);

app.use("/api/tasks",taskRoutes);

app.use("/api/timelogs", timeLogRoutes);

app.use("/api/reports", reportRoutes);

export default app;



