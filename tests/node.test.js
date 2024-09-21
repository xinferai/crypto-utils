// tests/node.test.js

'use strict';

const { setPassphrase, getPassphrase, encryptString, decryptString } = require('../dist/node.js');

// Mock the randomBytes to ensure consistent IV in tests
jest.mock('crypto', () => {
    const originalCrypto = jest.requireActual('crypto');
    return {
        ...originalCrypto,
        randomBytes: jest.fn(() => Buffer.from('123456789012')), // Mock a static IV for testing
    };
});

describe('crypto-utils', () => {
    const sampleText = 'Hello, World!';
    const mockPassphrase = 'my_secret_passphrase';

    beforeEach(() => {
        // Reset the passphrase to default for each test
        setPassphrase('default passphrase');
    });

    describe('Passphrase management', () => {
        it('should get the default passphrase', () => {
            expect(getPassphrase()).toBe('default passphrase');
        });

        it('should set and get a custom passphrase', () => {
            setPassphrase(mockPassphrase);
            expect(getPassphrase()).toBe(mockPassphrase);
        });
    });

    describe('Encryption and Decryption', () => {
        it('should encrypt and decrypt a string correctly', async () => {
            setPassphrase(mockPassphrase);

            const encryptedStr = await encryptString(sampleText);
            expect(encryptedStr).toBeDefined();

            const decryptedStr = await decryptString(encryptedStr);
            expect(decryptedStr).toBe(sampleText);
        });

        it('should throw an error when decrypting with an incorrect passphrase', async () => {
            setPassphrase(mockPassphrase);

            const encryptedStr = await encryptString(sampleText);

            // Change the passphrase
            setPassphrase('wrong_passphrase');
            
            // Decryption should fail with incorrect passphrase
            await expect(decryptString(encryptedStr)).rejects.toThrow();
        });

        it('should throw an error when decrypting with tampered data', async () => {
            setPassphrase(mockPassphrase);

            const encryptedStr = await encryptString(sampleText);

            // Tamper with the encrypted string
            const tamperedStr = encryptedStr.slice(0, -4) + 'abcd'; // Modify the base64 string

            await expect(decryptString(tamperedStr)).rejects.toThrow();
        });

        it('should generate a consistent encryption for the same input', async () => {
            setPassphrase(mockPassphrase);

            const encryptedStr1 = await encryptString(sampleText);
            const encryptedStr2 = await encryptString(sampleText);

            // Since the IV is mocked, both encrypted strings should be identical
            expect(encryptedStr1).toBe(encryptedStr2);
        });
    });
});
