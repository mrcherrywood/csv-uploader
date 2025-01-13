import { FileUpload } from '@/components/csv-upload/FileUpload';
import { CSVPreview } from '@/components/csv-upload/CSVPreview';
import { TableSelection } from '@/components/csv-upload/TableSelection';
import { ColumnMapping } from '@/components/csv-upload/ColumnMapping';
import { UploadHandler } from '@/components/csv-upload/UploadHandler';
import { ImportHandler } from '@/components/csv-upload/ImportHandler';
import { useState } from 'react';
import type { Database } from '@/integrations/supabase/types';

type TableNames = keyof Database['public']['Tables'];

const Index = () => {
  const [previewData, setPreviewData] = useState<{
    headers: string[];
    rows: string[][];
  } | null>(null);
  const [selectedTable, setSelectedTable] = useState<TableNames | null>(null);
  const [columnMapping, setColumnMapping] = useState<Record<string, string> | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [fullData, setFullData] = useState<{
    headers: string[];
    rows: string[][];
  } | null>(null);

  const handleFileAccepted = (file: File) => {
    console.log('File accepted:', file.name);
    setPreviewData(null);
    setSelectedTable(null);
    setColumnMapping(null);
    setFullData(null);
    setCurrentFile(file);
  };

  const handlePreviewData = (data: { headers: string[]; rows: string[][] }, isPreview: boolean) => {
    console.log(`Received ${isPreview ? 'preview' : 'full'} data:`, {
      headers: data.headers,
      rowCount: data.rows.length
    });
    
    if (isPreview) {
      setPreviewData(data);
    } else {
      console.log('Setting full data with rows:', data.rows.length);
      setFullData(data);
    }
  };

  const handleTableSelect = (tableName: TableNames) => {
    console.log('Table selected:', tableName);
    setSelectedTable(tableName);
    setColumnMapping(null);
  };

  const handleMappingComplete = (mapping: Record<string, string>) => {
    console.log('Mapping completed:', mapping);
    setColumnMapping(mapping);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        CSV File Upload & Processing
      </h1>
      
      <FileUpload onFileAccepted={handleFileAccepted} />
      
      {currentFile && (
        <UploadHandler
          key={currentFile.name}
          file={currentFile}
          onPreviewData={handlePreviewData}
        />
      )}
      
      {previewData && (
        <>
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <CSVPreview 
              headers={previewData.headers} 
              preview={previewData.rows} 
            />
          </div>
          
          <TableSelection 
            headers={previewData.headers}
            onTableSelect={handleTableSelect}
          />

          {selectedTable && !columnMapping && (
            <ColumnMapping
              csvHeaders={previewData.headers}
              selectedTable={selectedTable}
              onMappingComplete={handleMappingComplete}
            />
          )}

          {columnMapping && fullData && selectedTable && (
            <ImportHandler
              previewData={fullData}
              selectedTable={selectedTable}
              columnMapping={columnMapping}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Index;