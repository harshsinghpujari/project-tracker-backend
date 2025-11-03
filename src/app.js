import express from "express"
import { router as userRoutes } from "./routes/user.routes.js";
import { router as projectRoutes } from "./routes/project.routes.js";
import {router as taskRoutes} from "./routes/task.routes.js";
import {router as timeLogRoutes} from "./routes/timeLog.routes.js"

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running succesfully!");
})

app.use("/api/users",userRoutes);

app.use("/api/projects",projectRoutes);

app.use("/api/tasks",taskRoutes);

app.use("/api/timelogs", timeLogRoutes)

export default app;



