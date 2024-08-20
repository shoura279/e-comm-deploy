import { model, Schema } from "mongoose";
import { couponTypes } from "../../src/utils/constant/enums.js";

// schema
const couponSchema = new Schema({
    code: String,
    discount: Number,
    couponType: {
        type: String,
        enum: Object.values(couponTypes)['fixedAmount', 'percentage'],
        default: couponTypes.FIXEDAMOUNT
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {

        type: String,
        required: true
    },
    assignedToUser: [
        {
            userId: { type: Schema.Types.ObjectId, ref: "User" },
            maxUse: { type: Number, max: 5 },
            useCount: Number
        }
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
}, {
    timestamps: true
})
// model
export const Coupon = model('Coupon', couponSchema)