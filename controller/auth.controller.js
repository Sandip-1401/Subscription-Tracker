import mongoose from "mongoose";
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

export const signUp = async (req, res, next) => {
   const session = await mongoose.startSession();
   session.startTransaction();

   try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
         const error = new Error("All fields are required");
         error.statusCode = 400;
         throw error;
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
         const error = new Error("User already exists with this email");
         error.statusCode = 400;
         throw error;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create(
         [{ name, email, password: hashedPassword }],
         { session }
      );

      const token = jwt.sign(
         { userId: user[0]._id },
         JWT_SECRET,
         { expiresIn: JWT_EXPIRES_IN }
      );

      await session.commitTransaction();

      res.status(201).json({
         success: true,
         message: "User registered successfully",
         data: {
            token,
            user: {
               _id: user[0]._id,
               name: user[0].name,
               email: user[0].email
            }
         }
      });

   } catch (error) {
      await session.abortTransaction();
      next(error);
   } finally {
      session.endSession();
   }
};


export const signIn = async (req, res, next) => {
   try {
      const { email, password } = req.body;

      if (!email || !password) {
         const error = new Error("Email and password required");
         error.statusCode = 400;
         throw error;
      }

      const user = await User.findOne({ email });

      if (!user) {
         const error = new Error("Invalid email or password");
         error.statusCode = 401;
         throw error;
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
         const error = new Error("Invalid email or password");
         error.statusCode = 401;
         throw error;
      }

      const token = jwt.sign(
         { userId: user._id },
         JWT_SECRET,
         { expiresIn: JWT_EXPIRES_IN }
      );

      res.status(200).json({
         success: true,
         message: "User signed in successfully",
         data: {
            token,
            user: {
               _id: user._id,
               name: user.name,
               email: user.email
            }
         }
      });

   } catch (error) {
      next(error);
   }
};


export const signOut = async (req, res, next) => {
   try {

      res.status(200).json({
         success: true,
         message: "User signed out successfully"
      });

   } catch (error) {
      next(error);
   }
};