/**
 * ComputeKit Example - Fibonacci Function
 * Demonstrates iterative computation in AssemblyScript
 */

/**
 * Calculate the nth Fibonacci number (iterative)
 * @param n - Which Fibonacci number to calculate
 * @returns The nth Fibonacci number
 */
export function fibonacci(n: i32): i64 {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let a: i64 = 0;
  let b: i64 = 1;

  for (let i: i32 = 2; i <= n; i++) {
    const temp: i64 = a + b;
    a = b;
    b = temp;
  }

  return b;
}

/**
 * Calculate Fibonacci sequence up to n
 * @param n - Length of sequence
 * @returns Array containing Fibonacci sequence
 */
export function fibonacciSequence(n: i32): Int64Array {
  const result = new Int64Array(n);
  
  if (n >= 1) result[0] = 0;
  if (n >= 2) result[1] = 1;

  for (let i: i32 = 2; i < n; i++) {
    unchecked(result[i] = result[i - 1] + result[i - 2]);
  }

  return result;
}

/**
 * Check if a number is a Fibonacci number
 */
export function isFibonacci(num: i64): bool {
  // A number is Fibonacci if one of (5*n*n + 4) or (5*n*n - 4) is a perfect square
  const check1: i64 = 5 * num * num + 4;
  const check2: i64 = 5 * num * num - 4;
  
  return isPerfectSquare(check1) || isPerfectSquare(check2);
}

function isPerfectSquare(n: i64): bool {
  if (n < 0) return false;
  const root: i64 = <i64>Math.sqrt(<f64>n);
  return root * root === n;
}
