import { Schema, model } from "mongoose";
import { roles, status } from "../../src/utils/constant/enums.js";

// schema
const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true,// '    hambozo   '
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true// hambozo@gmail.com >> Ha
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: Object.values(roles),
        default: roles.USER
    },
    status: {
        type: String,
        enum: Object.values(status),
        default: status.PENDING
    },
    active: {
        type: Boolean,
        default: false
    },
    DOB: Date,
    image: {
        secure_url: { type: String, default: 'https://res.cloudinary.com/dhzbjnhmw/image/upload/v1723560440/sat-tue/gpnno1rwtd7eiobxkkmq_vmorfr.jpg' },
        public_id: { type: String, default: "sat-tue/gpnno1rwtd7eiobxkkmq_vmorfr" }
    },
    wishlist: [{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }

    ]
}, { timestamps: true })
// model
export const User = model('User', userSchema)