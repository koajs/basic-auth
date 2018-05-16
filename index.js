
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
 *  - `name` username
 *  - `pass` password
 *
 * @param {Object} opts
 * @return {GeneratorFunction}
 * @api public
 */

module.exports = function(opts){
  opts = opts || {};

  assert(opts.name, 'basic auth .name required');
  assert(opts.pass, 'basic auth .pass required');

  if (!opts.realm) opts.realm = 'Secure Area';

  return function basicAuth(ctx, next) {
    const user = auth(ctx);

    if (user && user.name == opts.name && user.pass == opts.pass) {
      return next();
    } else {
      ctx.throw(401, null, { headers: {
        'WWW-Authenticate': 'Basic realm="' + opts.realm.replace(/"/g, '\\"') + '"'
      } });
    }
  };
};
