
let passphrase = typeof process !== 'undefined' && process.env?.CRYPTO_UTILS_PASSPHRASE ? 
    process.env.CRYPTO_UTILS_PASSPHRASE : 'xZAfK8BTXPglW+2Hwv0F3upiIW1gHp761y0GFCQaS2qm';

let cryptoKey = null;

let config = {
    passphrase,
    cryptoKey
};

function str2ab(str) {
    const encoder = new TextEncoder();
    return encoder.encode(str);
}

function ab2str(buffer) {
    const decoder = new TextDecoder();
    return decoder.decode(buffer);
}

async function generateKey() {
    if (config.cryptoKey) {
        return config.cryptoKey;
    }
    const passphraseBytes = str2ab(config.passphrase);
    const hash = await window.crypto.subtle.digest('SHA-256', passphraseBytes);
    config.cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        hash, // Use the hashed passphrase as the key
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
    );
    return config.cryptoKey;
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



function setPassphrase(s) {
    config.passphrase = s;
}

function getPassphrase() {
    return config.passphrase;
}

setPassphrase('x5fki+cuEvwXC6jZrMUX5TZT4K9fvFdTJHyr4dOOZiYE0wJ+EyL3F8k');
console.log(getPassphrase());
const encrypted = await encryptString('Hello, World!');
console.log(encrypted);
const decrypted = await decryptString(encrypted);
console.log(decrypted);   
