import slugify from "slugify"
import { Brand } from "../../../db/models/brand.model.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import cloudinary from "../../utils/cloudianry.js"

// create brand
export const createBrand = async (req, res, next) => {
    // get data from req
    let { name } = req.body
    name = name.toLowerCase()
    // check image
    if (!req.file) {
        return next(new AppError(messages.file.required, 400))
    }
    // check existence
    const brandExist = await Brand.findOne({ name })// {} ,null
    if (brandExist) {
        return next(new AppError(messages.brand.alreadyExist, 409))
    }
    // prepare date
    const slug = slugify(name)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: "sat-tue/brand"
    })
    const brand = new Brand({
        name,
        slug,
        logo: { secure_url, public_id },
        createdBy: req.authUser._id
    })
    // add to db
    const createdBrand = await brand.save()// {}, null
    if (!createdBrand) {
        // rollback 
        return next(new AppError(messages.brand.failToCreate, 500))
    }
    // send response
    return res.status(201).json({
        message: messages.brand.createdSuccessfully,
        success: true,
        data: createdBrand
    })
}

// update brand
export const updateBrand = async (req, res, next) => {
    // get data from req
    let { name } = req.body
    name = name.toLowerCase()
    const { brandId } = req.params
    // check brand exist
    const brandExist = await Brand.findById(brandId)// {},null
    if (!brandExist) {
        return next(new AppError(messages.brand.notFound, 404))
    }
    // check name existence
    if (name) {
        const nameExist = await Brand.findOne({ name, _id: { $ne: brandId } })
        if (nameExist) {
            return next(new AppError(messages.brand.alreadyExist, 409))
        }
        brandExist.name = name
        brandExist.slug = slugify(name)
    }
    // check logo
    if (req.file) {
        // remove old image
        // await cloudinary.uploader.destroy(brandExist.logo.public_id)
        // upload new image
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            // folder: "sat-tue/brand",
            public_id: brandExist.logo.public_id
        })
        brandExist.logo = { secure_url, public_id }
    }
    // update to db
    const updatedBrand = await brandExist.save()
    if (!updatedBrand) {
        // rollback 
        return next(new AppError(messages.brand.failToUpdate, 500))
    }
    // send response
    return res.status(200).json({
        message: messages.brand.updateSuccessfully,
        success: true,
        data: updatedBrand
    })
}
