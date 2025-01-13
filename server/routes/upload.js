import express from 'express';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

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
  const BATCH_SIZE = parseInt(process.env.VITE_MAX_BATCH_SIZE) || 10000;
  let batch = [];
  let processedRows = 0;
  let errorCount = 0;
  let successCount = 0;

  try {
    const { tableName, columnMapping } = req.body;
    const fileBuffer = req.file.buffer;
    
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

    // Process CSV file
    const stream = Readable.from(fileBuffer.toString())
      .pipe(csv())
      .on('data', async (row) => {
        const mappedRow = {
          job_id: job.job_id,
          row_index: processedRows++
        };

        // Map columns according to configuration
        Object.entries(columnMapping).forEach(([source, target]) => {
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
