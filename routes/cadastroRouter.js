import { Router } from "express";
import { postCadastro } from ".././controllers/cadastroController.js"
import { validarCadastro } from "./../middlewares/cadastroUsuarioMiddleware.js"

const cadastroRouter = Router();

cadastroRouter.post('/cadastro', validarCadastro, postCadastro);

export default cadastroRouter;