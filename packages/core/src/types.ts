/**
 * ComputeKit Core Types
 * Type definitions for the WASM + Worker toolkit
 */

/** Configuration options for ComputeKit */
export interface ComputeKitOptions {
  /** Maximum number of workers in the pool (default: navigator.hardwareConcurrency || 4) */
  maxWorkers?: number;
  /** Timeout for compute operations in milliseconds (default: 30000) */
  timeout?: number;
  /** Enable debug logging (default: false) */
  debug?: boolean;
  /** Custom path to worker script */
  workerPath?: string;
  /** Whether to use SharedArrayBuffer when available (default: true) */
  useSharedMemory?: boolean;
}

/** Options for individual compute operations */
export interface ComputeOptions {
  /** Timeout for this specific operation (overrides global) */
  timeout?: number;
  /** Transfer these ArrayBuffers to the worker (improves performance) */
  transfer?: ArrayBuffer[];
  /** Priority level for scheduling (0-10, higher = more priority) */
  priority?: number;
  /** Abort signal to cancel the operation */
  signal?: AbortSignal;
  /** Progress callback for long-running operations */
  onProgress?: (progress: ComputeProgress) => void;
}

/** Progress information for compute operations */
export interface ComputeProgress {
  /** Progress percentage (0-100) */
  percent: number;
  /** Current step/phase name */
  phase?: string;
  /** Estimated time remaining in milliseconds */
  estimatedTimeRemaining?: number;
  /** Any additional data from the compute function */
  data?: unknown;
}

/** Result wrapper with metadata */
export interface ComputeResult<T> {
  /** The computed result */
  data: T;
  /** Time taken in milliseconds */
  duration: number;
  /** Whether the result came from cache */
  cached: boolean;
  /** Worker ID that processed this */
  workerId: string;
}

/** Function definition for registration */
export interface ComputeFunction<TInput = unknown, TOutput = unknown> {
  /** The compute function implementation */
  fn: (input: TInput) => TOutput | Promise<TOutput>;
  /** Optional WASM module to load */
  wasmModule?: WebAssembly.Module | ArrayBuffer | string;
  /** Whether this function supports progress reporting */
  supportsProgress?: boolean;
}

/** WASM module configuration */
export interface WasmModuleConfig {
  /** Path to the WASM file or base64 encoded WASM */
  source: string | ArrayBuffer;
  /** Imports to provide to the WASM module */
  imports?: WebAssembly.Imports;
  /** Memory configuration */
  memory?: {
    initial: number;
    maximum?: number;
    shared?: boolean;
  };
}

/** Worker message types */
export type WorkerMessageType =
  | 'execute'
  | 'result'
  | 'error'
  | 'progress'
  | 'init'
  | 'ready'
  | 'terminate';

/** Base worker message */
export interface WorkerMessage<T = unknown> {
  id: string;
  type: WorkerMessageType;
  payload?: T;
  timestamp: number;
}

/** Execute message payload */
export interface ExecutePayload {
  functionName: string;
  input: unknown;
  options?: ComputeOptions;
}

/** Result message payload */
export interface ResultPayload<T = unknown> {
  data: T;
  duration: number;
  transfer?: ArrayBuffer[];
}

/** Error message payload */
export interface ErrorPayload {
  message: string;
  stack?: string;
  code?: string;
}

/** Progress message payload */
export interface ProgressPayload {
  taskId: string;
  progress: ComputeProgress;
}

/** Worker state */
export type WorkerState = 'idle' | 'busy' | 'error' | 'terminated';

/** Worker info */
export interface WorkerInfo {
  id: string;
  state: WorkerState;
  currentTask?: string;
  tasksCompleted: number;
  errors: number;
  createdAt: number;
  lastActiveAt: number;
}

/** Pool statistics */
export interface PoolStats {
  workers: WorkerInfo[];
  totalWorkers: number;
  activeWorkers: number;
  idleWorkers: number;
  queueLength: number;
  tasksCompleted: number;
  tasksFailed: number;
  averageTaskDuration: number;
}

/** Event data for worker:created */
export interface WorkerCreatedEvent {
  info: WorkerInfo;
}

/** Event data for worker:terminated */
export interface WorkerTerminatedEvent {
  info: WorkerInfo;
}

/** Event data for worker:error */
export interface WorkerErrorEvent {
  error: Error;
  info: WorkerInfo;
}

/** Event data for task:start */
export interface TaskStartEvent {
  taskId: string;
  functionName: string;
}

/** Event data for task:complete */
export interface TaskCompleteEvent {
  taskId: string;
  duration: number;
}

/** Event data for task:error */
export interface TaskErrorEvent {
  taskId: string;
  error: Error;
}

/** Event data for task:progress */
export interface TaskProgressEvent {
  taskId: string;
  progress: ComputeProgress;
}

/** Events emitted by ComputeKit */
export type ComputeKitEvents = {
  'worker:created': WorkerCreatedEvent;
  'worker:terminated': WorkerTerminatedEvent;
  'worker:error': WorkerErrorEvent;
  'task:start': TaskStartEvent;
  'task:complete': TaskCompleteEvent;
  'task:error': TaskErrorEvent;
  'task:progress': TaskProgressEvent;
  [key: string]: unknown;
};

/** Type helper for compute function signatures */
export type ComputeFn<TInput, TOutput> = (
  input: TInput,
  options?: ComputeOptions
) => Promise<TOutput>;

/** Registry of compute functions */
export type ComputeRegistry = Map<string, ComputeFunction>;

/** Transferable types */
export type Transferable = ArrayBuffer | MessagePort | ImageBitmap | OffscreenCanvas;

/** Serializable types for worker communication */
export type Serializable =
  | string
  | number
  | boolean
  | null
  | undefined
  | Serializable[]
  | { [key: string]: Serializable }
  | ArrayBuffer
  | ArrayBufferView
  | Map<Serializable, Serializable>
  | Set<Serializable>;
