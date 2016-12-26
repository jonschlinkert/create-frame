'use strict';

require('mocha');
var assert = require('assert');
var hbs = require('handlebars');
var createFrame = require('./');

describe('createFrame', function () {
  it('should create a reference to _parent:', function () {
    var obj = createFrame({});
    assert(obj.hasOwnProperty('_parent'));
  });

  it('should expose a non-enumerable `extend` method:', function () {
    var obj = createFrame({});
    assert.equal(typeof obj.extend, 'function');
  });

  it('should extend the frame object with the `extend` method:', function () {
    var obj = createFrame({});
    obj.extend({a: 'aaa'});
    obj.extend({b: 'bbb'});
    assert(obj.hasOwnProperty('a'));
    assert(obj.hasOwnProperty('b'));
  });

  it('should extend the frame object with additional objects:', function () {
    var obj = createFrame({}, {a: 'aaa'}, {b: 'bbb'});
    assert(obj.hasOwnProperty('a'));
    assert(obj.hasOwnProperty('b'));
  });

  it('should work with sparse arguments:', function () {
    var obj = createFrame({}, undefined, {b: 'bbb'});
    assert(obj.hasOwnProperty('b'));
  });

  it('should add private variables when passed to `options.fn()`:', function () {
    var tmpl = '{{#foo}}{{@a}}{{@b}}{{/foo}}';

    hbs.registerHelper('foo', function (context) {
      var frame = createFrame(context.data);
      frame.extend({a: 'aaa'});
      frame.extend({b: 'bbb'});
      return context.fn(context, {data: frame});
    });
    var fn = hbs.compile(tmpl);
    assert.equal(fn({}), 'aaabbb');
  });

  it('should create private variables from options hash properties', function () {
    var tmpl = '{{#foo options target=xxx}}{{@a}}{{@b}}{{log}}{{@target.yyy}}{{/foo}}';
    var context = {
      options: {data: {eee: 'fff'} },
      xxx: {yyy: 'zzz'}
    };
    hbs.registerHelper('foo', function (context, options) {
      var frame = createFrame(context.data);
      frame.extend({a: 'aaa'});
      frame.extend({b: 'bbb'});
      frame.extend(options.hash);
      return options.fn(context, {data: frame});
    });

    var fn = hbs.compile(tmpl);
    assert.equal(fn(context), 'aaabbbzzz');
  });

  it('should throw an error if args are invalid:', function () {
    assert.throws(function () {
      createFrame();
    }, /createFrame expects data to be an object/);
  });
});
