/**
 * ComputeKit Example - Matrix Operations
 * Demonstrates linear algebra operations in AssemblyScript
 */

/**
 * Matrix multiplication (A × B)
 * Assumes matrices are stored in row-major order as flat arrays
 * @param a - First matrix
 * @param b - Second matrix
 * @param aRows - Number of rows in A
 * @param aCols - Number of columns in A (and rows in B)
 * @param bCols - Number of columns in B
 * @returns Result matrix (aRows × bCols)
 */
export function matrixMultiply(
  a: Float64Array,
  b: Float64Array,
  aRows: i32,
  aCols: i32,
  bCols: i32
): Float64Array {
  const result = new Float64Array(aRows * bCols);

  for (let i: i32 = 0; i < aRows; i++) {
    for (let j: i32 = 0; j < bCols; j++) {
      let sum: f64 = 0.0;
      for (let k: i32 = 0; k < aCols; k++) {
        sum += unchecked(a[i * aCols + k]) * unchecked(b[k * bCols + j]);
      }
      unchecked(result[i * bCols + j] = sum);
    }
  }

  return result;
}

/**
 * Matrix transpose
 */
export function matrixTranspose(
  matrix: Float64Array,
  rows: i32,
  cols: i32
): Float64Array {
  const result = new Float64Array(rows * cols);

  for (let i: i32 = 0; i < rows; i++) {
    for (let j: i32 = 0; j < cols; j++) {
      unchecked(result[j * rows + i] = matrix[i * cols + j]);
    }
  }

  return result;
}

/**
 * Dot product of two vectors
 */
export function dotProduct(a: Float64Array, b: Float64Array): f64 {
  const len: i32 = min(a.length, b.length);
  let sum: f64 = 0.0;

  for (let i: i32 = 0; i < len; i++) {
    sum += unchecked(a[i]) * unchecked(b[i]);
  }

  return sum;
}

/**
 * Vector magnitude (Euclidean norm)
 */
export function vectorMagnitude(v: Float64Array): f64 {
  let sumSq: f64 = 0.0;

  for (let i: i32 = 0; i < v.length; i++) {
    const val: f64 = unchecked(v[i]);
    sumSq += val * val;
  }

  return Math.sqrt(sumSq);
}

/**
 * Vector normalization
 */
export function vectorNormalize(v: Float64Array): Float64Array {
  const mag: f64 = vectorMagnitude(v);
  const result = new Float64Array(v.length);

  if (mag === 0.0) return result;

  for (let i: i32 = 0; i < v.length; i++) {
    unchecked(result[i] = v[i] / mag);
  }

  return result;
}

/**
 * Element-wise matrix addition
 */
export function matrixAdd(
  a: Float64Array,
  b: Float64Array
): Float64Array {
  const len: i32 = min(a.length, b.length);
  const result = new Float64Array(len);

  for (let i: i32 = 0; i < len; i++) {
    unchecked(result[i] = a[i] + b[i]);
  }

  return result;
}

/**
 * Scalar multiplication
 */
export function matrixScale(
  matrix: Float64Array,
  scalar: f64
): Float64Array {
  const result = new Float64Array(matrix.length);

  for (let i: i32 = 0; i < matrix.length; i++) {
    unchecked(result[i] = matrix[i] * scalar);
  }

  return result;
}
