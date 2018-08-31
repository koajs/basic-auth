# koa-basic-auth [![Build Status](https://travis-ci.org/koajs/basic-auth.png)](https://travis-ci.org/koajs/basic-auth)

  Add simple "blanket" basic auth with username / password. If you require
  anything more specific just use the [basic-auth](https://github.com/visionmedia/node-basic-auth) module.

  **v4.x+ Breaking Change:** This package no longer requires both a username and a password.  Either or is supported, see [#39](https://github.com/jshttp/basic-auth/issues/39) for more insight.

## Installation

```js
$ npm install koa-basic-auth
```

## Example

  Password protect downstream middleware:

```js
const auth = require('koa-basic-auth');
const Koa = require('koa');
const app = new Koa();

// custom 401 handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.set('WWW-Authenticate', 'Basic');
      ctx.body = 'cant haz that';
    } else {
      throw err;
    }
  }
});

// require auth
app.use(auth({ name: 'tj', pass: 'tobi' }));

// secret response
app.use(async (ctx) => {
  ctx.body = 'secret';
});

app.listen(3000, function () {
  console.log('listening on port 3000');
});
```

  Example request:

    $ curl -H "Authorization: basic dGo6dG9iaQ==" http://localhost:3000/ -i
    HTTP/1.1 200 OK
    X-Powered-By: koa
    Content-Type: text/plain; charset=utf-8
    Content-Length: 6
    Date: Sat, 30 Nov 2013 19:35:17 GMT
    Connection: keep-alive

    secret

 Using the [mount](https://github.com/koajs/mount) middleware you may specify auth for a given prefix:

```js
const mount = require('koa-mount');
const auth = require('koa-basic-auth');

app.use(mount('/admin', auth({ name: 'tobi', pass: 'ferret' })));
```

## License

  MIT
