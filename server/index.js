import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// ES module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  try {
    // Check if dist directory exists
    const distPath = join(__dirname, '../dist');
    const distExists = fs.existsSync(distPath);
    
    // Check if index.html exists
    const indexPath = join(distPath, 'index.html');
    const indexExists = fs.existsSync(indexPath);
    
    res.json({ 
      status: 'ok',
      checks: {
        distExists,
        indexExists,
        distPath,
        env: process.env.NODE_ENV
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error',
      error: error.message
    });
  }
});

// Serve static files from the Vite build
const distPath = join(__dirname, '../dist');
console.log('Serving static files from:', distPath);

if (!fs.existsSync(distPath)) {
  console.error('dist directory not found at:', distPath);
  console.log('Current directory contents:', fs.readdirSync(__dirname));
} else {
  console.log('dist directory found. Contents:', fs.readdirSync(distPath));
}

app.use(express.static(distPath));

// Handle SPA routing - serve index.html for all other routes
app.get('*', (req, res) => {
  const indexPath = join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'index.html not found' });
  }
});

// Start server with error handling
try {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server started on port ${port}`);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Current directory:', __dirname);
    console.log('Parent directory:', dirname(__dirname));
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}
