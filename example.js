
var koa = require('koa');
var app = koa();

app.context(require('./'));

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