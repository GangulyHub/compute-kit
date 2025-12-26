// Test Worker - standalone version of the generated worker code
console.log('[Test Worker] Starting...');

const functions = {
  double: (n) => n * 2,
  fibonacci: (n) => {
    if (n <= 1) return String(n);
    let a = BigInt(0);
    let b = BigInt(1);
    for (let i = 2; i <= n; i++) {
      const temp = a + b;
      a = b;
      b = temp;
    }
    return b.toString();
  },
};

console.log('[Test Worker] Functions loaded:', Object.keys(functions));

self.onmessage = async function (e) {
  console.log('[Test Worker] Received message:', e.data);
  const { id, type, payload, timestamp } = e.data;

  if (type === 'execute') {
    const { functionName, input } = payload;
    console.log('[Test Worker] Executing:', functionName, 'with input:', input);
    const fn = functions[functionName];

    if (!fn) {
      self.postMessage({
        id,
        type: 'error',
        payload: { message: 'Function not found: ' + functionName },
        timestamp: Date.now(),
      });
      return;
    }

    const startTime = performance.now();

    try {
      console.log('[Test Worker] Calling function...');
      const result = await fn(input);
      console.log('[Test Worker] Function returned:', typeof result, result);
      const duration = performance.now() - startTime;

      self.postMessage({
        id,
        type: 'result',
        payload: { data: result, duration },
        timestamp: Date.now(),
      });
      console.log('[Test Worker] Result sent');
    } catch (err) {
      console.error('[Test Worker] Error:', err);
      self.postMessage({
        id,
        type: 'error',
        payload: {
          message: err.message || 'Unknown error',
          stack: err.stack,
        },
        timestamp: Date.now(),
      });
    }
  }
};

// Signal ready
self.postMessage({ type: 'ready', timestamp: Date.now() });
console.log('[Test Worker] Ready signal sent');
