'use strict';

const {
  log,
  setLogLevel
} = require('./lib/logger');
const {
  BaseError,
  InternalError,
  UnknownError
} = require('./lib/error');
const config = require('./lib/config');

/**
 * instance state
 */
const instanceProps = {};

/**
 * sets lambda instance level info. this is state
 * that should not be persisted across invocations
 */
const setInstanceProps = (props) => {
  let _props = props || {};
  Object.assign(instanceProps, {
    callback: _props.callback,
    event: _props.event,
    context: _props.context,
    sourceRequestId: _props.sourceRequestId,
    instanceRequestId: _props.instanceRequestId
  });
};

/**
 * clear instance level props
 */
const clearInstanceProps = () => {
  Object.assign(instanceProps, {
    callback: undefined,
    event: undefined,
    context: undefined,
    sourceRequestId: undefined,
    instanceRequestId: undefined
  });
};

/**
 * get instance props
 */
const getInstanceProps = () => {
  return instanceProps;
};

/**
 * get request ids for log objects
 */
const getRequestIds = () => {
  return Object.assign(
    {},
    instanceProps.sourceRequestId ?
    { sourceRequestId: instanceProps.sourceRequestId } : {},
    instanceProps.instanceRequestId?
    { instanceRequestId: instanceProps.instanceRequestId } : {}
  );
};

/**
 * Log caught error
 *
 * @param {object} error instance of BaseError
 */
const logError = (error) => {
  let err;
  if (error instanceof BaseError) {
    err = error;
  } else {
    err = new UnknownError({
      originalErrorName: error.name,
      originalErrorMessage: error.message
    });
  }
  let loggedObject = Object.assign({}, getRequestIds(), {
    errorMessage: err.message,
    detail: err.logDetail,
    event: instanceProps.event
  });
  log.error(err.name, loggedObject);
};

/**
 * Log info
 *
 * @param {string} msg the message
 * @param {object} [detail={}] detail object (optional)
 */
const logInfo = (msg, detail = {}) => {
  let loggedObject = Object.assign({}, getRequestIds(), {
    detail: detail
  });
  log.info(msg, loggedObject);
};

/**
 * Log debug
 *
 * @param {string} msg the message
 * @param {object} [detail={}] detail object (optional)
 */
const logDebug = (msg, detail = {}) => {
  let loggedObject = Object.assign({}, getRequestIds(), {
    detail: detail,
    event: instanceProps.event
  });
  log.debug(msg, loggedObject);
};

/**
 * cache of persistent values
 */
const persistentProps = {};

/**
 * set environment prefix (e.g. build env)
 */
const initConfig = (opts) => {
  Object.assign(persistentProps, {
    prefix: opts.prefix || '',
    maxAge: opts.maxAge,
    props: {}
  });
};

/**
 * fetch a value from config
 */
const getConfig = async (path) => {
  const fullPath = `${persistentProps.prefix}${path}`;
  const prop = persistentProps.props[fullPath];

  // prop is fresh and in cache
  if (prop !== undefined && !prop.param.isExpired()) {
    return prop.value;
  }

  // prop exists but is expired
  let result;
  if (prop !== undefined && prop.param.isExpired()) {
    try {
      result = await prop.param.value;
    } catch (err) {
      throw new InternalError({
        errorMessage: 'failed to fetch expired config'
      });
    }
    prop.value = result;
    return prop.value;
  }

  // fetch prop for the first time
  let param;
  try {
    param = config.ssmParameter(Object.assign({ name: fullPath },
      persistentProps.maxAge ? { maxAge: persistentProps.maxAge } : {}
    ));
    result = await param.value;
  } catch (err) {
    throw new InternalError({
      errorMessage: 'failed to fetch new config'
    });
  }
  persistentProps.props[fullPath] = {
    value: result,
    param
  };
  return persistentProps.props[fullPath].value;
};

module.exports = {
  log: {
    setLogLevel,   
    info: logInfo,
    error: logError,
    debug: logDebug
  },
  error: {
    BaseError,
    InternalError,
    UnknownError
  },
  config: {
    init: initConfig,
    get: getConfig
  },
  clearInstanceProps,
  setInstanceProps,
  getInstanceProps
};
