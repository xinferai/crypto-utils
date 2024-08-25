'use strict';

const config = require('./config');

let utils;

if (typeof window !== 'undefined' && !!window.crypto && !!window.crypto.subtle) {
    utils = require('./browser-utils');
} else {
    utils = require('./node-utils');
}

function setPassphrase(s) {
    config.passphrase = s;
}

function getPassphrase() {
    return config.passphrase;
}

module.exports = { 
    setPassphrase, 
    getPassphrase, 
    encryptString: utils.encryptString, 
    decryptString: utils.decryptString 
};