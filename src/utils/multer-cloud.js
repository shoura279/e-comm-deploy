// import modules
import fs from 'fs'
import path from 'path'
import { nanoid } from 'nanoid'
import multer, { diskStorage } from 'multer'
const fileValidation = {
    image: ['image/jpeg', 'image/png'],
    file: ['application/pdf', 'application/msword'],
    video: ['video/mp4']
}
export const cloudUpload = ({ allowFile = fileValidation.image }) => {
    const storage = diskStorage({

    })
    const fileFilter = (req, file, cb) => {
        if (allowFile.includes(file.mimetype)) {
            return cb(null, true)
        }
        return cb(new Error('invalid file format'), false)
    }
    return multer({ storage, fileFilter })
}