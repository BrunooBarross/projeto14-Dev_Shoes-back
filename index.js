import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import joi from "joi";
import dotenv from "dotenv";
import db from "./db.js"

dotenv.config();
const app = express();
app.use(cors());
app.use(json());

const usuarioSchema = joi.object({
    nome: joi.string().required(),
    email: joi.string().email().required(),
    foto: joi.string().regex(/(https:\/\/)([^\s(["<,>/]*)(\/)[^\s[",><]*(.png|.jpg)(\?[^\s[",><]*)?/),
    senha: joi.string().required(),
    confirmarSenha: joi.ref('senha'),
    cep: joi.number().integer().required(),
    estado: joi.string().required(),
    bairro: joi.string().required(),
    logradouro: joi.string().required(),
    cidade: joi.string().required(),
    numero: joi.number().integer(),
});

app.post('/cadastro', async(req, res)=>{
    const novousuario = req.body;
    const {email} = novousuario;
    
    const {error} = usuarioSchema.validate(novousuario);
    if (error){
        return res.status(422).send(error.details);
    }
    try{
        const emailExiste = await db.collection("usuarios").findOne({email: email});
        if (emailExiste){
            return res.status(409).send("Erro! O email já está cadastrado!");
        }
        delete novousuario.confirmarSenha;
        await db.collection("usuarios").insertOne(novousuario);
        return res.sendStatus(201);
    } catch (err){
        return res.status(500).send("Erro ao se comunicar com o banco de dados" + err);
    }
});

const port = process.env.PORT || 5000;
app.listen(port, console.log(chalk.bold.blue(` Servidor rodando na porta ${port}`)));