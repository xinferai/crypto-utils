
declare module 'crypto-utils' {
    export function setPassphrase(passphrase: string): void;
    export function getPassphrase(): string;
    export function encryptString(str: string): Promise<string>;
    export function decryptString(encryptedStr: string): Promise<string>;
}