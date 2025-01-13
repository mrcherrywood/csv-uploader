import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

interface UploadHandlerProps {
  file: File;
  onPreviewData: (data: { headers: string[]; rows: string[][] }, isPreview: boolean) => void;
}

interface ProcessedData {
  headers: string[];
  rows: string[][];
}

export const UploadHandler = ({ file, onPreviewData }: UploadHandlerProps) => {
  const { toast } = useToast();
  const [processedChunks, setProcessedChunks] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFileInChunks = async (file: File): Promise<ProcessedData> => {
    return new Promise((resolve, reject) => {
      const headers: string[] = [];
      let totalRowsRead = 0;
      let totalValidRows = 0;
      let linesProcessed = 0;
      let lastProgressLog = Date.now();
      let chunkNumber = 0;
      let headersSent = false;

      // Chunk sizes optimized for 45M+ rows
      const CHUNK_SIZE = 128 * 1024 * 1024; // 128MB chunks
      const PREVIEW_CHUNK_SIZE = 100000; // 100k rows per preview
      const BATCH_SIZE = 10000; // Process 10k rows at a time
      let pendingRows: string[][] = [];
      let lastPreviewTime = Date.now();

      // Function to process pending rows
      const processPendingRows = async (force = false) => {
        const now = Date.now();
        // Only send preview every 2 seconds unless forced
        if (!force && now - lastPreviewTime < 2000) return;
        if (pendingRows.length === 0) return;

        const rowsToSend = pendingRows.splice(0, PREVIEW_CHUNK_SIZE);
        try {
          console.log('Sending preview chunk:', {
            rows: rowsToSend.length,
            headers: headers.length,
            totalProcessed: linesProcessed,
            pendingCount: pendingRows.length
          });

          await onPreviewData({ 
            headers, 
            rows: rowsToSend 
          }, false);

          linesProcessed += rowsToSend.length;
          setProcessedChunks(prev => prev + 1);
          lastPreviewTime = now;
        } catch (error) {
          console.error('Error sending preview data:', error);
          // Put rows back in pending if preview fails
          pendingRows.unshift(...rowsToSend);
        }
      };

      Papa.parse(file, {
        header: false,
        worker: true,
        chunk: async (results) => {
          try {
            if (!results.data || !Array.isArray(results.data)) return;

            const rows = results.data as string[][];
            if (rows.length === 0) return;

            // Handle headers once
            if (!headersSent) {
              const headerRow = rows[0].map(header => String(header || '').trim());
              if (headerRow.some(header => header.length === 0)) {
                throw new Error('Empty header column found');
              }
              
              headers.push(...headerRow);
              rows.shift();
              headersSent = true;

              if (headers.length === 0) {
                throw new Error('No valid headers found in CSV file');
              }

              // Send initial preview immediately
              const preview = rows.slice(0, 5)
                .filter(row => row.length === headers.length)
                .map(row => row.map(cell => String(cell ?? '').trim()));
              
              if (preview.length > 0) {
                console.log('Sending initial preview:', {
                  rows: preview.length,
                  headers: headers.length
                });

                await onPreviewData({ 
                  headers, 
                  rows: preview 
                }, true);
                lastPreviewTime = Date.now();
              }
            }

            // Process rows in batches
            for (let i = 0; i < rows.length; i += BATCH_SIZE) {
              const batch = rows.slice(i, i + BATCH_SIZE);
              const validRows = batch.reduce((acc, row) => {
                if (row.length === headers.length && row.some(cell => cell?.trim().length > 0)) {
                  acc.push(row.map(cell => String(cell ?? '').trim()));
                }
                return acc;
              }, [] as string[][]);

              if (validRows.length === 0) continue;

              totalRowsRead += batch.length;
              totalValidRows += validRows.length;

              // Add to pending rows
              pendingRows.push(...validRows);

              // Process preview if we have enough rows
              if (pendingRows.length >= PREVIEW_CHUNK_SIZE) {
                await processPendingRows(true);
              }

              // Clear batch memory
              batch.length = 0;
            }

            // Try to send a preview update if enough time has passed
            await processPendingRows(false);

            // Log progress less frequently
            const now = Date.now();
            if (now - lastProgressLog > 5000) {
              const progress = Math.round((results.meta.cursor / file.size) * 100);
              const rowsPerSecond = Math.round(totalRowsRead / ((now - lastProgressLog) / 1000));
              console.log('Processing status:', {
                chunkNumber: chunkNumber++,
                processedRows: linesProcessed,
                totalValidRows,
                rowsPerSecond,
                fileProgress: `${progress}%`,
                pendingRows: pendingRows.length,
                memoryUsage: process.memoryUsage?.()?.heapUsed || 'unknown'
              });
              lastProgressLog = now;
            }

            // Clear processed arrays
            rows.length = 0;
          } catch (error) {
            console.error('Error in chunk processing:', error);
            reject(error);
          }
        },
        complete: async () => {
          try {
            // Process any remaining rows
            while (pendingRows.length > 0) {
              await processPendingRows(true);
            }
            
            console.log('Processing complete:', {
              totalChunks: chunkNumber,
              totalRowsRead,
              totalValidRows,
              linesProcessed,
              fileSize: file.size,
              timeElapsed: (Date.now() - lastProgressLog) / 1000
            });

            if (totalValidRows === 0) {
              reject(new Error('No valid rows found in CSV file'));
              return;
            }
            
            resolve({ headers, rows: [] });
          } catch (error) {
            console.error('Error in completion:', error);
            reject(error);
          } finally {
            // Clear all arrays
            pendingRows = [];
          }
        },
        error: (error) => {
          console.error('Papa Parse error:', error);
          reject(new Error(`Failed to parse CSV file: ${error.message}`));
        },
        skipEmptyLines: true,
        chunkSize: CHUNK_SIZE,
        dynamicTyping: false,
        fastMode: true
      });
    });
  };

  const handleFileUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProcessedChunks(0);

    try {
      const result = await processFileInChunks(file);
      console.log('File processing complete:', {
        headers: result.headers.length,
        processedChunks
      });
    } catch (error) {
      console.error('File processing error:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file]);

  return null;
};