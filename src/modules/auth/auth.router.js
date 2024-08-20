import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/appError.js";
import { login, signup, verifyAccount } from "./auth.controller.js";
import { loginVal } from "./auth.validation.js";
const authRouter = Router()

// sign up
authRouter.post('/signup', asyncHandler(signup))
// verify account
authRouter.get('/verify', asyncHandler(verifyAccount))

// login 
authRouter.post('/login', isValid(loginVal), asyncHandler(login))
export default authRouter