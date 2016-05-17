
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

  describe('with invalid credentials as object', () => {
    it('should `throw` 401', done => {
      const app = new Koa();

      app.use(basicAuth({ name: 'user', pass: 'pass' }));

      request(app.listen())
      .get('/')
      .auth('foo', 'bar')
      .expect(401)
      .end(done);
    })
  })

  describe('with valid credentials as object', () => {
    it('should call the next middleware', done => {
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
  })
  
  describe('with invalid credentials as array', () => {
    it('should `throw` 401', done => {
      const app = new Koa();

      app.use(basicAuth([{ name: 'user', pass: 'pass' }, { name: 'user_next', pass: 'pass_next' }]));

      request(app.listen())
      .get('/')
      .auth('foo', 'bar')
      .expect(401)
      .end(done);
    })
  })

  describe('with valid credentials as array', () => {
    it('should call the next middleware', done => {
      const app = new Koa();

      app.use(basicAuth([{ name: 'user', pass: 'pass' }, { name: 'user_next', pass: 'pass_next' }]));
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
