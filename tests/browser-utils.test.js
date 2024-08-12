'use strict';

const CryptoUtils = require('../browser-utils');

describe('CryptoUtils', () => {
    let cryptoUtils;

    beforeEach(() => {
        cryptoUtils = new CryptoUtils();

        // Mocking the window.crypto functions
        global.crypto = {
            subtle: {
                digest: jest.fn(),
                importKey: jest.fn(),
                encrypt: jest.fn(),
                decrypt: jest.fn()
            },
            getRandomValues: jest.fn((array) => {
                // Fill the array with random values
                for (let i = 0; i < array.length; i++) {
                    array[i] = Math.floor(Math.random() * 256);
                }
                return array;
            })
        };

        global.btoa = jest.fn((str) => Buffer.from(str, 'binary').toString('base64'));
        global.atob = jest.fn((str) => Buffer.from(str, 'base64').toString('binary'));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should generate a key using the hashed passphrase', async () => {
        const fakePassphrase = new ArrayBuffer(16);
        const fakeHash = new ArrayBuffer(32); // Mocked hash
        const fakeKey = {}; // Mocked CryptoKey

        cryptoUtils.str2ab = jest.fn().mockReturnValue(fakePassphrase);
        global.crypto.subtle.digest.mockResolvedValue(fakeHash);
        global.crypto.subtle.importKey.mockResolvedValue(fakeKey);

        const key = await cryptoUtils.generateKey();

        expect(cryptoUtils.str2ab).toHaveBeenCalledWith(CryptoUtils.passphrase);
        expect(global.crypto.subtle.digest).toHaveBeenCalledWith('SHA-256', fakePassphrase);
        expect(global.crypto.subtle.importKey).toHaveBeenCalledWith(
            'raw',
            fakeHash,
            { name: 'AES-GCM' },
            false,
            ['encrypt', 'decrypt']
        );
        expect(key).toBe(fakeKey);
    });

    it('should encrypt a string and return the combined iv and encrypted content in base64', async () => {
        const testString = 'hello world';
        const fakeIv = new Uint8Array(12);
        const fakeEncryptedContent = new ArrayBuffer(16); // Mocked encrypted content

        cryptoUtils.str2ab = jest.fn().mockReturnValue(new ArrayBuffer(11)); // Mocking string to array buffer conversion
        global.crypto.getRandomValues.mockImplementation((array) => {
            array.set(fakeIv);
            return array;
        });
        global.crypto.subtle.encrypt.mockResolvedValue(fakeEncryptedContent);

        const encryptedString = await cryptoUtils.encryptString(testString);

        expect(global.crypto.getRandomValues).toHaveBeenCalledWith(expect.any(Uint8Array));
        expect(global.crypto.subtle.encrypt).toHaveBeenCalledWith(
            {
                name: 'AES-GCM',
                iv: fakeIv
            },
            await cryptoUtils.generateKey(),
            expect.any(ArrayBuffer) // Checking that an ArrayBuffer was passed
        );
        expect(encryptedString).toBe(btoa(String.fromCharCode.apply(null, new Uint8Array([...fakeIv, ...new Uint8Array(fakeEncryptedContent)]))));
    });

    it('should decrypt an encrypted string and return the original string', async () => {
        const testString = 'hello world';
        const fakeEncryptedString = 'encryptedString';
        const decryptedContent = new ArrayBuffer(11); // Mocked decrypted content

        global.atob.mockReturnValue(fakeEncryptedString);
        cryptoUtils.ab2str = jest.fn().mockReturnValue(testString);
        global.crypto.subtle.decrypt.mockResolvedValue(decryptedContent);

        const decryptedString = await cryptoUtils.decryptString(fakeEncryptedString);

        expect(global.atob).toHaveBeenCalledWith(fakeEncryptedString);
        expect(global.crypto.subtle.decrypt).toHaveBeenCalledWith(
            {
                name: 'AES-GCM',
                iv: expect.any(Uint8Array)
            },
            await cryptoUtils.generateKey(),
            expect.any(ArrayBuffer) // Checking that an ArrayBuffer was passed
        );
        expect(decryptedString).toBe(testString);
    });
});
