'use strict';

if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    module.exports = require('./browser');
} else {
    module.exports = require('./node');
}