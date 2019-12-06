'use strict';

/**
 * base error
 *
 * @class
 */
class BaseError extends Error {
  constructor (message, logDetail = undefined, responseDetail = undefined) {
    super(message);
    this.name = this.constructor.name;
    this.logDetail = logDetail;
    this.responseDetail = responseDetail;
    // Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * general internal error
 *
 * @class
 */
class InternalError extends BaseError {
  constructor (logDetail, responseDetail) {
    super('Internal Error', logDetail, responseDetail);
  }
}

/**
 * general unknown error
 *
 * @class
 */
class UnknownError extends BaseError {
  constructor (logDetail, responseDetail) {
    super('Unknown Error', logDetail, responseDetail);
  }
}

module.exports = {
  BaseError,
  InternalError,
  UnknownError
};
