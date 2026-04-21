import mongoose from "mongoose"
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

export const signUp = async (req, res, next) => {
   const session = await mongoose.startSession();
   session.startTransaction();
   try{
      
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({email});

      if(existingUser){
         const error = new Error('User already exists with this email');
         error.statusCode = 400;
         throw error;
      }

      //Hash password
      const saltRounds = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await User.create([{name, email, password: hashedPassword}], { session });

      const token = jwt.sign(
         {userId: user[0]._id},
         JWT_SECRET,
         {expiresIn: JWT_EXPIRES_IN}
      );

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
         success: true,
         message: 'User registered successfully',
         data: {
            token,
            user: user[0]
         }
      })
   } catch (error) {
      await session.abortTransaction();
      next(error);
   } finally {
      await session.endSession();
   }
}

export const signIn = async (req, res, next) => {
   try{
      const { email, password } = req.body;

      const user = await User.findOne({email});

      if(!user){
         const error = new Error('Invalid email or password');
         error.statusCode = 401;
         throw error;
      } 
      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch){
         const error = new Error('Invalid email or password');
         error.statusCode = 401;
         throw error;
      }

      const token = jwt.sign(
         {userId: user._id},
         JWT_SECRET,
         {expiresIn: JWT_EXPIRES_IN}
      );

      res.status(200).json({
         success: true,
         message: 'User signed in successfully',
         data: {
            token,
            user
         }
      });

   }catch(error){
      next(error);
   }
}
   
export const signOut = async (req, res, next) => {}