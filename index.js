'use strict';

let utils;

if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    utils = require('./browser-utils');
} else {
    utils = require('./node-utils');
}

module.exports = { 
    setPassphrase: utils.setPassphrase, 
    getPassphrase: utils.getPassphrase, 
    encryptString: utils.encryptString, 
    decryptString: utils.decryptString 
};