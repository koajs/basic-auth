
# koa-basic-auth

  `Context#auth` getter for koa for parsing basic auth.

## Installation

```js
$ npm install koa-basic-auth
```

## Example

```js
var koa = require('koa');
var app = koa();

app.context(require('koa-basic-auth'));

app.use(function(){
  return function *(){
    if (this.auth) {
      this.body = 'logged in as ' + this.auth.user + ' ' + this.auth.pass;
    } else {
      this.body = 'forbidden';
    }
  }
});

app.listen(3000);
console.log('listening on port 3000');
```

## License

  MIT