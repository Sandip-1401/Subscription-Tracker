import { Router } from "express";
import { signUp, signIn, signOut } from "../controller/auth.controller.js";
import { authLimiter } from "../middleware/authLimiter.middleware.js";

const authRouter = Router();

authRouter.post('/signup', authLimiter, signUp);
authRouter.post('/signin', authLimiter, signIn);
authRouter.post('/signout', signOut);

export default authRouter;