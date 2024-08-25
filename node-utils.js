'use strict';

const { randomBytes, createCipheriv, createDecipheriv, createHash } = require('crypto');

const config = require('./config');

module.exports = {
    encryptString,
    decryptString,
};

async function generateKey() {
    if (config.cryptoKey) {
        return config.cryptoKey;
    }
    const hash = createHash('sha256').update(Buffer.from(config.passphrase)).digest();
    config.cryptoKey = hash;
    return hash;
}

async function encryptString(str) {
    const iv = randomBytes(12);
    const key = await generateKey();

    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(str, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    const combined = Buffer.concat([iv, encrypted, authTag]);

    return combined.toString('base64');
}

async function decryptString(encryptedStr) {
    const encryptedBytes = Buffer.from(encryptedStr, 'base64');
    const iv = encryptedBytes.subarray(0, 12);
    const authTag = encryptedBytes.subarray(encryptedBytes.length - 16);
    const encryptedContent = encryptedBytes.subarray(12, encryptedBytes.length - 16);

    const key = await generateKey();

    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encryptedContent), decipher.final()]);

    return decrypted.toString('utf8');
}

