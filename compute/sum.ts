/**
 * ComputeKit Example - Sum Function
 * Demonstrates a simple array summation in AssemblyScript
 */

/**
 * Calculate the sum of an Int32Array
 * @param arr - Array of 32-bit integers
 * @returns The sum of all elements
 */
export function sum(arr: Int32Array): i32 {
  let total: i32 = 0;
  for (let i = 0; i < arr.length; i++) {
    total += unchecked(arr[i]);
  }
  return total;
}

/**
 * Calculate the sum of a Float64Array
 * @param arr - Array of 64-bit floats
 * @returns The sum of all elements
 */
export function sumFloat(arr: Float64Array): f64 {
  let total: f64 = 0.0;
  for (let i = 0; i < arr.length; i++) {
    total += unchecked(arr[i]);
  }
  return total;
}

/**
 * Calculate average of an Int32Array
 */
export function average(arr: Int32Array): f64 {
  if (arr.length === 0) return 0.0;
  return <f64>sum(arr) / <f64>arr.length;
}
