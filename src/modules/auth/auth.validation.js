import joi from "joi";
// import { generalFields } from "../../middleware/validation";

// login validation
export const loginVal = joi.object({
    email: joi.string().email().when('phone', {
        is: joi.exist(),
        then: joi.optional(),
        otherwise: joi.required()
    }),
    phone: joi.string(),
    password: joi.string()
})