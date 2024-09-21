# crypto-utils

string encryption and decryption functions run with both nodejs and browser

## how to install
```
npm install @xinferai/crypto-utils
```

### example for common js
```javascript
'use strict';

const { 
    setPassphrase, 
    getPassphrase, 
    encryptString, 
    decryptString 
} = require('@xinferai/crypto-utils');

(async () => {
    setPassphrase('x5fki+cuEvwXC6jZrMUX5TZT4K9fvFdTJHyr4dOOZiYE0wJ+EyL3F8k');
    console.log(getPassphrase());
    const encrypted = await encryptString('Hello, World!');
    console.log(encrypted);
    const decrypted = await decryptString(encrypted);
    console.log(decrypted);
})();
```

### example for es module
```javascript
import { 
    setPassphrase, 
    getPassphrase, 
    encryptString, 
    decryptString 
} from '@xinferai/crypto-utils';

(async () => {
    setPassphrase('x5fki+cuEvwXC6jZrMUX5TZT4K9fvFdTJHyr4dOOZiYE0wJ+EyL3F8k');
    console.log(getPassphrase());
    const encrypted = await encryptString('Hello, World!');
    console.log(encrypted);
    const decrypted = await decryptString(encrypted);
    console.log(decrypted);
})();
...