'use strict';

var lazy = require('lazy-cache')(require);

lazy('extend-shallow', 'extend');
lazy('define-property', 'define');

module.exports = lazy;
