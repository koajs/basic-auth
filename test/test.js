
'use strict';

const request = require('supertest');
const assert = require('assert');
const basicAuth = require('..');
const Koa = require('koa');

describe('Koa Basic Auth', () => {
  describe('setup', () => {
    it('should throw an error when called without name nor pass', () => {
      assert.throws(() => {
        basicAuth();
      });
    })
  })

  describe('with no credentials', () => {
    it('should `throw` 401', done => {
      const app = new Koa();

      app.use(basicAuth({ name: 'user', pass: 'pass' }));

      request(app.listen())
      .get('/')
      .expect('WWW-Authenticate', 'Basic realm="Secure Area"')
      .expect(401)
      .end(done);
    })
  })

  describe('with invalid credentials', () => {
    it('should `throw` 401', done => {
      const app = new Koa();

      app.use(basicAuth({ name: 'user', pass: 'pass' }));

      request(app.listen())
      .get('/')
      .auth('foo', 'bar')
      .expect('WWW-Authenticate', 'Basic realm="Secure Area"')
      .expect(401)
      .end(done);
    })
  })

  describe('with custom realm message', () => {
    it('should use this in `WWW-Authenticate` header', done => {
      const app = new Koa();

      app.use(basicAuth({ name: 'user', pass: 'pass', realm: 'custom "message"' }));

      request(app.listen())
        .get('/')
        .expect('WWW-Authenticate', 'Basic realm="custom \\"message\\""')
        .end(done);
    })
  })

  describe('with valid credentials', () => {
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
})
