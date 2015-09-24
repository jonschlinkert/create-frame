/*!
 * create-frame <https://github.com/jonschlinkert/create-frame>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');

module.exports = function createFrame(data) {
  if (data == null || typeof data !== 'object') {
    throw new TypeError('createFrame expects data to be an object');
  }
  var frame = utils.extend({}, data);
  frame._parent = data;

  utils.define(frame, 'extend', function (data) {
    utils.extend(this, data);
  });
  return frame;
};
