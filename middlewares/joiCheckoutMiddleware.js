import chalk from "chalk";
import joi from "joi";

export async function joiCheckout(req, res, next) {
    const dadosBody = joi.object({
        compra: joi.array().items(joi.object({
            produtoID: joi.string().required(),
            titulo: joi.string().required(),
            tamanho: joi.string().required(),
            valor: joi.string().required(),
            foto: joi.string().required(),
            quantidade: joi.number().required(),
        })).required(),
    })
    const validacao = dadosBody.validate(req.body, { abortEarly: false });

    if (validacao.error) {
        console.log(chalk.bold.red("dados incompletos"), validacao.error.details)
        res.sendStatus(422);
        return;
    }
    next();
}