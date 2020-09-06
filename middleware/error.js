const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  const { stack, message, statusCode, name } = err;

  let error = {...err};
  error.message = err.message;

  // Mongoose bad ObjectId
  if(name === 'CastError') {
    const message = `Bootcamp with id ${err.value} not found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if(err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400)
  }

  // Mongoose validation error 
  if(err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(({message}) => message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server error'
  });
};

module.exports = errorHandler;