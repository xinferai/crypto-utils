'use strict';

class CryptoUtils {

    static passphrase = typeof process !== 'undefined' && process.env?.CRYPTO_UTILS_PASSPHRASE ? 
        process.env.CRYPTO_UTILS_PASSPHRASE : 'qZ_(MvJ:<GS&x69d\']8?nsXrz)-^KB/ek>T,PcVg"Db"tN';

    static cryptoKey = null;

    str2ab(str) {
        if (typeof TextEncoder === 'undefined') {
            TextEncoder = require('util').TextEncoder;
        }
        const encoder = new TextEncoder();
        return encoder.encode(str);
    }

    ab2str(buffer) {
        if (typeof TextDecoder === 'undefined') {
            TextDecoder = require('util').TextDecoder;
        }
        const decoder = new TextDecoder();
        return decoder.decode(buffer);
    }

    async generateKey() {}

    async encryptString(str) {}

    async decryptString(encryptedStr) {}
}

module.exports = CryptoUtils
