import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS('sk_test_123');

// eslint-disable-next-line no-console
console.info('Methods on userManagement:');
// eslint-disable-next-line no-console
console.info(Object.getOwnPropertyNames(Object.getPrototypeOf(workos.userManagement)));
