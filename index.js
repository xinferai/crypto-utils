'use strict';

const CryptoUtils = require('./base');

let instance;

if (typeof window !== 'undefined' && !!window.document) {
    const BrowserUtils = require('./browser-utils');
    instance = new BrowserUtils();
}   else {
    const NodeUtils = require('./node-utils');
    instance = new NodeUtils();
}


function setPassphrase(s) {
    CryptoUtils.passphrase = s;
}

function getPassphrase() {
    return CryptoUtils.passphrase;
}

async function encryptString(str) {
    return await instance.encryptString(str);
}

async function decryptString(encryptedStr) {
    return await instance.decryptString(encryptedStr);
}

module.exports = { 
    setPassphrase, 
    getPassphrase, 
    encryptString, 
    decryptString 
};