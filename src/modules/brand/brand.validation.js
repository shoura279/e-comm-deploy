import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'
// create brand
export const createBrandVal = joi.object({
    name: generalFields.name.required()
}).required()

// update brand
export const updateBrandVal = joi.object({
    name: generalFields.name,
    brandId: generalFields.objectId.required()
}).required()