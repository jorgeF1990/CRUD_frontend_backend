//distinguir metodos y enpoints
//designarle un controlador
import { Router } from "express";
import { login, register } from "../controllers/authControllers.js";

const authRouter = Router();
//api/auth/register/login
authRouter.post("/register",register )
authRouter.post("/login",login) 

export {authRouter};