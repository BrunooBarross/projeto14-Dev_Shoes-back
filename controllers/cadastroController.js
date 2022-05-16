import bcrypt from "bcrypt"
import db from "../db.js"

export async function postCadastro(req, res) {
    const novousuario = req.body;
    const {email, senha} = novousuario;
    
    try{
        const emailExiste = await db.collection("usuarios").findOne({email: email});
        if (emailExiste){
            return res.status(409).send("Erro! O email já está cadastrado!");
        }
        delete novousuario.confirmarSenha;
        const senhaCripto = bcrypt.hashSync(senha, 10);
        novousuario.senha = senhaCripto;
        await db.collection("usuarios").insertOne(novousuario);
        return res.sendStatus(201); 
    } catch (err){
        return res.status(500).send("Erro ao se comunicar com o banco de dados" + err);
    }
};