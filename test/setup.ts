/**
 * Vitest Test Setup
 */

// Mock Web Worker for Node.js environment
class MockWorker {
  onmessage: ((e: MessageEvent) => void) | null = null;
  onerror: ((e: ErrorEvent) => void) | null = null;

  constructor(public url: string) {
    // Simulate worker ready
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage(new MessageEvent('message', {
          data: { type: 'ready', timestamp: Date.now() }
        }));
      }
    }, 0);
  }

  postMessage(data: unknown, _transfer?: Transferable[]) {
    // Simulate async response
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage(new MessageEvent('message', {
          data: {
            id: (data as { id: string }).id,
            type: 'result',
            payload: { data: 'mock result', duration: 10 },
            timestamp: Date.now()
          }
        }));
      }
    }, 10);
  }

  terminate() {
    // Cleanup
  }
}

// @ts-expect-error - Mock for testing
globalThis.Worker = MockWorker;

// Mock URL.createObjectURL
globalThis.URL.createObjectURL = (blob: Blob) => {
  return `blob:mock-${Date.now()}`;
};

globalThis.URL.revokeObjectURL = (_url: string) => {
  // Cleanup
};

// Mock performance.now if not available
if (typeof performance === 'undefined') {
  // @ts-expect-error - Mock for testing
  globalThis.performance = {
    now: () => Date.now(),
  };
}
