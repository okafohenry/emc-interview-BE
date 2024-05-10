const ErrorResponse = require('./core.errorResponse');

/**
 *
 * @param {any} err
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns
 */
const errorHandler = (err, req, res, next) => {
  let error = {
    ...err
  };
  error.message = err.message;
  if (process.env.MODE !== 'production') {
    console.log(err.name);
    // console.log(err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found Or Invalid ID String Or Invalid Datatype`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    console.log(err.errors);
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    status: 'error',
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
