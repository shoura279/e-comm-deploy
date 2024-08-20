import { User } from "../../../db/index.js"
import { messages } from "../../utils/constant/messages.js"

// add to wishlist
export const addToWishlist = async (req, res, next) => {
    // get data from req
    const { productId } = req.body
    // add product to wishlist
    const updatedUser = await User.findByIdAndUpdate(req.authUser._id, { $addToSet: { wishlist: productId } }, { new: true })
    return res.status(200).json({
        message: `${productId} added to wishlist successfully`,
        success: true,
        data: updatedUser
    })
}
// get logged user wishlist
export const getWishlist = async (req, res, next) => {
    const user = await User.findById(req.authUser._id, { wishlist: 1 }, { populate: [{ path: "wishlist" }] })
    return res.status(200).json({ data: user })
}

export const deleteFromWishlist = async (req, res, next) => {
    // get data from req
    const { productId } = req.params
    const wishlist = await User.findByIdAndUpdate(req.authUser._id, { $pull: { wishlist: productId } }, { new: true }).select('wishlist')
    return res.status(200).json({ message: 'product remove successfully', data: wishlist })
}