/**
 * ComputeKit Vanilla JavaScript Demo
 */

import { ComputeKit } from '@computekit/core';

// Initialize ComputeKit
const kit = new ComputeKit({
  maxWorkers: 4,
  debug: true,
});

// Register compute functions
kit.register('fibonacci', (n) => {
  if (n <= 1) return BigInt(n);
  let a = 0n;
  let b = 1n;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b.toString();
});

kit.register('heavyTask', (iterations) => {
  // Simulate CPU-intensive work
  let result = 0;
  for (let i = 0; i < iterations; i++) {
    result += Math.sqrt(i) * Math.sin(i);
  }
  return result;
});

kit.register('sum', (arr) => {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
});

// Helper functions
function setStatus(elementId, text, isLoading = false) {
  const el = document.getElementById(elementId);
  if (isLoading) {
    el.innerHTML = '<span class="status loading"><span class="spinner"></span> ' + text + '</span>';
  } else {
    el.textContent = text;
  }
}

function formatNumber(num) {
  return new Intl.NumberFormat().format(num);
}

// Fibonacci Demo
document.getElementById('btn-fib').addEventListener('click', async () => {
  const output = document.getElementById('fib-output');
  setStatus('fib-status', 'Computing...', true);

  const start = performance.now();

  try {
    const result = await kit.run('fibonacci', 50);
    const duration = performance.now() - start;

    output.innerHTML = `<span class="label">Fibonacci(50) = </span><span class="value">${result}</span>
<span class="label">Time: </span><span class="time">${duration.toFixed(2)}ms</span>`;
    setStatus('fib-status', '✓ Done');
  } catch (err) {
    output.innerHTML = `<span style="color:#da3633">Error: ${err.message}</span>`;
    setStatus('fib-status', '✗ Error');
  }

  setTimeout(() => setStatus('fib-status', ''), 2000);
});

// Blocking vs Async Comparison
const HEAVY_ITERATIONS = 50000000;

function heavyTaskBlocking(iterations) {
  let result = 0;
  for (let i = 0; i < iterations; i++) {
    result += Math.sqrt(i) * Math.sin(i);
  }
  return result;
}

document.getElementById('btn-blocking').addEventListener('click', () => {
  setStatus('compare-status', 'Running (UI will freeze)...', true);
  document.getElementById('blocking-result').textContent = '...';

  // Small delay to show the status before freezing
  setTimeout(() => {
    const start = performance.now();
    heavyTaskBlocking(HEAVY_ITERATIONS);
    const duration = performance.now() - start;

    document.getElementById('blocking-result').textContent = `${duration.toFixed(0)}ms`;
    setStatus('compare-status', '');
  }, 50);
});

document.getElementById('btn-async').addEventListener('click', async () => {
  setStatus('compare-status', 'Running in Worker...', true);
  document.getElementById('async-result').textContent = '...';

  const start = performance.now();
  await kit.run('heavyTask', HEAVY_ITERATIONS);
  const duration = performance.now() - start;

  document.getElementById('async-result').textContent = `${duration.toFixed(0)}ms`;
  setStatus('compare-status', '');
});

// Array Sum Demo
document.getElementById('btn-sum').addEventListener('click', async () => {
  const output = document.getElementById('sum-output');
  setStatus('sum-status', 'Generating array...', true);

  // Generate large array
  const size = 10_000_000;
  const arr = new Array(size);
  for (let i = 0; i < size; i++) {
    arr[i] = Math.floor(Math.random() * 100);
  }

  setStatus('sum-status', 'Computing sum...', true);

  const start = performance.now();

  try {
    const result = await kit.run('sum', arr);
    const duration = performance.now() - start;

    output.innerHTML = `<span class="label">Sum of ${formatNumber(size)} random numbers:</span>
<span class="value" style="font-size: 1.5em; font-weight: bold">${formatNumber(result)}</span>
<span class="label">Time: </span><span class="time">${duration.toFixed(0)}ms</span>
<span class="label" style="display: block; margin-top: 0.5rem">Throughput: ${formatNumber(Math.round((size / duration) * 1000))} ops/sec</span>`;
    setStatus('sum-status', '✓ Done');
  } catch (err) {
    output.innerHTML = `<span style="color:#da3633">Error: ${err.message}</span>`;
    setStatus('sum-status', '✗ Error');
  }

  setTimeout(() => setStatus('sum-status', ''), 2000);
});

// Update global status
const globalStatus = document.getElementById('status');
kit.on?.('task:start', () => {
  globalStatus.innerHTML = '<span class="status loading"><span class="spinner"></span> Working...</span>';
});

// Log ready state
console.log('ComputeKit Demo Ready!');
console.log('Pool Stats:', kit.getStats());
