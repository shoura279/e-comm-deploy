import { Cart, Product } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";

export const addToCart = async (req, res, next) => {
    // get data from req
    const { productId, quantity } = req.body;
    // check product existence
    const productExist = await Product.findById(productId)// { } ,null
    if (!productExist) {
        return next(new AppError(messages.product.notFound, 404))
    }
    if (!productExist.inStock(quantity)) {
        return next(new AppError('out of stock'))
    }

    // check product exist in cart
    let data = 1;
    const productInCart = await Cart.findOneAndUpdate({
        user: req.authUser._id, 'products.productId': productId
    }, { $set: { 'products.$.quantity': quantity } }, { new: true }) // {} ,null
    let message = messages.cart.updateSuccessfully
    data = productInCart
    if (!productInCart) {
        const cart = await Cart.findOneAndUpdate({ user: req.authUser._id }, { $push: { products: { productId, quantity } } }, { new: true })
        message = 'product added to cart'
        data = cart
    }
    return res.status(200).json({ message, success: true, data })

}