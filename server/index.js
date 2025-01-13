import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { MemoryManager } from './utils/memory-manager.js';
import { uploadHandler } from './middleware/upload-handler.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable gzip compression
app.use(compression());

// Configure rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Increase payload limit for large file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files with caching
app.use(express.static(path.join(__dirname, '../dist'), {
  maxAge: '1h',
  etag: true
}));

// Add upload handler for file uploads
app.use('/api/upload', uploadHandler);

// Basic health check endpoint for Railway
app.get('/health', (req, res) => {
  const memoryUsage = MemoryManager.getMemoryUsage();
  res.status(200).json({
    status: 'healthy',
    memory: memoryUsage,
    uptime: process.uptime()
  });
});

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  MemoryManager.logMemoryUsage('Error Occurred');
  
  res.status(500).json({
    error: 'Something broke!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Periodic memory logging
setInterval(() => {
  MemoryManager.logMemoryUsage('Periodic Check');
}, 5 * 60 * 1000); // Every 5 minutes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  MemoryManager.logMemoryUsage('Server Start');
  
  // Log Railway-specific information
  console.log({
    railway_memory_mb: process.env.RAILWAY_MEMORY_MB || 'Not set',
    railway_cpu_count: process.env.RAILWAY_CPU_COUNT || 'Not set',
    railway_environment: process.env.RAILWAY_ENVIRONMENT || 'Not set'
  });
});
