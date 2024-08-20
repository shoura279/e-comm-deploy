import slugify from "slugify";
import { Brand } from "../../../db/models/brand.model.js";
import { Product } from "../../../db/models/product.model.js";
import { Subcategory } from "../../../db/models/subcategory.model.js";
import { AppError } from "../../utils/appError.js";
import cloudinary from "../../utils/cloudianry.js";
import { messages } from "../../utils/constant/messages.js";

// add product
export const addProduct = async (req, res, next) => {
  //get data from req
  const {
    name,
    description,
    category,
    subcategory,
    brand,
    price,
    discount,
    colors,
    size,
    stock,
  } = req.body;
  // check existence
  const brandExist = await Brand.findById(brand); // {},null
  if (!brandExist) {
    return next(new AppError(messages.brand.notFound, 404));
  }
  const subCategoryExist = await Subcategory.findById(subcategory);
  if (!subCategoryExist) {
    return next(new AppError(messages.subcategory.notFound, 404));
  }
  // uploads
  // req.files >>> {mainImage:[{}],subImages:[{},{}]}
  let failImages = [];
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.mainImage[0].path,
    { folder: "sat-tue/product/mainImages" }
  );
  failImages.push(public_id);
  let mainImage = { secure_url, public_id };
  const subImages = [];
  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: "sat-tue/product/subImages" }
    );
    subImages.push({ secure_url, public_id });
    failImages.push(public_id);
  }
  // add to db
  const product = new Product({
    name,
    slug: slugify(name),
    description,
    category,
    subcategory,
    brand,
    price,
    discount,
    colors: JSON.parse(colors),
    size: JSON.parse(size),
    stock,
    mainImage,
    subImages,
    createdBy: req.authUser._id,
    updatedBy: req.authUser._id,
  });
  const createdProduct = await product.save();
  if (!createdProduct) {
    // rollback
    req.failImages = failImages;
    return next(new AppError(messages.product.failToCreate, 500));
  }
  // send response
  return res.status(201).json({
    message: messages.product.createdSuccessfully,
    success: true,
    data: createdProduct,
  });
};
// pagination✅ sort ✅ select ✅ filter
export const getAllProducts = async (req, res, next) => {

  // const apiFeature = new ApiFeature(Product.find(), req.query).pagination().sort().select().filter()
  // const products = await apiFeature.mongooseQuery
  // return res.status(200).json({ success: true, data: products, metaData: apiFeature.queryDate.metaData })




  let { page, size, sort, select, ...filter } = req.query
  // console.log(req.query);

  // filter = JSON.parse(JSON.stringify(filter).replace(/gte|gt|lt|lte/g, match => `$${match}`))
  // console.log(filter);

  // // const excludedFields = ['page', 'size', 'sort', 'select']
  // // const filter = { ...req.query }
  // // excludedFields.forEach((ele) => {
  // //   delete filter[ele]
  // // })
  // // http://localhost:3000/product?price[$gte]=1000
  // // // price: 1000
  // // // price :{$gte:1000}
  // /**
  //  * page  skip 
  //  *  1     0
  //  *  2     5
  //  *  3     10
  //  */
  // if (!page || page <= 0) {
  //   page = 1
  // }
  // if (!size || size <= 0) {
  //   size = 3
  // }
  // size = parseInt(size)
  // page = parseInt(page)// 1.6 >> 1
  // const skip = (page - 1) * size
  // sort = sort?.replaceAll(',', ' ')
  // select = select?.replaceAll(',', ' ')
  const mongooseQuery = Product.find(filter, {}, {})
  // // mongooseQuery.limit(size).skip(skip)
  // mongooseQuery.sort(sort).select(select)
  const products = await mongooseQuery
  for (const product of products) {
    delete product.finalPrice
  }
  return res.status(200).json({ success: true, data: products, metaData: { page, size, nextPage: page + 1 } })
}
