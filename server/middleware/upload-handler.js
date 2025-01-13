import { MemoryManager } from '../utils/memory-manager.js';

export const uploadHandler = async (req, res, next) => {
  try {
    // Check memory before processing
    if (!MemoryManager.isMemoryOK()) {
      MemoryManager.logMemoryUsage('Upload Rejected - Memory Low');
      return res.status(503).json({
        error: 'Server is currently processing other files. Please try again later.'
      });
    }

    // Log memory usage at start
    MemoryManager.logMemoryUsage('Upload Start');

    // Add cleanup after request
    res.on('finish', async () => {
      await MemoryManager.forceGC();
      MemoryManager.logMemoryUsage('Upload End');
    });

    next();
  } catch (error) {
    console.error('Upload handler error:', error);
    next(error);
  }
};
