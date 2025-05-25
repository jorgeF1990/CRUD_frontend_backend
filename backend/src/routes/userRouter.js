import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getUser } from "../controllers/userControllers.js";

const userRouter = Router()

userRouter.get("/profile", authMiddleware, getUser )


export {userRouter}