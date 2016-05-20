
'use strict';

/**
 * Module dependencies.
 */

const auth = require('basic-auth');
const assert = require('assert');

/**
 * Return basic auth middleware with
 * the given options:
 * 
 * object: {name: 'username', pass: 'secret'}
 *  - `name` username
 *  - `pass` password
 * 
 * or
 * synchronous function return boolean
 * or 
 * asynchronous function return promise with boolean
 *
 * @param {Object|function} opts
 * @return {GeneratorFunction}
 * @api public
 */

module.exports = function(validation) {
  let credentials;
  validation = validation || {};

  if (typeof validation !== 'function') {
    assert(validation.name, 'basic auth .name required');
    assert(validation.pass, 'basic auth .pass required');
    
    credentials = validation;
    
    validation = function(user) {
      if (user && user.name === credentials.name && user.pass === credentials.pass) {
        return true;
      }
      
      return false;
    }
  }

  return function basicAuth(ctx, next) {
    return Promise.resolve(validation(auth(ctx))).then((userStatus) => {
      if (userStatus === true) {
        return next();
      } else {
        ctx.throw(401);
      }
    });
  }  
};
