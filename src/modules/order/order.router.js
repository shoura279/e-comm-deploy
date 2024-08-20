import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { orderEndpoint } from "./order.endpoint.js";
import { isValid } from "../../middleware/validation.js";
import { createOrderVal } from "./order.validation.js";
import { asyncHandler } from "../../utils/appError.js";
import { createOrder } from "./order.controller.js";

const orderRouter = Router()

// create order
orderRouter.post('/',
    isAuthenticated(),
    isAuthorized(orderEndpoint.public),
    isValid(createOrderVal),
    asyncHandler(createOrder)
)
export default orderRouter