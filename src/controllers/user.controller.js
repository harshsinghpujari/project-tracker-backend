import { User } from "../models/index.js";
import bcrypt from "bcryptjs";


  
  const createUser = async(req, res) => {
    try {
      const {username, email, password, role} = req.body;

      if(!username || !email || !password || !role){
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const existingUser = await User.findOne({
        where: {
          email: email
        }
      });
      if(existingUser){
        console.log("user already exists")
       return res.status(409).json({ message: "User already exists" });

      }
  
      const hashPassword = await bcrypt.hash(password,10);
  
      const user = await User.create({
        username: username,
        email: email,
        password: hashPassword,
        role: role
      });

      const safeUser = user.get({plain: true})
      delete safeUser.password;
      res.status(201).json(
        {
        user: safeUser,
        message:"user created succesfully",
        });
    } catch (error) {
      res.status(400).json({error: error.message});
    }
  }

  export {createUser};




