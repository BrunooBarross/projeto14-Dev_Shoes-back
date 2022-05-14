import db from "../db.js"

export async function postCheckout(req, res) {
    const { temUsuario } = res.locals;
    try {   
        await db.collection("compras").insertOne({ idUsuario: temUsuario._id, ...req.body });
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        mongoClient.close();
    }
}