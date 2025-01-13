import os from 'os';

export class MemoryManager {
  static getMemoryUsage() {
    const used = process.memoryUsage();
    return {
      heapUsed: Math.round(used.heapUsed / 1024 / 1024),
      heapTotal: Math.round(used.heapTotal / 1024 / 1024),
      rss: Math.round(used.rss / 1024 / 1024),
      external: Math.round(used.external / 1024 / 1024),
      systemTotal: Math.round(os.totalmem() / 1024 / 1024),
      systemFree: Math.round(os.freemem() / 1024 / 1024)
    };
  }

  static async forceGC() {
    if (global.gc) {
      global.gc();
    }
  }

  static isMemoryOK() {
    const usage = this.getMemoryUsage();
    const memoryLimit = process.env.RAILWAY_MEMORY_MB || 2048; // Default to 2GB
    return usage.heapUsed < (memoryLimit * 0.9); // Keep 10% buffer
  }

  static logMemoryUsage(label = '') {
    const usage = this.getMemoryUsage();
    console.log(`Memory Usage ${label}:`, {
      ...usage,
      timestamp: new Date().toISOString()
    });
  }
}
