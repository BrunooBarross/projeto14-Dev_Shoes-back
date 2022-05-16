import { Router } from "express";
import { getPerfil } from "../controllers/perfilController.js"
import { validarToken } from "./../middlewares/tokenMiddleware.js"

const perfilRouter = Router();

perfilRouter.get('/perfil', validarToken, getPerfil);

export default perfilRouter;