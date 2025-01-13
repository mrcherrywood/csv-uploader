import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

interface BatchResult {
  errorCount: number;
  successCount: number;
  lastProcessedIndex: number;
}

type TableNames = keyof Database['public']['Tables'];

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
  const BATCH_SIZE = Number(process.env.MAX_BATCH_SIZE) || 10000;
  const MEMORY_BUFFER = Number(process.env.MEMORY_BUFFER_PERCENTAGE) || 15; // Percentage
  let errorCount = 0;
  let successCount = 0;
  let lastProgressLog = Date.now();
  let lastProcessedIndex = startIndex;

  try {
    // Process rows in chunks to avoid memory issues
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batchStartTime = Date.now();
      
      // Check memory usage before processing batch
      const memoryUsage = process.memoryUsage();
      const usedMemoryPercentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
      
      // If memory usage is high, wait for GC
      if (usedMemoryPercentage > (100 - MEMORY_BUFFER)) {
        console.log(`Memory usage high (${usedMemoryPercentage.toFixed(2)}%). Waiting for GC...`);
        if (global.gc) {
          global.gc();
          await delay(1000); // Wait for GC to complete
        }
      }

      const batchRows = rows.slice(i, i + BATCH_SIZE);
      
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
      const maxRetries = 3;
      let error;

      while (retryCount < maxRetries) {
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
          await delay(1000 * retryCount); // Exponential backoff
        } catch (e) {
          error = e;
          retryCount++;
          await delay(1000 * retryCount);
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
      if (now - lastProgressLog > 5000) {
        const batchTime = now - batchStartTime;
        const rowsPerSecond = Math.round((BATCH_SIZE / batchTime) * 1000);
        const memUsage = process.memoryUsage();
        
        console.log({
          progress: `${Math.round(((i + BATCH_SIZE) / rows.length) * 100)}%`,
          rowsProcessed: i + BATCH_SIZE,
          totalRows: rows.length,
          rowsPerSecond,
          memoryUsage: {
            heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
            external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
          }
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