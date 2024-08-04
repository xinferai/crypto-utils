'use strict';

const CryptoUtils = require('./base');

module.exports = class BrowserUtils extends CryptoUtils {

    async generateKey() {
        if (CryptoUtils.cryptoKey) {
            return CryptoUtils.cryptoKey;
        }
        const passphraseBytes = this.str2ab(CryptoUtils.passphrase);
        const hash = await window.crypto.subtle.digest('SHA-256', passphraseBytes);
        CryptoUtils.cryptoKey = await window.crypto.subtle.importKey(
            'raw',
            hash, // Use the hashed passphrase as the key
            { name: 'AES-GCM' },
            false,
            ['encrypt', 'decrypt']
        );
        return CryptoUtils.cryptoKey;
    }

    async encryptString(str) {
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const key = await this.generateKey();
        const encryptedContent = await window.crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            this.str2ab(str)
        );
        const combined = new Uint8Array(iv.length + encryptedContent.byteLength);
        combined.set(iv, 0);
        combined.set(new Uint8Array(encryptedContent), iv.length);
        return btoa(String.fromCharCode.apply(null, combined));
    }

    async decryptString(encryptedStr) {
        const encryptedBytes = Uint8Array.from(atob(encryptedStr), c => c.charCodeAt(0));
        const iv = encryptedBytes.subarray(0, 12);
        const encryptedContent = encryptedBytes.subarray(12);
        const key = await this.generateKey();
        const decryptedContent = await window.crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            encryptedContent
        );

        return this.ab2str(decryptedContent);
    }
}
