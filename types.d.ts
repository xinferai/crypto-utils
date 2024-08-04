
function setPassphrase(passphrase: string): void;
function getPassphrase(): string;
function encryptString(str: string): Promise<string>;
function decryptString(encryptedStr: string): Promise<string>;