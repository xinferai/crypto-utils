'use strict';

const CryptoUtils = require('../base');

describe('CryptoUtils Base Class', () => {
    it('should have a default passphrase', () => {
        expect(CryptoUtils.passphrase).toBe(
            'qZ_(MvJ:<GS&x69d\']8?nsXrz)-^KB/ek>T,PcVg"Db"tN'
        );
    });

    it('should convert string to ArrayBuffer', () => {
        const instance = new CryptoUtils();
        const buffer = instance.str2ab('test');
        expect(buffer.constructor.name).toBe('Uint8Array');
    });

    it('should convert ArrayBuffer to string', () => {
        const instance = new CryptoUtils();
        const buffer = instance.str2ab('test');
        const str = instance.ab2str(buffer);
        expect(str).toBe('test');
    });
});
