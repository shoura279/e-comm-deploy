import { Coupon } from "../../../db/index.js"
import { AppError } from "../../utils/appError.js"
import { couponTypes } from "../../utils/constant/enums.js"
import { messages } from "../../utils/constant/messages.js"

// create coupon
export const createCoupon =async (req, res, next) => {
    // get data from req
    const { code, discount, couponType, fromDate, toDate } = req.body
    console.log({ fromDate, toDate});
    
    // check code existence
    const couponExist = await Coupon.findOne({ code })// {} ,null
    if (couponExist) {
        return next(new AppError(messages.coupon.alreadyExist))
    }
    // check amount
    if (couponType == couponTypes.PERCETAGE && discount > 100) {
        return next(new AppError('must between 0, 100', 400))
    }
    // create coupon
    const createdCoupon = await Coupon.create({
        code,
        discount
        , couponType
        , fromDate
        , toDate
        , createdBy: req.authUser._id
    })
    // send response
    return res.status(201).json({
        message: messages.coupon.createdSuccessfully,
        success: true,
        data: createdCoupon
    })

}