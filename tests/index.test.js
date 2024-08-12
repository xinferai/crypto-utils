'use strict';

const { 
    setPassphrase, 
    getPassphrase, 
    encryptString, 
    decryptString 
} = require('../index');

describe('CryptoUtils Index', () => {
    it('should set and get the passphrase', () => {
        setPassphrase('new-passphrase');
        expect(getPassphrase()).toBe('new-passphrase');
    });

    it('should encrypt and decrypt a string correctly', async () => {
        const originalStr = 'Hello, world!';
        const encryptedStr = await encryptString(originalStr);
        const decryptedStr = await decryptString(encryptedStr);
        //console.log({ encryptedStr, decryptedStr });
        expect(decryptedStr).toBe(originalStr);
    });
});
