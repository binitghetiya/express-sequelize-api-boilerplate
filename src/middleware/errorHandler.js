import { errorResponse } from '../helpers';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err && err.message === 'validation error') {
    let messages = err.errors.map(e => e.field);
    if (messages.length && messages.length > 1) {
      messages = `${messages.join(', ')} are required fields`;
    } else {
      messages = `${messages.join(', ')} is required field`;
    }
    return errorResponse(req, res, messages, 400, err);
  }
};

export default errorHandler;
