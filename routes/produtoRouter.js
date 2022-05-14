import { Router } from "express";
import { getProdutos, getProdutosId } from "../controllers/produtoController.js"

const produtoRouter = Router();

produtoRouter.get('/produtos', getProdutos);
produtoRouter.get('/produtos/:id', getProdutosId);

export default produtoRouter;