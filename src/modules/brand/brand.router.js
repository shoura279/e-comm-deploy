import { Router } from "express";
import { cloudUpload } from "../../utils/multer-cloud.js";
import { isValid } from "../../middleware/validation.js";
import { createBrandVal, updateBrandVal } from "./brand.validation.js";
import { asyncHandler } from "../../utils/appError.js";
import { createBrand, updateBrand } from "./brand.controller.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
const brandRouter = Router()

// create brand
brandRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    cloudUpload({}).single('logo'),
    isValid(createBrandVal),
    asyncHandler(createBrand)
)

brandRouter.put('/:brandId',
    isAuthenticated(),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    cloudUpload({}).single('logo'),
    isValid(updateBrandVal),
    asyncHandler(updateBrand)
)
export default brandRouter