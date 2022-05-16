import { Router } from "express";
import { postFavorito, deleteFavorito } from "../controllers/favoritosController.js"
import { validarToken } from "./../middlewares/tokenMiddleware.js"

const favoritosRouter = Router();

favoritosRouter.post('/favoritos/:id', validarToken, postFavorito);
favoritosRouter.delete('/favoritos/:id', validarToken, deleteFavorito);

export default favoritosRouter;