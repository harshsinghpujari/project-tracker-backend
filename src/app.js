import express from "express"
import { router as userRoutes } from "./routes/user.routes.js";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running succesfully!");
})

app.use("/api/users",userRoutes)

export default app;



