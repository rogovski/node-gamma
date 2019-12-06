# gamma@0.0.1

a useful utility for serverless systems in AWS.

# Motivation

gamma is designed to be a reusable library which encapsulates much of the common boilerplate needed by lambda functions in a serverless system:

* caching ssm configuration accross function invocations
* logging to cloudwatch and configurable log levels
* a informative Error base class

# Usage

## Import It

```js
const gamma = require('node-gamma');
```

## Set Different Log Levels

```js
gamma.log.setLogLevel('debug');
gamma.log.error(new gamma.error.InternalError({ some: 'thing' }));
gamma.log.debug('some debug');
gamma.log.info('some info');
gamma.log.setLogLevel('info');
gamma.log.error(new gamma.error.InternalError({ some: 'thing' }));
gamma.log.debug('wont log');
gamma.log.info('some info');
```

## All Logged Errors are Consistent

```js
gamma.log.setLogLevel('info');
gamma.log.error(new Error('this is an error'));
```

## Set-able and Clear-able Properties

```js
gamma.setInstanceProps({
  sourceRequestId: '1234',
  instanceRequestId: '9876',
  event: { ok: 'ok' }
});
console.log(gamma.getInstanceProps());
gamma.log.info('some info');
gamma.clearInstanceProps();
```

## Ssm Params without/with Expiration

```js
const delay = (t) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, t);
  });
};
const multifetch = async () => {
  const f1 = await gamma.config.get('/secret');
  await delay(5000);
  const f2 = await gamma.config.get('/secret');
  await delay(5000);
  const f3 = await gamma.config.get('/secret');
}
Promise.resolve()
  .then(() => {
    gamma.config.init({ prefix: '/some', maxAge: 7000 });
    // fetch, cached, refetch
    return multifetch();
  })
  .then(() => {
    gamma.config.init({ prefix: '/some' });
    // fetch, cached, cached
    return multifetch();
  });
```
