// import modules
import express from "express";
import { connectDB } from "./db/connection.js";
import * as allRouters from "./src/index.js";
import { asyncHandler, globalErrorHandling } from "./src/utils/appError.js";
import dotenv from 'dotenv'
import path from 'path'
import { Cart, Order, Product, User } from "./db/index.js";
import Stripe from "stripe";
// create server
dotenv.config({ path: path.resolve('./config/.env') })
const app = express();
const port = process.env.PORT || 3000;
// connect to db
connectDB();
// parse req
app.post('/webhook',
  express.raw({ type: 'application/json' }),
  asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'].toString();
    const stripe = new Stripe('sk_test_51PpaGLP829c5C7AK3uaBUMuIUEqLECKIbtbwqDVIX1LLcgYMPE2y5cuyvERhjKYdHs5eJgEnGp5UNn6IcLB5Ku9B00tygmYZpK')
    let event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_e72fa9c2231c951259b2a7f9f2a2da8b2490627802ba47934339301e2067b3d8');

    if (event.type == 'checkout.session.completed') {
      const checkout = event.data.object;
      const orderId = checkout.metaData.orderId;
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
  }));
app.use(express.json());
app.use("/category", allRouters.categoryRouter);
app.use("/sub-category", allRouters.subcategoryRouter);
app.use("/brand", allRouters.brandRouter);
app.use("/product", allRouters.productRouter);
app.use('/auth', allRouters.authRouter)
app.use('/review', allRouters.reviewRouter)
app.use('/wishlist', allRouters.wishlistRouter)
app.use('/cart', allRouters.cartRouter)
app.use('/coupon', allRouters.couponRouter)
app.use('/order', allRouters.orderRouter)
app.all('*', (req, res, next) => {
  return res.json({ message: "invalid url" })
})
// global error
app.use(globalErrorHandling);
// listen server
app.listen(port, () => {
  console.log("server is running on port", port);
});
