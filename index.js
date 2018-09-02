
'use strict';

/**
 * Module dependencies.
 */

const auth = require('basic-auth');
const compare = require('tsscmp');

/**
 * Return basic auth middleware with
 * the given options:
 *
 *  - `name` username
 *  - `pass` password
 *  - `realm` realm
 *
 * @param {Object} opts
 * @return {GeneratorFunction}
 * @api public
 */

module.exports = function(opts){
  opts = opts || {};

  if (!opts.name && !opts.pass)
    throw new Error('Basic auth `name` and/or `pass` is required');

  if (!opts.realm) opts.realm = 'Secure Area';

  return function basicAuth(ctx, next) {
    const user = auth(ctx);
    if (
      !user ||
      (opts.name && !compare(opts.name, user.name)) ||
      (opts.pass && !compare(opts.pass, user.pass))
    )
      return ctx.throw(
        401,
        null,
        {
          headers: {
            'WWW-Authenticate': 'Basic realm="' + opts.realm.replace(/"/g, '\\"') + '"'
          }
        }
      );
    return next();
  };
};
