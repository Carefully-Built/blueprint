
import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS('sk_test_123'); // Dummy key

console.log('Methods on userManagement:');
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(workos.userManagement)));
