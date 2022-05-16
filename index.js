import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js"
import cadastroRouter from "./routes/cadastroRouter.js"
import produtoRouter from "./routes/produtoRouter.js"
import checkoutRouter from "./routes/checkoutRouter.js"
import perfilRouter from "./routes/perfilRouter.js"
import favoritosRouter from "./routes/favoritosRouter.js"

dotenv.config();
const app = express();
app.use(cors());
app.use(json());

app.use(produtoRouter);
app.use(cadastroRouter);
app.use(authRouter);
app.use(checkoutRouter);
app.use(perfilRouter);
app.use(favoritosRouter);


const port = process.env.PORT || 5000;
app.listen(port, console.log(chalk.bold.blue(` Servidor rodando na porta ${port}`)));