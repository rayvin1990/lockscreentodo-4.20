import { appRouter } from './packages/api/src/root.ts';

console.log('=== Testing Router Structure ===\n');

const procedures = appRouter._def.procedures;
console.log('Available routers:', Object.keys(procedures));
console.log('');

// Check if resume router exists
if ('resume' in procedures) {
  console.log('✅ Resume router FOUND');
  console.log('Resume procedures:', Object.keys(procedures.resume));
} else {
  console.log('❌ Resume router NOT FOUND');
  console.log('Available routers:', Object.keys(procedures));
}

console.log('\n=== Test Complete ===');
