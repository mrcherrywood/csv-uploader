import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MAX_FILE_SIZE = 6 * 1024 * 1024 * 1024; // 6GB in bytes
const CHUNK_SIZE = 1024 * 1024 * 10; // 10MB chunks

interface FileUploadProps {
  onFileAccepted: (file: File, chunkSize?: number) => void;
}

export const FileUpload = ({ onFileAccepted }: FileUploadProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) {
      setError('No file selected');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 6GB limit');
      return;
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Only CSV files are allowed');
      return;
    }

    setError(null);
    setUploadProgress(0);

    // Pass the chunk size to the handler
    onFileAccepted(file, CHUNK_SIZE);

    // Simulate upload progress based on file size
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 100);
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200 ease-in-out
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-primary'
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold">Drop your CSV file here</h3>
        <p className="mt-1 text-sm text-gray-500">
          or click to select a file (up to 6GB)
        </p>
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4">
          <Progress value={uploadProgress} className="w-full" />
          <p className="mt-2 text-sm text-gray-500 text-center">
            Processing... {uploadProgress}%
          </p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};