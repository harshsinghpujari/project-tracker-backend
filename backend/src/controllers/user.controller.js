import { User } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { formatUser } from "../utils/formatUser.js";
  
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

      // const safeUser = user.get({plain: true})
      // delete safeUser.password;

      const safeUser = formatUser(user);

      res.status(201).json(
        {
        user: safeUser,
        message:"user created succesfully",
        });
    } catch (error) {
      res.status(400).json({error: error.message});
    }
  }

  const loginUser = async(req, res) => {
    try {
      const {email, password} = req.body;
      
      if(!email || !password){
        return res.status(400).json({
          message: "invalid credentials"
        })
      }

      const user = await User.findOne({
        where: {
          email: email
        }
      });

      if(!user){
        return res.status(400).json({
          message: "User not exists"
        })
      }

      const auth = await bcrypt.compare(password, user.password);

      if(!auth) {
        return res.status(401).json({
          message: "Invalid Credentials"
        })
      }

      const token = jwt.sign({id: user.id, role:user.role},process.env.SECRET_KEY, {expiresIn: '1h'})

      // const safeUser = user.get({plain: true})
      // delete safeUser.password;

      const safeUser = formatUser(user)

      return res.status(200).json({
        token, user: safeUser,message: "User logged in succesfully"
      })

    } catch (error) {
      res.status(500).json({message: "Error while logging in the user"})
    }
  }

  export {createUser, loginUser};




