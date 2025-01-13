import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Columns } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { suggestColumnMapping } from './utils/column-matcher';

type TableNames = keyof Database['public']['Tables'];

interface ColumnMappingProps {
  csvHeaders: string[];
  selectedTable: TableNames;
  onMappingComplete: (mapping: Record<string, string>) => void;
}

export const ColumnMapping = ({ 
  csvHeaders, 
  selectedTable, 
  onMappingComplete 
}: ColumnMappingProps) => {
  const [mapping, setMapping] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const getTableColumns = () => {
    try {
      const columns: Record<TableNames, string[]> = {
        basic_formulary: [
          'formulary_id',
          'formulary_version',
          'contract_year',
          'rxcui',
          'ndc',
          'tier_level_value',
          'quantity_limit_yn',
          'quantity_limit_amount',
          'quantity_limit_days',
          'prior_authorization_yn',
          'step_therapy_yn',
          'created_at',
          'updated_at'
        ],
        basic_formulary_staging: [
          'id',
          'formulary_id',
          'formulary_version',
          'contract_year',
          'rxcui',
          'ndc',
          'tier_level_value',
          'quantity_limit_yn',
          'quantity_limit_amount',
          'quantity_limit_days',
          'prior_authorization_yn',
          'step_therapy_yn',
          'processed',
          'created_at',
          'updated_at'
        ],
        beneficiary_cost: [
          'contract_id',
          'plan_id',
          'segment_id',
          'coverage_level',
          'tier',
          'days_supply',
          'cost_type_pref',
          'cost_amt_pref',
          'cost_min_amt_pref',
          'cost_max_amt_pref',
          'cost_type_nonpref',
          'cost_amt_nonpref',
          'cost_min_amt_nonpref',
          'cost_max_amt_nonpref',
          'cost_type_mail_pref',
          'cost_amt_mail_pref',
          'cost_min_amt_mail_pref',
          'cost_max_amt_mail_pref',
          'cost_type_mail_nonpref',
          'cost_amt_mail_nonpref',
          'cost_min_amt_mail_nonpref',
          'cost_max_amt_mail_nonpref',
          'tier_specialty_yn',
          'ded_applies_yn',
          'created_at',
          'updated_at'
        ],
        csv_processing_errors: [
          'id',
          'job_id',
          'row_number',
          'error_message',
          'row_data',
          'created_at'
        ],
        excluded_drugs_formulary: [
          'contract_id',
          'plan_id',
          'rxcui',
          'tier',
          'quantity_limit_yn',
          'quantity_limit_amount',
          'quantity_limit_days',
          'prior_auth_yn',
          'step_therapy_yn',
          'capped_benefit_yn',
          'created_at',
          'updated_at'
        ],
        geographic_locator: [
          'county_code',
          'statename',
          'county',
          'ma_region_code',
          'ma_region',
          'pdp_region_code',
          'pdp_region',
          'created_at',
          'updated_at'
        ],
        ibc_formulary: [
          'contract_id',
          'plan_id',
          'rxcui',
          'disease',
          'created_at',
          'updated_at'
        ],
        insulin_beneficiary_cost: [
          'contract_id',
          'plan_id',
          'segment_id',
          'tier',
          'days_supply',
          'copay_amt_pref_insln',
          'copay_amt_nonpref_insln',
          'copay_amt_mail_pref_insln',
          'copay_amt_mail_nonpref_insln',
          'created_at',
          'updated_at'
        ],
        pharmacy_networks: [
          'contract_id',
          'plan_id',
          'segment_id',
          'pharmacy_number',
          'pharmacy_zipcode',
          'preferred_status_retail',
          'preferred_status_mail',
          'pharmacy_retail',
          'pharmacy_mail',
          'in_area_flag',
          'brand_dispensing_fee_30',
          'brand_dispensing_fee_60',
          'brand_dispensing_fee_90',
          'generic_dispensing_fee_30',
          'generic_dispensing_fee_60',
          'generic_dispensing_fee_90',
          'created_at',
          'updated_at'
        ],
        plan_information: [
          'contract_id',
          'plan_id',
          'segment_id',
          'contract_name',
          'plan_name',
          'formulary_id',
          'premium',
          'deductible',
          'ma_region_code',
          'pdp_region_code',
          'state',
          'county_code',
          'snp',
          'plan_suppressed_yn',
          'created_at',
          'updated_at'
        ],
        table_schemas: [
          'id',
          'table_name',
          'schema',
          'created_at',
          'updated_at',
          'created_by'
        ],
        upload_jobs: [
          'job_id',
          'file_name',
          'file_type',
          'status',
          'start_time',
          'end_time',
          'total_rows',
          'error_count',
          'created_at',
          'created_by'
        ],
        user_roles: [
          'id',
          'user_id',
          'role',
          'created_at',
          'updated_at'
        ]
      };
      
      return columns[selectedTable] || [];
    } catch (error) {
      console.error('Error getting table columns:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load table columns',
      });
      return [];
    }
  };

  const tableColumns = getTableColumns();

  const formatColumnName = (name: string) => {
    // Split by common delimiters and capitalize each word
    return name
      .split(/[_|\s]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  React.useEffect(() => {
    // Auto-suggest mappings when component mounts or table changes
    const suggestedMapping = suggestColumnMapping(csvHeaders, tableColumns);
    setMapping(suggestedMapping);
    
    // Notify user about automatic mapping
    toast({
      title: "Column Mapping Suggested",
      description: "Mappings have been automatically suggested based on column names. Please review and adjust if needed.",
    });
  }, [csvHeaders, selectedTable]);

  const handleColumnSelect = (csvHeader: string, dbColumn: string) => {
    try {
      console.log(`Mapping ${csvHeader} to ${dbColumn}`);
      setMapping(prev => ({
        ...prev,
        [csvHeader]: dbColumn
      }));
    } catch (error) {
      console.error('Error selecting column:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to map column',
      });
    }
  };

  const handleSubmit = () => {
    try {
      setIsSubmitting(true);
      console.log('Column mapping submitted:', mapping);
      
      if (!Object.keys(mapping).length) {
        throw new Error('No columns mapped');
      }

      toast({
        title: "Column mapping confirmed",
        description: "Processing data import...",
      });
      
      onMappingComplete(mapping);
    } catch (error) {
      console.error('Error submitting mapping:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to submit column mapping',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = csvHeaders.every(header => mapping[header]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-4">
          <Columns className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Map CSV Columns to Database Fields</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {csvHeaders.map((header) => (
            <div key={header} className="flex flex-col space-y-2 p-4 border rounded-lg bg-white">
              <label className="text-sm font-medium text-gray-700 break-words">
                {formatColumnName(header)}
              </label>
              <Select
                value={mapping[header] || ''}
                onValueChange={(value) => handleColumnSelect(header, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue 
                    placeholder="Select database column"
                    className="truncate"
                  />
                </SelectTrigger>
                <SelectContent>
                  <div className="max-h-[300px] overflow-y-auto">
                    {tableColumns.map((column) => (
                      <SelectItem 
                        key={column} 
                        value={column}
                        className="truncate"
                      >
                        {truncateText(formatColumnName(column))}
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button 
            onClick={handleSubmit}
            disabled={!isComplete || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Confirming...' : 'Confirm Column Mapping'}
          </Button>
        </div>
      </div>
    </div>
  );
};
