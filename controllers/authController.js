import {v4} from "uuid";
import bcrypt from "bcrypt"
import db from "../db.js"

export async function postLogin(req, res) {
    const login = req.body;
    const { email, senha } = login;
    try {
        const usuario = await db.collection("usuarios").findOne({ email: email });
        if (usuario && bcrypt.compareSync(senha, usuario.senha)) {
            const token = v4();

            await db.collection("sessoes").insertOne({
                usuarioID: usuario._id,
                token
            })

            res.status(200).send({ nome: usuario.nome, token, foto: usuario.foto });
        } else {
            return res.status(401).send("Email e/ou senha inválidos!");
        }

    } catch (err) {
        return res.status(500).send("Erro ao se comunicar com o banco de dados ", err);
    }
};