import slugify from "slugify";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import { deleteFile } from "../../utils/file-functions.js";
// import { Subcategory } from "../../../db/models/subcategory.model.js";
// import { Category } from "../../../db/models/category.model.js";
// import { Product } from "../../../db/models/product.model.js";
import { Category, Product, Subcategory } from "../../../db/index.js";
import cloudinary from "../../utils/cloudianry.js";

// add category
export const addCategory = async (req, res, next) => {
  // get data from req
  let { name } = req.body;
  name = name.toLowerCase();
  // check file
  if (!req.file) {
    return next(new AppError(messages.file.required, 400));
  }
  // check existence
  const categoryExist = await Category.findOne({ name }); // {},null
  if (categoryExist) {
    return next(new AppError(messages.category.alreadyExist, 409));
  }
  // prepare data
  // upload image
  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "sat-tue/category" })
  const slug = slugify(name);
  const category = new Category({
    name,
    slug,
    image: { secure_url, public_id },
    createdBy: req.authUser._id
  });
  // add to db
  const createdCategory = await category.save(); // {},null
  if (!createdCategory) {
    // todo rollback delete image
    return next(new AppError(messages.category.failToCreate, 500));
  }
  // send response
  return res.status(201).json({
    message: messages.category.createdSuccessfully,
    success: true,
    data: createdCategory,
  });
};

// update category
export const updateCategory = async (req, res, next) => {
  // get data from req
  const { name } = req.body;
  const { categoryId } = req.params;
  // check existence
  const categoryExist = await Category.findById(categoryId); // {},null
  if (!categoryExist) {
    return next(new AppError(messages.category.notFound, 404));
  }
  // check name existence
  const nameExist = await Category.findOne({ name, _id: { $ne: categoryId } }); // {}, null
  if (nameExist) {
    return next(new AppError(messages.category.alreadyExist, 409));
  }
  // prepare date
  if (name) {
    categoryExist.name = name;
    categoryExist.slug = slugify(name);
  }
  // update image
  if (req.file) {
    deleteFile(categoryExist.image.path);
    categoryExist.image.path = req.file.path;
    // categoryExist.markModified("image")
    console.log(categoryExist);
  }
  // update to db
  // const updatedCategory = await categoryExist.save()
  const updatedCategory = await Category.updateOne(
    { _id: categoryId },
    { image: { path: req.file.path } },
    { new: true }
  );
  if (!updatedCategory) {
    return next(new AppError(messages.category.failToUpdate, 500));
  }
  // send response
  return res.status(200).json({
    message: messages.category.updateSuccessfully,
    success: true,
    date: updatedCategory,
  });
};

// getCategories
export const getCategories = async (req, res, next) => {
  const categories = await Category.find().populate([
    { path: "subcategories", populate: [{ path: "category" }] },
  ]);
  // const categories = await Category.aggregate([
  //     {
  //         $lookup: {
  //             from: 'subcategories',
  //             localField: "_id",
  //             foreignField: "category",
  //             as: "subcategories"
  //         }
  //     }
  // ])

  return res.status(200).json({ success: true, data: categories });
};

export const deleteCategory = async (req, res, next) => {
  // get data from req
  const { categoryId } = req.params;
  // check existence
  const categoryExist = await Category.findByIdAndDelete(categoryId).populate([
    { path: "subcategories", select: "image" },
    { path: "products", select: "mainImage subImages" },
  ]); // {},null
  if (!categoryExist) {
    return next(new AppError(messages.category.notFound, 404));
  }
  // prepare ids
  const subcategoryIds = [];
  const productIds = [];
  const imagesPaths = []; // []
  const imagesCloud = [];
  imagesPaths.push(categoryExist.image.path); //['uploads/category/one.jpg']
  for (let i = 0; i < categoryExist.subcategories.length; i++) {
    subcategoryIds.push(categoryExist.subcategories[i]._id);
    imagesPaths.push(categoryExist.subcategories[i].image.path); //['','','','']
  }
  for (const product of categoryExist.products) {
    productIds.push(product._id);
    imagesCloud.push(product.mainImage.public_id);
    product.subImages.forEach((image) => {
      imagesCloud.push(image.public_id);
    });
  }
  // delete related subcategories
  await Subcategory.deleteMany({ _id: { $in: subcategoryIds } });
  // delete related products
  await Product.deleteMany({ _id: { $in: productIds } });
  // delete images for category subcategory
  for (const path of imagesPaths) {
    deleteFile(path);
  }
  // delete images for products
  for (const public_id of imagesCloud) {
    await cloudinary.uploader.destroy(public_id);
    // cloudinary.api.delete_resources_by_prefix()// sat-tue/category/123456123456123456123456/
    // cloudinary.api.delete_folder()//sat-tue/category/123456123456123456123456/
  }
  // response
  return res.status(200).json({
    message: messages.category.deleteSuccessfully,
    success: true,
  });
};

export const getSpecificCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId).populate([
    { path: "subcategories" },
  ]);
  return res.status(200).json({ success: true, data: category });
};
