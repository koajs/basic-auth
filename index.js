
'use strict';

/**
 * Module dependencies.
 */

const auth = require('basic-auth');
const assert = require('assert');
const _ = require('lodash');

/**
 * Return basic auth middleware with
 * the given options:
 *
 *  - `name` username
 *  - `pass` password
 *
 * @param {Object} opts
 * @return {GeneratorFunction}
 * @api public
 */

module.exports = function(opts){
  opts = opts || {};

  if (_.isArray(opts) === false) {
    assert(opts.name, 'basic auth .name required');
    assert(opts.pass, 'basic auth .pass required');
  }

  return function basicAuth(ctx, next){
    const user = auth(ctx);
    
    if (user && 
       ((!_.isArray(opts) && user.name == opts.name && user.pass == opts.pass)
       || (_.isArray(opts) && _.some(opts, {name: user.name, pass: user.pass}))) ) {
      return next();
    } else {
      ctx.throw(401);
    }
  };
};
