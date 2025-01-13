import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

interface BatchResult {
  errorCount: number;
  successCount: number;
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
  // This is a simplified version - in production, you'd want to get this from your schema
  return ['row_index', 'job_id'];
};

export const processBatch = async (
  rows: string[][],
  headers: string[],
  columnMapping: Record<string, string>,
  tableName: TableNames,
  jobId: string,
  startIndex: number
): Promise<BatchResult> => {
  const BATCH_SIZE = 50000; // Increased to 50k rows per batch for better performance
  let errorCount = 0;
  let successCount = 0;
  let lastProgressLog = Date.now();

  try {
    // Process rows in chunks to avoid memory issues
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batchStartTime = Date.now();
      const batchRows = rows.slice(i, i + BATCH_SIZE);
      
      // Convert batch to records
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

      // Perform upsert
      const { error } = await supabase
        .from(tableName)
        .upsert(records, {
          onConflict: getPrimaryKeyFields(tableName).join(',')
        });

      if (error) {
        console.error('Batch insert error:', {
          error,
          batchSize: records.length,
          startRow: startIndex + i
        });
        errorCount += records.length;
      } else {
        successCount += records.length;
      }

      // Log progress every 5 seconds
      const now = Date.now();
      if (now - lastProgressLog > 5000) {
        const batchTime = now - batchStartTime;
        const rowsPerSecond = Math.round((records.length / batchTime) * 1000);
        console.log('Batch processing status:', {
          batchSize: records.length,
          batchTimeMs: batchTime,
          rowsPerSecond,
          totalProcessed: successCount + errorCount,
          successCount,
          errorCount,
          memoryUsage: process.memoryUsage?.()?.heapUsed || 'unknown'
        });
        lastProgressLog = now;
      }

      // Clear memory
      batchRows.length = 0;
    }

    // Clear input array
    rows.length = 0;

    return { errorCount, successCount };
  } catch (error) {
    console.error('Processing error:', error);
    return { errorCount: rows.length, successCount: 0 };
  }
};