import { Router } from "express";
import { getUserById, getUsers } from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', authMiddleware, getUserById);

export default userRouter;