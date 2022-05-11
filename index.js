import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import db from "./db.js"
import { ObjectId } from "mongodb";
import joi from "joi";

dotenv.config();
const app = express();
app.use(cors());
app.use(json());

app.get("/produtos", async (req, res) => {
    try {
        const produtos = await db.collection("produtos").find({}).toArray();
        res.status(200).send([...produtos]);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        mongoClient.close();
    }
})

app.post("/checkout", async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '').trim();
    if (!token) { return res.sendStatus(401) };

    const dadosBody = joi.object({
        compras: joi.array().items(joi.object({
            idProduto: joi.string().required(),
            quantidade: joi.string().required(),
            valorUnit: joi.string().required(),
        })).required(),
        valorTotal: joi.string().required()
    })
    const validacao = dadosBody.validate(req.body, { abortEarly: false });

    if (validacao.error) {
        console.log(chalk.bold.red("nome não pode ser vazio"), validacao.error.details)
        res.status(422).send("Use o formato: { name: João}");
        return;
    }

    try {
        const temToken = await db.collection('sessoes').findOne({ token: token });
        if (!temToken) { res.sendStatus(404); return; }
        const temUsuario = await db.collection("usuarios").findOne({ _id: ObjectId(temToken.idUsuario) });
        if (!temUsuario) { res.sendStatus(404); return; }
        await db.collection("compras").insertOne({ idUsuario: temUsuario._id, ...req.body });
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        mongoClient.close();
    }
})

const port = process.env.PORT || 5000;
app.listen(port, console.log(chalk.bold.blue(` Servidor rodando na porta ${port}`)));