// Test that simulates the worker code generation and execution
// Run with: node test-worker-code.mjs

// Simulate registering a function
const functions = new Map();

function register(name, fn) {
  functions.set(name, {
    fn,
    serialized: fn.toString(),
  });
}

// Register test functions
register('double', (n) => n * 2);
register('fibonacci', (n) => {
  if (n <= 1) return String(n);
  let a = BigInt(0);
  let b = BigInt(1);
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b.toString();
});

// Generate worker code
const functionsCode = Array.from(functions.entries())
  .map(([name, { serialized }]) => `"${name}": ${serialized}`)
  .join(',\n  ');

console.log('=== Generated functions code ===');
console.log(functionsCode);
console.log('');

const workerCode = `
const functions = {
  ${functionsCode}
};

// Test execution
async function execute(name, input) {
  const fn = functions[name];
  if (!fn) throw new Error('Function not found: ' + name);
  return await fn(input);
}

// Self-test
(async () => {
  console.log('Testing double(21):', await execute('double', 21));
  console.log('Testing fibonacci(10):', await execute('fibonacci', 10));
  console.log('Testing fibonacci(50):', await execute('fibonacci', 50));
})();
`;

console.log('=== Full worker code ===');
console.log(workerCode);
console.log('');

console.log('=== Executing worker code ===');
try {
  eval(workerCode);
} catch (err) {
  console.error('ERROR:', err);
}
