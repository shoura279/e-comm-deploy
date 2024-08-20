import joi from 'joi'
import { couponTypes } from '../../utils/constant/enums.js'

export const createCouponVal = joi.object({
    code: joi.string().required(),
    discount: joi.number().positive(),
    couponType: joi.string().valid(...Object.values(couponTypes)).required(),
    fromDate: joi.date().greater(Date.now() - (24 * 60 * 60 * 1000)).required(),
    toDate: joi.date().greater(joi.ref('fromDate'))
})