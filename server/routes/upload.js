import express from 'express';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import csvParser from 'csv-parser';
import { Readable } from 'stream';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Batch processing function
const processBatch = async (records, tableName, jobId) => {
  try {
    const { error } = await supabase
      .from(tableName)
      .upsert(records, {
        onConflict: ['row_index', 'job_id']
      });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Batch processing error:', error);
    return { success: false, error };
  }
};

// Upload endpoint
router.post('/process', upload.single('file'), async (req, res) => {
  const BATCH_SIZE = parseInt(process.env.VITE_MAX_BATCH_SIZE || '10000');
  let batch = [];
  let processedRows = 0;
  let errorCount = 0;
  let successCount = 0;

  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const { tableName, columnMapping } = req.body;
    if (!tableName || !columnMapping) {
      throw new Error('Missing required parameters');
    }

    const mappingObj = typeof columnMapping === 'string' 
      ? JSON.parse(columnMapping) 
      : columnMapping;

    // Create upload job
    const { data: job, error: jobError } = await supabase
      .from('upload_jobs')
      .insert({
        file_type: 'csv',
        file_name: req.file.originalname,
        status: 'processing',
        start_time: new Date().toISOString()
      })
      .select()
      .single();

    if (jobError) throw jobError;

    // Set up CSV parsing stream
    const fileBuffer = req.file.buffer;
    const stream = Readable.from(fileBuffer.toString())
      .pipe(csvParser())
      .on('data', async (row) => {
        const mappedRow = {
          job_id: job.job_id,
          row_index: processedRows++
        };

        // Map columns according to configuration
        Object.entries(mappingObj).forEach(([source, target]) => {
          mappedRow[target] = row[source];
        });

        batch.push(mappedRow);

        // Process batch when it reaches the size limit
        if (batch.length >= BATCH_SIZE) {
          const { success } = await processBatch(batch, tableName, job.job_id);
          if (success) {
            successCount += batch.length;
          } else {
            errorCount += batch.length;
          }
          batch = [];
        }
      })
      .on('end', async () => {
        // Process remaining records
        if (batch.length > 0) {
          const { success } = await processBatch(batch, tableName, job.job_id);
          if (success) {
            successCount += batch.length;
          } else {
            errorCount += batch.length;
          }
        }

        // Update job status
        await supabase
          .from('upload_jobs')
          .update({
            status: errorCount > 0 ? 'completed_with_errors' : 'completed',
            end_time: new Date().toISOString(),
            error_count: errorCount,
            success_count: successCount,
            total_rows: processedRows
          })
          .eq('job_id', job.job_id);

        res.json({
          success: true,
          jobId: job.job_id,
          processedRows,
          errorCount,
          successCount
        });
      })
      .on('error', (error) => {
        throw error;
      });
  } catch (error) {
    console.error('Upload processing error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
