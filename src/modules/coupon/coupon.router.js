import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middleware/validation.js";
import { createCouponVal } from "./coupon.validation.js";
import { asyncHandler } from "../../utils/appError.js";
import { createCoupon } from "./coupon.controller.js";
const couponRouter = Router()

// create coupon
couponRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    isValid(createCouponVal),
    asyncHandler(createCoupon)
)
export default couponRouter