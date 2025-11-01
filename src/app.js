import express from "express"

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running succesfully!");
})

export default app;



