
'use strict';

const request = require('supertest');
const assert = require('assert');
const basicAuth = require('..');
const Koa = require('koa');

describe('Koa Basic Auth', () => {
  describe('setup', () => {
    it('should throw an error when called with no name', () => {
      assert.throws(() => {
        basicAuth({ pass: 'pass' });
      });
    })

    it('should throw an error when called with no pass', () => {
      assert.throws(() => {
        basicAuth({ name: 'user' });
      });
    })
  })

  describe('with no credentials', () => {
    it('should `throw` 401', done => {
      const app = new Koa();

      app.use(basicAuth({ name: 'user', pass: 'pass' }));

      request(app.listen())
      .get('/')
      .expect(401)
      .end(done);
    })
  })

  describe('with invalid credentials', () => {
    it('should `throw` 401 validate throu object', done => {
      const app = new Koa();

      app.use(basicAuth({ name: 'user', pass: 'pass' }));

      request(app.listen())
      .get('/')
      .auth('foo', 'bar')
      .expect(401)
      .end(done);
    })
    
    it('should `throw` 401 validate throu async function', done => {
      const app = new Koa();
      
      const validation = function(user) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(user && user.name === 'user' && user.pass === 'pass');
          }, 300);
        });  
      };
      
      app.use(basicAuth(validation));

      request(app.listen())
      .get('/')
      .auth('foo', 'bar')
      .expect(401)
      .end(done);
    })
  })

  describe('with valid credentials', () => {
    it('should call the next middleware with credentials', done => {
      const app = new Koa();

      app.use(basicAuth({ name: 'user', pass: 'pass' }));
      app.use(ctx => {
        ctx.body = 'Protected';
      })

      request(app.listen())
      .get('/')
      .auth('user', 'pass')
      .expect(200)
      .expect('Protected')
      .end(done);
    })
    
    it('should call the next middleware with async validation function', done => {
      const app = new Koa();
      
      const validation = function(user) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(user && user.name === 'user' && user.pass === 'pass');
          }, 300);
        });  
      };

      app.use(basicAuth(validation));
      app.use(ctx => {
        ctx.body = 'Protected';
      })

      request(app.listen())
      .get('/')
      .auth('user', 'pass')
      .expect(200)
      .expect('Protected')
      .end(done);
    })
  })
  
})
