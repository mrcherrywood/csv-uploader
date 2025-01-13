import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { processBatch } from './utils/batch-processor';

type TableNames = keyof Database['public']['Tables'];

interface ImportHandlerProps {
  previewData: {
    headers: string[];
    rows: string[][];
  };
  selectedTable: TableNames;
  columnMapping: Record<string, string>;
}

export const ImportHandler = ({ 
  previewData, 
  selectedTable, 
  columnMapping 
}: ImportHandlerProps) => {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [currentChunk, setCurrentChunk] = useState<{
    rows: string[][];
    headers: string[];
  } | null>(null);
  const { toast } = useToast();

  // Debug preview data
  useEffect(() => {
    console.log('Preview data received:', {
      hasData: !!previewData,
      headers: previewData?.headers?.length,
      rows: previewData?.rows?.length,
      currentChunk: currentChunk?.rows?.length,
      totalRows: totalRowCount
    });
  }, [previewData]);

  // Handle incoming preview data
  useEffect(() => {
    if (!previewData) return;

    const { rows, headers } = previewData;
    console.log('Processing preview chunk:', {
      rows: rows.length,
      headers: headers.length,
      isImporting
    });

    // Update current chunk
    setCurrentChunk({ rows, headers });
    
    // Update total row count
    setTotalRowCount(prev => prev + rows.length);
  }, [previewData]);

  const handleImport = async () => {
    if (!selectedTable || !columnMapping || !currentChunk) {
      console.error('Missing required data:', {
        hasTable: !!selectedTable,
        hasMapping: !!columnMapping,
        hasChunk: !!currentChunk
      });
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Missing required data for import',
      });
      return;
    }

    if (totalRowCount === 0) {
      console.error('No rows to import');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No rows to import',
      });
      return;
    }

    console.log('Starting import:', {
      table: selectedTable,
      totalRows: totalRowCount,
      currentChunkSize: currentChunk.rows.length,
      mappingKeys: Object.keys(columnMapping)
    });

    setIsImporting(true);
    setProgress(0);
    setProcessedCount(0);

    let totalErrorCount = 0;
    let totalSuccessCount = 0;
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data: job, error: jobError } = await supabase
        .from('upload_jobs')
        .insert({
          file_type: 'csv',
          file_name: `${selectedTable}_import`,
          status: 'processing',
          start_time: new Date().toISOString(),
          created_by: user?.id,
          total_rows: totalRowCount
        })
        .select()
        .single();

      if (jobError) throw jobError;

      console.log('Created import job:', {
        jobId: job.job_id,
        totalRows: totalRowCount
      });

      const progressToast = toast({
        title: 'Import Progress',
        description: 'Starting import...',
        duration: Infinity,
      });

      // Process the current chunk
      if (currentChunk.rows.length > 0) {
        const { errorCount: chunkErrorCount, successCount: chunkSuccessCount } = await processBatch(
          currentChunk.rows,
          currentChunk.headers,
          columnMapping,
          selectedTable,
          job.job_id,
          processedCount
        );

        console.log('Chunk processing result:', {
          errorCount: chunkErrorCount,
          successCount: chunkSuccessCount,
          totalBefore: processedCount,
          totalAfter: processedCount + chunkSuccessCount,
          rowsProcessed: currentChunk.rows.length
        });

        totalErrorCount += chunkErrorCount;
        totalSuccessCount += chunkSuccessCount;
        const newProcessedCount = processedCount + currentChunk.rows.length;
        setProcessedCount(newProcessedCount);

        const currentProgress = Math.round((newProcessedCount / totalRowCount) * 100);
        setProgress(currentProgress);

        toast({
          id: progressToast,
          title: 'Import Progress',
          description: `Processed ${newProcessedCount.toLocaleString()} of ${totalRowCount.toLocaleString()} rows (${currentProgress}%)`,
          duration: Infinity,
        });
      }

      // Update job on completion
      const { error: updateError } = await supabase
        .from('upload_jobs')
        .update({
          status: totalErrorCount > 0 ? 'completed_with_errors' : 'completed',
          end_time: new Date().toISOString(),
          error_count: totalErrorCount,
          success_count: totalSuccessCount,
          total_rows: processedCount
        })
        .eq('job_id', job.job_id);

      if (updateError) throw updateError;

      console.log('Import complete:', {
        totalRows: totalRowCount,
        processed: processedCount,
        errors: totalErrorCount,
        successes: totalSuccessCount
      });

      toast({
        title: 'Import Complete',
        description: `Successfully processed ${totalSuccessCount.toLocaleString()} rows with ${totalErrorCount.toLocaleString()} errors.`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        variant: 'destructive',
        title: 'Import Failed',
        description: error.message,
      });
    } finally {
      setIsImporting(false);
      setProgress(0);
    }
  };

  const showImportButton = selectedTable && 
    columnMapping && 
    Object.keys(columnMapping).length > 0 && 
    totalRowCount > 0;

  console.log('Render state:', {
    showImportButton,
    hasTable: !!selectedTable,
    hasMapping: !!columnMapping,
    mappingKeys: columnMapping ? Object.keys(columnMapping) : [],
    rowCount: totalRowCount,
    isImporting
  });

  return (
    <div className="w-full max-w-xl mx-auto mt-8">
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold">Import Data</h3>
          </div>
          {isImporting && (
            <div className="text-sm text-gray-500">
              {progress}% complete
            </div>
          )}
        </div>

        <div className="mb-4 text-sm text-gray-600">
          {totalRowCount > 0 && (
            <p>Ready to import {totalRowCount.toLocaleString()} rows</p>
          )}
          {!selectedTable && (
            <p className="text-amber-600">Please select a table</p>
          )}
          {!columnMapping && (
            <p className="text-amber-600">Please map columns</p>
          )}
        </div>

        {showImportButton && (
          <Button
            className="w-full"
            disabled={isImporting}
            onClick={handleImport}
          >
            {isImporting ? 'Importing...' : 'Start Import'}
          </Button>
        )}
      </div>
    </div>
  );
};