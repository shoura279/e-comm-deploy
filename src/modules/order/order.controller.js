import Stripe from "stripe"
import { Cart, Coupon, Order, Product } from "../../../db/index.js"
import { AppError } from "../../utils/appError.js"
import { couponTypes } from "../../utils/constant/enums.js"
import { messages } from "../../utils/constant/messages.js"

export const createOrder = async (req, res, next) => {
    // get data from req
    const { phone, street, coupon, paymentMethod } = req.body

    // check coupon
    let couponExist = 0
    if (coupon) {

        couponExist = await Coupon.findOne({ code: coupon })// {},null
        console.log(couponExist);
        if (!couponExist) {
            return next(new AppError(messages.coupon.notFound, 404))
        }
    }
    // check cart
    const cart = await Cart.findOne({ user: req.authUser._id })// {} ,null
    if (!cart) {
        return next(new AppError('not have cart', 400))
    }
    const products = cart.products
    let orderPrice = 0
    let finalPrice = 0
    let orderProducts = []
    // check products
    for (const product of products) {
        const productExist = await Product.findById(product.productId)// {}, null
        if (!productExist) {
            return next(new AppError(messages.product.notFound, 404))
        }
        if (!productExist.inStock(product.quantity)) {
            return next(new AppError('out of stock', 400))
        }
        orderPrice += productExist.finalPrice * product.quantity
        orderProducts.push({
            productId: productExist._id,
            price: productExist.price,
            finalPrice: productExist.finalPrice,
            quantity: product.quantity,
            discount: productExist.discount,
            name: productExist.name
        })
    }
    couponExist.couponType == couponTypes.FIXEDAMOUNT
        ? finalPrice = orderPrice - couponExist.discount
        : finalPrice = orderPrice - (orderPrice * ((couponExist.discount || 0) / 100))
    // create order
    const order = new Order({
        user: req.authUser._id,
        address: { phone, street },
        coupon: {
            couponId: couponExist._id,
            code: coupon,
            discount: couponExist.discount
        },
        paymentMethod,
        products: orderProducts,
        orderPrice,
        finalPrice
    })
    // add to db
    const createdOrder = await order.save()
    // integrate payment gateway
    if (paymentMethod == 'visa') {
        const stripe = new Stripe('sk_test_51PpaGLP829c5C7AK3uaBUMuIUEqLECKIbtbwqDVIX1LLcgYMPE2y5cuyvERhjKYdHs5eJgEnGp5UNn6IcLB5Ku9B00tygmYZpK')
        const checkout = await stripe.checkout.sessions.create({
            success_url: "https://www.google.com",
            cancel_url: "https://www.facebook.com",
            payment_method_types: ['card'],
            mode: 'payment',
            metadata: {
                orderId: createdOrder._id.toString()
            },
            line_items: createdOrder.products.map((product) => {
                return {
                    price_data: {
                        currency: 'egp',
                        product_data: {
                            name: product.name,
                            // image:
                        },
                        unit_amount: product.price * 100
                    },
                    quantity: product.quantity
                }
            })
        })
        return res.status(200).json({
            message: messages.order.createdSuccessfully,
            success: true,
            data: createdOrder,
            url: checkout.url
        })
    }
    return res.status(201).json({
        message: messages.order.createdSuccessfully,
        success: true,
        data: createdOrder
    })
}

