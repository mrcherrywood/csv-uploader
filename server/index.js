import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import uploadRouter from './routes/upload.js';

// ES module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());

// Configure API routes
app.use('/api/upload', uploadRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  try {
    // Check if dist directory exists
    const distPath = join(__dirname, '../dist');
    const indexPath = join(distPath, 'index.html');
    
    // Return basic health status
    res.json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error',
      error: error.message
    });
  }
});

// Serve static files
const distPath = join(__dirname, '../dist');
console.log('Static files path:', distPath);

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  console.log('Serving static files from:', distPath);
} else {
  console.warn('Warning: dist directory not found at:', distPath);
}

// Handle SPA routing
app.get('*', (req, res) => {
  const indexPath = join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Application not properly built' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server started on port ${port}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Current directory:', __dirname);
  console.log('Parent directory:', dirname(__dirname));
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
