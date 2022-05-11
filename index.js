import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import db from "./db.js"
import { ObjectId } from "mongodb";

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

app.delete("/favoritos/:id", async (req, res) => {
    const id = req.params.id;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '').trim();
    if (!token) { return res.sendStatus(401) };

    try {
        const temToken = await db.collection('sessoes').findOne({ token: token });
        if (!temToken) { res.sendStatus(404); return; }
        await db.collection("favoritos").deleteOne({ _id: ObjectId(id) });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        mongoClient.close();
    }
})

const port = process.env.PORT || 5000;
app.listen(port, console.log(chalk.bold.blue(` Servidor rodando na porta ${port}`)));