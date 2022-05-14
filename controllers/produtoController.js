import db from "../db.js"
import { ObjectId } from "mongodb";

export async function getProdutos(req, res) {
    try {
        const produtos = await db.collection("produtos").find({}).toArray();
        res.status(200).send([...produtos]);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        mongoClient.close();
    }
}
export async function getProdutosId(req, res) {
    const id = req.params.id;
    try {
        const produto = await db.collection("produtos").findOne({ _id: ObjectId(id) });
        if (!produto) { ressendStatus(404); return; }
        res.status(200).send(produto);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        mongoClient.close();
    }
}