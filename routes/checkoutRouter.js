import { Router } from "express";
import { postCheckout } from "../controllers/checkoutController.js"
import { validarToken } from "./../middlewares/tokenMiddleware.js"
import { joiCheckout } from "../middlewares/joiCheckoutMiddleware.js";

const checkoutRouter = Router();

checkoutRouter.post('/checkout', validarToken, joiCheckout, postCheckout);

export default checkoutRouter;