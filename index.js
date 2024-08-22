// import modules
import express from "express";
import { connectDB } from "./db/connection.js";
import * as allRouters from "./src/index.js";
import { globalErrorHandling } from "./src/utils/appError.js";
import dotenv from 'dotenv'
import path from 'path'
import { webhook } from "./src/utils/webhook.js";
// create server
dotenv.config({ path: path.resolve('./config/.env') })
const app = express();
const port = process.env.PORT || 3000;
// connect to db
connectDB();
// parse req
app.post('/webhook',
  express.raw({ type: 'application/json' }),
  webhook
);
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
