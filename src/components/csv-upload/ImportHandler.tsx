import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

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

  // Handle incoming preview data
  useEffect(() => {
    if (!previewData) return;

    const { rows, headers } = previewData;
    console.log('Processing preview chunk:', {
      rows: rows.length,
      headers: headers.length,
      isImporting
    });

    setCurrentChunk({ rows, headers });
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

    setIsImporting(true);
    setProgress(0);
    setProcessedCount(0);

    try {
      // Convert rows to CSV format
      const csvContent = currentChunk.rows.map(row => row.join(',')).join('\n');
      const csvBlob = new Blob([currentChunk.headers.join(',') + '\n' + csvContent], { type: 'text/csv' });
      const formData = new FormData();
      formData.append('file', csvBlob, 'import.csv');
      formData.append('tableName', selectedTable);
      formData.append('columnMapping', JSON.stringify(columnMapping));

      const progressToast = toast({
        title: 'Import Progress',
        description: 'Starting import...',
        duration: Infinity,
      });

      // Get the base URL from environment or default to current origin
      const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
      
      // Send to server for processing
      const response = await fetch(`${baseUrl}/api/upload/process`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Import Complete',
          description: `Successfully processed ${result.successCount.toLocaleString()} rows with ${result.errorCount.toLocaleString()} errors.`,
          duration: 5000,
        });
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }

    } catch (error) {
      console.error('Import error:', error);
      toast({
        variant: 'destructive',
        title: 'Import Failed',
        description: error.message,
      });
    } finally {
      setIsImporting(false);
      setProgress(100);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Import Data</h3>
          <p className="text-sm text-gray-500">
            {totalRowCount > 0
              ? `Ready to import ${totalRowCount.toLocaleString()} rows`
              : 'No data to import'}
          </p>
        </div>
        <Button
          onClick={handleImport}
          disabled={isImporting || totalRowCount === 0}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          {isImporting ? 'Importing...' : 'Start Import'}
        </Button>
      </div>
      {isImporting && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};