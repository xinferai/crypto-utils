// browser-utils.js

'use strict';

// default passphrase
//
let passphrase = 'default passphrase';

let cryptoKey = null;

function setPassphrase(s) {
    passphrase = s;
}

function getPassphrase() {
    return passphrase;
}

function str2ab(str) {
    const encoder = new TextEncoder();
    return encoder.encode(str);
}

function ab2str(buffer) {
    const decoder = new TextDecoder();
    return decoder.decode(buffer);
}

async function generateKey() {
    if (cryptoKey) {
        return cryptoKey;
    }
    const passphraseBytes = str2ab(passphrase);
    const hash = await window.crypto.subtle.digest('SHA-256', passphraseBytes);
    cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        hash, // Use the hashed passphrase as the key
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
    );
    return cryptoKey;
}

async function encryptString(str) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await generateKey();
    const encryptedContent = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        key,
        str2ab(str)
    );
    const combined = new Uint8Array(iv.length + encryptedContent.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedContent), iv.length);
    return btoa(String.fromCharCode.apply(null, combined));
}

async function decryptString(encryptedStr) {
    const encryptedBytes = Uint8Array.from(atob(encryptedStr), c => c.charCodeAt(0));
    const iv = encryptedBytes.subarray(0, 12);
    const encryptedContent = encryptedBytes.subarray(12);
    const key = await generateKey();
    const decryptedContent = await window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        key,
        encryptedContent
    );
    return ab2str(decryptedContent);
}

module.exports = {
    setPassphrase,
    getPassphrase,
    encryptString,
    decryptString
};