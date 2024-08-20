import { Router } from "express";
import { fileUpload } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import { addSubcategoryVal } from "./subcategory.validation.js";
import { asyncHandler } from "../../utils/appError.js";
import { addSubcategory, getSubcategory } from "./subcategory.controller.js";
import categoryRouter from "../category/category.router.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { cloudUpload } from "../../utils/multer-cloud.js";
const subcategoryRouter = Router();

// subcategoryRouter.use("/:categoryId", categoryRouter);
// add subcategory 
subcategoryRouter.post(
  "/",
  isAuthenticated(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  // fileUpload({ folder: "subcategory" }).single("image"),
  cloudUpload({}).single('image'),
  isValid(addSubcategoryVal),
  asyncHandler(addSubcategory)
);

// get subcategory
subcategoryRouter.get('/:categoryId', asyncHandler(getSubcategory))
export default subcategoryRouter;
