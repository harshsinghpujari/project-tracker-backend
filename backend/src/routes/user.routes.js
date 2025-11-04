import express from "express";
import { createUser, loginUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register',createUser);

router.post('/login', loginUser)

router.get('/profile',verifyToken, (req, res) => {
  res.status(200).json({
    message: "Authorized user",
    user:req.user,
  })
})


export {router};

