import express from 'express';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ES module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../dist'), {
  maxAge: '1h',
  etag: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  const memoryUsage = process.memoryUsage();
  res.status(200).json({
    status: 'healthy',
    memory: memoryUsage,
    uptime: process.uptime()
  });
});

// Import and use upload routes
const uploadRoutes = (await import('./routes/upload.js')).default;
app.use('/api/upload', uploadRoutes);

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Something broke!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Periodic memory logging
setInterval(() => {
  console.log('Periodic memory usage:', process.memoryUsage());
}, 5 * 60 * 1000); // Every 5 minutes

// Start server with error handling
try {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log({
      railway_memory_mb: process.env.RAILWAY_MEMORY_MB || 'Not set',
      railway_cpu_count: process.env.RAILWAY_CPU_COUNT || 'Not set',
      railway_environment: process.env.RAILWAY_ENVIRONMENT || 'Not set'
    });
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}
