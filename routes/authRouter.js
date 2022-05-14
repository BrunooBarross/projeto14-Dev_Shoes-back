import { Router } from "express";
import { postLogin } from ".././controllers/authController.js"

const authRouter = Router();

authRouter.post('/login', postLogin);

export default authRouter;