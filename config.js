'use strict';

let passphrase = typeof process !== 'undefined' && process.env?.CRYPTO_UTILS_PASSPHRASE ? 
    process.env.CRYPTO_UTILS_PASSPHRASE : 'xZAfK8BTXPglW+2Hwv0F3upiIW1gHp761y0GFCQaS2qm';

let cryptoKey = null;

module.exports = {
    passphrase,
    cryptoKey
};
