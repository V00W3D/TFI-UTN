import { sdk } from './apps/frontend/src/tools/sdk';

console.log('IAM keys:', Object.keys(sdk.iam));
console.log('Customers keys:', Object.keys(sdk.customers));
