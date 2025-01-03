// src/middlewares/error-middleware.js
import status from 'http-status';
import pkg from 'joi';
const { ValidationError } = pkg;
import ResponseError from '../errors/errors.js';

const errorMiddleware = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ResponseError) {
    const statusCode = err.statusCode || status.INTERNAL_SERVER_ERROR; 
    const responseJSON = {
      status: `${statusCode} ${status[statusCode]}`,
      message: err.message || 'An error occurred',
    };

   
    if (typeof statusCode !== 'number' || statusCode < 100 || statusCode > 599) {
      console.error('Invalid status code:', statusCode);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        status: `${status.INTERNAL_SERVER_ERROR} ${status[status.INTERNAL_SERVER_ERROR]}`,
        message: 'Internal Server Error',
      }).end();
    } else {
      res.status(statusCode).json(responseJSON).end();
    }
  } else if (err instanceof ValidationError) {
    res
      .status(status.BAD_REQUEST)
      .json({
        status: `${status.BAD_REQUEST} ${status[status.BAD_REQUEST]}`,
        message: err.message,
      })
      .end();
  } else {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({
        status: `${status.INTERNAL_SERVER_ERROR} ${status[status.INTERNAL_SERVER_ERROR]}`,
        message: err.message || 'An internal server error occurred',
      })
      .end();
  }
};

export default errorMiddleware;
