import { disconnect, model, Schema } from "mongoose";
import { paymentMethods } from "../../src/utils/constant/enums.js";

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: { type: Number, default: 1 },
            price: Number,// 1000
            name: String,
            finalPrice: Number,// 4000
            discount: Number// 50%
        }
    ],
    address: {
        phone: String,
        street: String,
    },
    paymentMethod: {
        type: String,
        enum: Object.values(paymentMethods),
        default: paymentMethods.CASH
    },
    status: {
        type: String,
        enum: ['placed', 'delivered', 'canceled', 'refunded',],
        default: 'placed'
    },
    coupon: {
        couponId: { type: Schema.Types.ObjectId, ref: "Coupon" },
        code: String,
        discount: Number
    },
    orderPrice: Number,
    finalPrice: Number
}, { timestamps: true })

export const Order = model('Order', orderSchema)