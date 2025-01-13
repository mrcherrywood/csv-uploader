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

  try {
    // Map the data to match the table schema
    const mappedRows = rows.map((row, index) => {
      const mappedRow: Record<string, any> = {
        row_index: startIndex + index,
        job_id: jobId
      };

      headers.forEach((header, colIndex) => {
        const mappedColumn = columnMapping[header];
        if (mappedColumn) {
          const value = row[colIndex];
          mappedRow[mappedColumn] = isNumericField(mappedColumn)
            ? parseNumericValue(value)
            : value;
        }
      });

      return mappedRow;
    });

    // Process in smaller chunks to avoid memory issues
    for (let i = 0; i < mappedRows.length; i += CONFIG.BATCH_SIZE) {
      const chunk = mappedRows.slice(i, i + CONFIG.BATCH_SIZE);
      let retries = 0;

      while (retries < CONFIG.MAX_RETRIES) {
        try {
          const { error } = await supabase
            .from(tableName)
            .upsert(chunk, {
              onConflict: getPrimaryKeyFields(tableName).join(',')
            });

          if (error) throw error;

          successCount += chunk.length;
          break;
        } catch (error) {
          console.error(`Error processing chunk ${i}:`, error);
          retries++;

          if (retries === CONFIG.MAX_RETRIES) {
            errorCount += chunk.length;
          } else {
            await delay(CONFIG.RETRY_DELAY);
          }
        }
      }

      // Log progress periodically
      const now = Date.now();
      if (now - lastProgressLog >= CONFIG.PROGRESS_INTERVAL) {
        console.log(`Progress: ${((i + chunk.length) / mappedRows.length * 100).toFixed(2)}%`);
        lastProgressLog = now;
      }
    }

    return {
      errorCount,
      successCount,
      lastProcessedIndex: startIndex + rows.length - 1
    };
  } catch (error) {
    console.error('Batch processing error:', error);
    return {
      errorCount: rows.length,
      successCount: 0,
      lastProcessedIndex: startIndex - 1
    };
  }
};