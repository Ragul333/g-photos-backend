class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode || 500;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  const globalErrorHandler = (err, req, res, next) => {
    // Set defaults
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    // Log only in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('ERROR ', err);
    }
  
    // Return structured error response
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message || 'Something went wrong!',
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
  };
  
  module.exports = globalErrorHandler;
  module.exports.AppError = AppError;
  