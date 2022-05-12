import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import joi from "joi";
import {v4} from "uuid";
import bcrypt from "bcrypt"
import dotenv from "dotenv";
import db from "./db.js"
import { ObjectId } from "mongodb";

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

app.post('/cadastro', async (req, res)=>{
    const novousuario = req.body;
    const {email, senha} = novousuario;
    
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
        const senhaCripto = bcrypt.hashSync(senha, 10);
        novousuario.senha = senhaCripto;
        await db.collection("usuarios").insertOne(novousuario);
        return res.sendStatus(201); 
    } catch (err){
        return res.status(500).send("Erro ao se comunicar com o banco de dados" + err);
    }
});

app.post('/login', async (req,res)=>{
    const login = req.body;
    const {email, senha} = login;
    try{
        const usuario = await db.collection("usuarios").findOne({email: email});
        console.log(usuario)

        if (usuario && bcrypt.compareSync(senha, usuario.senha)){
            const token = v4();

            await db.collection("sessoes").insertOne({
                usuarioID : usuario._id,
                token
            })

            res.status(200).send({nome: usuario.nome, token});
        }else{
            return res.status(401).send("Email e/ou senha inválidos!");
        }

    }catch(err){
        return res.status(500).send("Erro ao se comunicar com o banco de dados ", err);
    }

});

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

app.post("/favoritos/:id", async (req, res)=>{
    const id = req.params.id;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '').trim();
    if (!token) return res.sendStatus(401);
    
    try{
        const sessao = await db.collection("sessoes").findOne({token});
        if (!sessao){
            return res.sendStatus(401);
        }
        const usuario = await db.collection("usuarios").findOne({
            _id: ObjectId(sessao.usuarioID)
        })
        if (!usuario){
            res.sendStatus(401);
        }

        await db.collection("favoritos").insertOne({usuarioID: usuario._id, id});
        return res.send(200);
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
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