import { Router } from "express";
import { fileUpload } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import {
  addCategoryVal,
  deleteCategoryVal,
  updateCategoryVal,
} from "./category.validation.js";
import { asyncHandler } from "../../utils/appError.js";
import {
  addCategory,
  updateCategory,
  getCategories,
  deleteCategory,
  getSpecificCategory,
} from "./category.controller.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { cloudUpload } from "../../utils/multer-cloud.js";
const categoryRouter = Router({ mergeParams: true });// sub-category/categoryId/

// add category 
categoryRouter.post(
  "/",
  isAuthenticated(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  // fileUpload({ folder: "category" }).single("image"),
  cloudUpload({}).single('image'),
  isValid(addCategoryVal),
  asyncHandler(addCategory)
);

categoryRouter.get("/:categoryId", asyncHandler(getSpecificCategory));
// update category
categoryRouter.put(
  "/:categoryId",
  isAuthenticated(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  // fileUpload({ folder: "category" }).single("image"),
  cloudUpload({}).single('image'),
  isValid(updateCategoryVal),
  asyncHandler(updateCategory)
);

categoryRouter.get("/", asyncHandler(getCategories));
// delete category 
categoryRouter.delete(
  "/:categoryId",
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  isValid(deleteCategoryVal),
  asyncHandler(deleteCategory)
);

export default categoryRouter;
