
import { 
    setPassphrase, 
    getPassphrase, 
    encryptString, 
    decryptString 
} from './dist/node.mjs';

(async () => {
    setPassphrase('x5fki+cuEvwXC6jZrMUX5TZT4K9fvFdTJHyr4dOOZiYE0wJ+EyL3F8k');
    console.log(getPassphrase());
    const encrypted = await encryptString('Hello, World!');
    console.log(encrypted);
    const decrypted = await decryptString(encrypted);
    console.log(decrypted);
})();