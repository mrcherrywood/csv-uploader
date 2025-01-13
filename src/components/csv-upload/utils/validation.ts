import type { Database } from '@/integrations/supabase/types';

type TableNames = keyof Database['public']['Tables'];

const validateNumericField = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  const num = Number(value);
  return !isNaN(num);
};

export const validateRecord = (table: TableNames, record: Record<string, any>) => {
  const requiredFields: Record<TableNames, string[]> = {
    basic_formulary: ['formulary_id', 'rxcui'],
    basic_formulary_staging: [],
    beneficiary_cost: [
      'contract_id',
      'plan_id',
      'segment_id',
      'coverage_level',
      'tier',
      'days_supply'
    ],
    csv_processing_errors: [],
    excluded_drugs_formulary: ['contract_id', 'plan_id', 'rxcui'],
    geographic_locator: ['ma_region_code', 'pdp_region_code', 'county_code'],
    ibc_formulary: ['contract_id', 'plan_id', 'rxcui', 'indication'],
    insulin_beneficiary_cost: ['contract_id', 'plan_id', 'segment_id', 'tier', 'coverage_phase'],
    pharmacy_networks: ['contract_id', 'plan_id', 'segment_id', 'pharmacy_number'],
    plan_information: ['contract_id', 'plan_id', 'segment_id'],
    table_schemas: ['table_name', 'schema'],
    upload_jobs: ['file_name', 'file_type', 'status', 'start_time', 'created_by'],
    user_roles: ['user_id', 'role']
  };

  // Additional validation for numeric fields in beneficiary_cost
  const numericValidation = table === 'beneficiary_cost' ? {
    days_supply: (value: any) => validateNumericField(value),
    cost_amt_pref: (value: any) => value === null || validateNumericField(value),
    cost_min_amt_pref: (value: any) => value === null || validateNumericField(value),
    cost_max_amt_pref: (value: any) => value === null || validateNumericField(value),
    cost_amt_nonpref: (value: any) => value === null || validateNumericField(value),
    cost_min_amt_nonpref: (value: any) => value === null || validateNumericField(value),
    cost_max_amt_nonpref: (value: any) => value === null || validateNumericField(value),
    cost_amt_mail_pref: (value: any) => value === null || validateNumericField(value),
    cost_min_amt_mail_pref: (value: any) => value === null || validateNumericField(value),
    cost_max_amt_mail_pref: (value: any) => value === null || validateNumericField(value),
    cost_amt_mail_nonpref: (value: any) => value === null || validateNumericField(value),
    cost_min_amt_mail_nonpref: (value: any) => value === null || validateNumericField(value),
    cost_max_amt_mail_nonpref: (value: any) => value === null || validateNumericField(value)
  } : {};

  const missingFields = requiredFields[table].filter(field => {
    const value = record[field];
    return !value || value.toString().trim() === '';
  });

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Validate numeric fields if they exist in the record
  if (table === 'beneficiary_cost') {
    Object.entries(numericValidation).forEach(([field, validator]) => {
      if (field in record && !validator(record[field])) {
        throw new Error(`Invalid numeric value for field: ${field}`);
      }
    });
  }

  return record;
};