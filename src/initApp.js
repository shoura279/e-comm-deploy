import * as allRouters from "./index.js"
import { globalErrorHandling } from "./utils/appError.js";
export const bootStrap = (app, express) => {
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
}