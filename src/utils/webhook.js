import Stripe from "stripe";
import { Cart, Order, Product } from "../../db/index.js";

export const webhook = asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'].toString();
    const stripe = new Stripe('sk_test_51PpaGLP829c5C7AK3uaBUMuIUEqLECKIbtbwqDVIX1LLcgYMPE2y5cuyvERhjKYdHs5eJgEnGp5UNn6IcLB5Ku9B00tygmYZpK')
    let event = Stripe.webhooks.constructEvent(req.body, sig, 'whsec_KpOJGP7USpDiZYdGtkqHUMSgABqPz9rj');

    if (event.type == 'checkout.session.completed') {
        const checkout = event.data.object;
        const orderId = checkout.metadata.orderId;
        const orderExist = await Order.findByIdAndUpdate(orderId, { status: 'placed' }, { new: true })
        await Cart.findOneAndUpdate({ user: orderExist.user }, { products: [] }, { new: true })
        for (const product of orderExist.products) {
            await Product.findByIdAndUpdate(product.productId, { $inc: { stock: -product.quantity } })
        }
        // clear cart
        // update order status placed
        // product stock
    }


    // Return a 200 res to acknowledge receipt of the event
    res.send();
})