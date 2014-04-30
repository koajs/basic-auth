# koa-basic-auth [![Build Status](https://travis-ci.org/koajs/basic-auth.png)](https://travis-ci.org/koajs/basic-auth)

  Add simple "blanket" basic auth with username / password. If you require
  anything more specific just use the [basic-auth](https://github.com/visionmedia/node-basic-auth) module.

## Installation

```js
$ npm install koa-basic-auth
```

## Example

  Password protect downstream middleware:

```js
var auth = require('koa-basic-auth');
var koa = require('koa');
var app = koa();

// custom 401 handling

app.use(function *(next){
  try {
    yield next;
  } catch (err) {
    if (401 == err.status) {
      this.status = 401;
      this.set('WWW-Authenticate', 'Basic');
      this.body = 'cant haz that';
    } else {
      throw err;
    }
  }
});

// require auth

app.use(auth({ name: 'tj', pass: 'tobi' }));

// secret response

app.use(function *(){
  this.body = 'secret';
});

app.listen(3000);
console.log('listening on port 3000');
```

  Example request:

```
$ curl -H "Authorization: basic dGo6dG9iaQ==" http://localhost:3000/ -i
HTTP/1.1 200 OK
X-Powered-By: koa
Content-Type: text/plain; charset=utf-8
Content-Length: 6
Date: Sat, 30 Nov 2013 19:35:17 GMT
Connection: keep-alive

secret
```

 Using the [mount](https://github.com/koajs/mount) middleware you may specify auth for a given prefix:

```js
var mount = require('koa-mount');
var auth = require('koa-basic-auth');

app.use(mount('/admin', auth({ name: 'tobi', pass: 'ferret' })));
```

## License

  MIT
