import joi from "joi";

export async function validarCadastro(req, res, next) {
    const novousuario = req.body;

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

    const { error } = usuarioSchema.validate(novousuario);

    if (error) {
        return res.status(422).send(error.details);
    }

    next();
}