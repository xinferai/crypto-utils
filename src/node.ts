// src/node.ts

import { randomBytes, createCipheriv, createDecipheriv, createHash } from 'crypto';

let passphrase = 'default passphrase';
let cryptoKey: Buffer | null = null;

if (process.env?.XINFERAI_PASSPHRASE) {
    passphrase = process.env.XINFERAI_PASSPHRASE;
} else if (process.env?.NEXT_PUBLIC_XINFERAI_PASSPHRASE) {
    passphrase = process.env.NEXT_PUBLIC_XINFERAI_PASSPHRASE;
}

export function setPassphrase(s: string): void {
    passphrase = s;
    cryptoKey = null; // Reset the key when passphrase changes
}

export function getPassphrase(): string {
    return passphrase;
}

async function generateKey(): Promise<Buffer> {
    if (cryptoKey) {
        return cryptoKey;
    }
    const hash = createHash('sha256').update(Buffer.from(passphrase)).digest();
    cryptoKey = hash;
    return hash;
}

export async function encryptString(str: string): Promise<string> {
    const iv = randomBytes(12);
    const key = await generateKey();

    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(str, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    const combined = Buffer.concat([iv, encrypted, authTag]);

    return combined.toString('base64');
}

export async function decryptString(encryptedStr: string): Promise<string> {
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