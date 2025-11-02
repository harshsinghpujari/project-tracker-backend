import express from "express"
import { router as userRoutes } from "./routes/user.routes.js";
import { router as projectRoutes } from "./routes/project.routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running succesfully!");
})

app.use("/api/users",userRoutes);

app.use("/api",projectRoutes);

export default app;



