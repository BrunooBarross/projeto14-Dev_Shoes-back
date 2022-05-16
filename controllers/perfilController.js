import db from "../db.js"

export async function getPerfil(req, res) {
    const { temUsuario, temToken } = res.locals;

    try {
        const comprasUsuario = await db.collection("compras").find({ idUsuario: temToken.usuarioID}).toArray();
        res.status(200).send([temUsuario, {comprasUsuario: comprasUsuario}]);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}