'use strict';

const fs = require('fs');
const path = require('path');

let configContent = fs.readFileSync(path.resolve(__dirname, '../config.js'), 'utf8');

configContent = configContent.replace(/'use strict';\n/g, '');
configContent = configContent.replace(/module.exports = {\n/g, 'let config = {\n');

let script = configContent + '\n';

const lines = fs.readFileSync(path.resolve(__dirname, '../browser-utils.js'), 'utf8').split('\n');

let utilsContent = '';
for (let i = 9; i < lines.length; i++) {
    utilsContent += lines[i] + '\n';
}

script += utilsContent + '\n';

script += `\n
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
`;

fs.writeFileSync(path.resolve(__dirname, 'b-example.js'), script);
