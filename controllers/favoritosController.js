import db from "../db.js"

export async function postFavorito(req, res) {
    const { temUsuario } = res.locals;
    const idProduto = req.params.id;
    try{  
        await db.collection("favoritos").insertOne({usuarioID: temUsuario._id, idProduto});
        return res.send(201);
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function deleteFavorito(req, res) {
    try {
        await db.collection("favoritos").deleteOne({ _id: ObjectId(id) });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}