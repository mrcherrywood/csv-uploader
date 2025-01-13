import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

interface BatchResult {
  errorCount: number;
  successCount: number;
  lastProcessedIndex: number;
}

type TableNames = keyof Database['public']['Tables'];

// Configuration constants
const CONFIG = {
  BATCH_SIZE: Number(import.meta.env.VITE_MAX_BATCH_SIZE) || 10000,
  MEMORY_BUFFER: Number(import.meta.env.VITE_MEMORY_BUFFER_PERCENTAGE) || 15,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  PROGRESS_INTERVAL: 5000
};

// Helper to check if a field should be treated as numeric
const isNumericField = (fieldName: string): boolean => {
  const numericFields = ['amount', 'price', 'quantity', 'total', 'balance'];
  return numericFields.some(field => fieldName.toLowerCase().includes(field));
};

// Helper to parse numeric values
const parseNumericValue = (value: string | null): number | null => {
  if (!value) return null;
  const parsed = parseFloat(value.replace(/[^0-9.-]/g, ''));
  return isNaN(parsed) ? null : parsed;
};

// Helper to get primary key fields for a table
const getPrimaryKeyFields = (tableName: TableNames): string[] => {
  return ['row_index', 'job_id'];
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const processBatch = async (
  rows: string[][],
  headers: string[],
  columnMapping: Record<string, string>,
  tableName: TableNames,
  jobId: string,
  startIndex: number
): Promise<BatchResult> => {
  let errorCount = 0;
  let successCount = 0;
  let lastProgressLog = Date.now();
  let lastProcessedIndex = startIndex;

  try {
    // Process rows in chunks to avoid memory issues
    for (let i = 0; i < rows.length; i += CONFIG.BATCH_SIZE) {
      const batchStartTime = Date.now();
      const batchRows = rows.slice(i, i + CONFIG.BATCH_SIZE);
      
      // Convert batch to records with optimized memory usage
      const records = batchRows.map((row, index) => {
        const record: Record<string, any> = {
          job_id: jobId,
          row_index: startIndex + i + index
        };
        
        headers.forEach((header, colIndex) => {
          const columnName = columnMapping[header];
          if (columnName) {
            let value = row[colIndex]?.trim() || null;
            if (isNumericField(columnName)) {
              value = parseNumericValue(value);
            }
            record[columnName] = value;
          }
        });
        
        return record;
      });

      // Clear references to help GC
      batchRows.length = 0;

      // Perform upsert with retry logic
      let retryCount = 0;
      let error;

      while (retryCount < CONFIG.MAX_RETRIES) {
        try {
          const { error: upsertError } = await supabase
            .from(tableName)
            .upsert(records, {
              onConflict: getPrimaryKeyFields(tableName).join(',')
            });

          if (!upsertError) {
            error = null;
            break;
          }
          error = upsertError;
          retryCount++;
          await delay(CONFIG.RETRY_DELAY * retryCount); // Exponential backoff
        } catch (e) {
          error = e;
          retryCount++;
          await delay(CONFIG.RETRY_DELAY * retryCount);
        }
      }

      if (error) {
        console.error('Batch insert error:', {
          error,
          batchSize: records.length,
          startRow: startIndex + i,
          retryCount
        });
        errorCount += records.length;
      } else {
        successCount += records.length;
        lastProcessedIndex = startIndex + i + records.length;
      }

      // Clear references to help GC
      records.length = 0;

      // Log progress every 5 seconds
      const now = Date.now();
      if (now - lastProgressLog > CONFIG.PROGRESS_INTERVAL) {
        const batchTime = now - batchStartTime;
        const rowsPerSecond = Math.round((CONFIG.BATCH_SIZE / batchTime) * 1000);
        
        console.log({
          progress: `${Math.round(((i + CONFIG.BATCH_SIZE) / rows.length) * 100)}%`,
          rowsProcessed: i + CONFIG.BATCH_SIZE,
          totalRows: rows.length,
          rowsPerSecond,
        });
        
        lastProgressLog = now;
      }

      // Small delay between batches to prevent overwhelming the database
      await delay(100);
    }
  } catch (error) {
    console.error('Processing error:', error);
    throw error;
  }

  return { errorCount, successCount, lastProcessedIndex };
};