'use strict';

const NodeUtils = require('../node-utils');
const CryptoUtils = require('../base');

describe('NodeUtils Class', () => {
    let instance;

    beforeEach(() => {
        instance = new NodeUtils();
        CryptoUtils.cryptoKey = null;
    });

    it('should generate a crypto key', async () => {
        const key = await instance.generateKey();
        expect(key).not.toBeNull();
    });

    it('should encrypt and decrypt a string correctly', async () => {
        const originalStr = 'Hello, world!';
        const encryptedStr = await instance.encryptString(originalStr);
        const decryptedStr = await instance.decryptString(encryptedStr);
        expect(decryptedStr).toBe(originalStr);
    });
});
