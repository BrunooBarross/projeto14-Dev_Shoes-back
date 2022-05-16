import db from "./../db.js";
import { ObjectId } from "mongodb";

export async function validarToken(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '').trim();
    if (!token) return res.sendStatus(401);

    try {
        const temToken = await db.collection('sessoes').findOne({ token: token });
        if (!temToken) { res.sendStatus(404); return; }
        const temUsuario = await db.collection("usuarios").findOne({ _id: ObjectId(temToken.usuarioID) });
        if (!temUsuario) { res.sendStatus(404); return; }
        res.locals.temToken = temToken;
        res.locals.temUsuario = temUsuario;
        res.locals.token = token;
        next();
    } catch (error) {
        console.log("token", error);
        res.sendStatus(500);
    }
}