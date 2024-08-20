import joi from 'joi'
import { paymentMethods } from '../../utils/constant/enums.js'
import { generalFields } from '../../middleware/validation.js'
export const createOrderVal = joi.object({

    phone: joi.string(),
    street: joi.string(),

    paymentMethod: joi.string().valid(...Object.values(paymentMethods)),

    coupon: joi.string(),

})