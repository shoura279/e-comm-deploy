import { deleteCloud, deleteFile } from "./file-functions.js";
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// asyncHandler
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      return next(new AppError(err.message, err.statusCode));
    });
  };
};

// globalErrorHandling
export const globalErrorHandling = async (err, req, res, next) => {
  if (req.file) {
    // deleteFile(req.file.path)
    deleteCloud(req.file.path);
  }
  if (req.failImages) {
    for (const public_id of failImages) {
      await deleteCloud(public_id);
    }
  }
  return res.status(err.statusCode || 500).json({
    message: err.message,
    stack: err.stack,
    success: false,
  });
};
