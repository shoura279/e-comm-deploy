import { Cart, User } from "../../../db/index.js"
import { AppError } from "../../utils/appError.js"
import { status } from "../../utils/constant/enums.js"
import { messages } from "../../utils/constant/messages.js"
import { sendEmail } from "../../utils/email.js"
import { comparePassword, hashPassword } from "../../utils/password.js"
import { generateToken, verifyToken } from "../../utils/token.js"

export const signup = async (req, res, next) => {
    // get data from req
    const { userName, phone, email, password, DOB } = req.body
    // check existence
    const userExist = await User.findOne({ $or: [{ email }, { phone }] })
    if (userExist) {
        return next(new AppError(messages.user.alreadyExist, 409))
    }
    // prepare data
    // // hash password
    const hashedPassword = hashPassword({ password })
    const user = new User({
        userName,
        email,
        phone,
        password: hashedPassword,
        DOB
    })
    // generate token
    const token = generateToken({ payload: { email } })
    // send email
    await sendEmail({
        to: email,
        subject: "verify your account",
        html: `<p>to verify your account
          click <a href='${req.protocol}://${req.headers.host}/auth/verify?token=${token}'>link</a></p>`
    })
    // add to db
    const createdUser = await user.save()
    if (!createdUser) {
        return next(new AppError(messages.user.failToCreate, 500))
    }
    return res.status(201).json({
        message: messages.user.createdSuccessfully,
        success: true,
        data: createdUser
    })
}

// verify account
export const verifyAccount = async (req, res, next) => {
    // get data from req
    const { token } = req.query
    // verify token
    console.log(token);

    const payload = verifyToken({ token })


    const user = await User.findOneAndUpdate({ email: payload.email, status: status.PENDING }, { status: status.VERIFIED }, { new: true })
    // create cart
    await Cart.create({ user: user._id, products: [] })
    return res.status(200).json({ message: messages.user.verifiedSuccessfully, success: true })
}

export const login = async (req, res, next) => {
    // get data from req
    const { email, phone, password } = req.body
    // check existence
    const userExist = await User.findOne({ $or: [{ email }, { phone }], status: status.VERIFIED })
    if (!userExist) {
        return next(new AppError('invalid credential', 401))
    }
    // check password
    const isMatch = comparePassword({ password, hashPassword: userExist.password })
    if (!isMatch) {
        return next(new AppError('invalid credential', 401))
    }
    // generate token
    const token = generateToken({ payload: { email }, secretKey: process.env.secretKeyAccessToken })
    return res.status(200).json({ message: 'welcome', success: true, accessToken: token })
}