import type { Json } from './common';
import type { BeneficiaryTypes } from './beneficiary';

export interface Database {
  public: {
    Tables: {
      basic_formulary: {
        Row: {
          contract_year: string | null
          created_at: string | null
          formulary_id: string
          formulary_version: string | null
          ndc: string | null
          prior_authorization_yn: string | null
          quantity_limit_amount: string | null
          quantity_limit_days: string | null
          quantity_limit_yn: string | null
          rxcui: string
          step_therapy_yn: string | null
          tier_level_value: string | null
          updated_at: string | null
        }
        Insert: {
          contract_year?: string | null
          created_at?: string | null
          formulary_id: string
          formulary_version?: string | null
          ndc?: string | null
          prior_authorization_yn?: string | null
          quantity_limit_amount?: string | null
          quantity_limit_days?: string | null
          quantity_limit_yn?: string | null
          rxcui: string
          step_therapy_yn?: string | null
          tier_level_value?: string | null
          updated_at?: string | null
        }
        Update: {
          contract_year?: string | null
          created_at?: string | null
          formulary_id?: string
          formulary_version?: string | null
          ndc?: string | null
          prior_authorization_yn?: string | null
          quantity_limit_amount?: string | null
          quantity_limit_days?: string | null
          quantity_limit_yn?: string | null
          rxcui?: string
          step_therapy_yn?: string | null
          tier_level_value?: string | null
          updated_at?: string | null
        }
      }
      basic_formulary_staging: {
        Row: {
          contract_year: string | null
          created_at: string | null
          formulary_id: string | null
          formulary_version: string | null
          id: number
          ndc: string | null
          prior_authorization_yn: string | null
          processed: boolean | null
          quantity_limit_amount: string | null
          quantity_limit_days: string | null
          quantity_limit_yn: string | null
          rxcui: string | null
          step_therapy_yn: string | null
          tier_level_value: string | null
          updated_at: string | null
        }
        Insert: {
          contract_year?: string | null
          created_at?: string | null
          formulary_id?: string | null
          formulary_version?: string | null
          id?: number
          ndc?: string | null
          prior_authorization_yn?: string | null
          processed?: boolean | null
          quantity_limit_amount?: string | null
          quantity_limit_days?: string | null
          quantity_limit_yn?: string | null
          rxcui?: string | null
          step_therapy_yn?: string | null
          tier_level_value?: string | null
          updated_at?: string | null
        }
        Update: {
          contract_year?: string | null
          created_at?: string | null
          formulary_id?: string | null
          formulary_version?: string | null
          id?: number
          ndc?: string | null
          prior_authorization_yn?: string | null
          processed?: boolean | null
          quantity_limit_amount?: string | null
          quantity_limit_days?: string | null
          quantity_limit_yn?: string | null
          rxcui?: string | null
          step_therapy_yn?: string | null
          tier_level_value?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      beneficiary_cost: BeneficiaryTypes['Tables']['beneficiary_cost']
      csv_processing_errors: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          job_id: string | null
          row_data: Json | null
          row_number: number | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          job_id?: string | null
          row_data?: Json | null
          row_number?: number | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          job_id?: string | null
          row_data?: Json | null
          row_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "csv_processing_errors_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "upload_jobs"
            referencedColumns: ["job_id"]
          }
        ]
      }
      excluded_drugs_formulary: {
        Row: {
          contract_id: string
          contract_year: number
          created_at: string | null
          drug_name: string | null
          plan_id: string
          rxcui: string
          updated_at: string | null
        }
        Insert: {
          contract_id: string
          contract_year: number
          created_at?: string | null
          drug_name?: string | null
          plan_id: string
          rxcui: string
          updated_at?: string | null
        }
        Update: {
          contract_id?: string
          contract_year?: number
          created_at?: string | null
          drug_name?: string | null
          plan_id?: string
          rxcui?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      geographic_locator: {
        Row: {
          contract_year: number
          county_code: string
          county_name: string | null
          created_at: string | null
          ma_region_code: string
          pdp_region_code: string
          state_code: string | null
          updated_at: string | null
        }
        Insert: {
          contract_year: number
          county_code: string
          county_name?: string | null
          created_at?: string | null
          ma_region_code: string
          pdp_region_code: string
          state_code?: string | null
          updated_at?: string | null
        }
        Update: {
          contract_year?: number
          county_code?: string
          county_name?: string | null
          created_at?: string | null
          ma_region_code?: string
          pdp_region_code?: string
          state_code?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ibc_formulary: {
        Row: {
          contract_id: string
          contract_year: number
          created_at: string | null
          drug_name: string | null
          indication: string
          plan_id: string
          rxcui: string
          tier_level: string | null
          updated_at: string | null
        }
        Insert: {
          contract_id: string
          contract_year: number
          created_at?: string | null
          drug_name?: string | null
          indication: string
          plan_id: string
          rxcui: string
          tier_level?: string | null
          updated_at?: string | null
        }
        Update: {
          contract_id?: string
          contract_year?: number
          created_at?: string | null
          drug_name?: string | null
          indication?: string
          plan_id?: string
          rxcui?: string
          tier_level?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      insulin_beneficiary_cost: {
        Row: {
          contract_id: string
          contract_year: number
          cost_amount: number | null
          cost_type: string | null
          coverage_phase: string
          created_at: string | null
          plan_id: string
          segment_id: string
          tier: string
          updated_at: string | null
        }
        Insert: {
          contract_id: string
          contract_year: number
          cost_amount?: number | null
          cost_type?: string | null
          coverage_phase: string
          created_at?: string | null
          plan_id: string
          segment_id: string
          tier: string
          updated_at?: string | null
        }
        Update: {
          contract_id?: string
          contract_year?: number
          cost_amount?: number | null
          cost_type?: string | null
          coverage_phase?: string
          created_at?: string | null
          plan_id?: string
          segment_id?: string
          tier?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pharmacy_networks: {
        Row: {
          brand_dispensing_fee_30: string | null
          brand_dispensing_fee_60: string | null
          brand_dispensing_fee_90: string | null
          contract_id: string
          created_at: string | null
          generic_dispensing_fee_30: string | null
          generic_dispensing_fee_60: string | null
          generic_dispensing_fee_90: string | null
          in_area_flag: string | null
          pharmacy_mail: string | null
          pharmacy_number: string
          pharmacy_retail: string | null
          pharmacy_zipcode: string | null
          plan_id: string
          preferred_status_mail: string | null
          preferred_status_retail: string | null
          segment_id: string
          updated_at: string | null
        }
        Insert: {
          brand_dispensing_fee_30?: string | null
          brand_dispensing_fee_60?: string | null
          brand_dispensing_fee_90?: string | null
          contract_id: string
          created_at?: string | null
          generic_dispensing_fee_30?: string | null
          generic_dispensing_fee_60?: string | null
          generic_dispensing_fee_90?: string | null
          in_area_flag?: string | null
          pharmacy_mail?: string | null
          pharmacy_number: string
          pharmacy_retail?: string | null
          pharmacy_zipcode?: string | null
          plan_id: string
          preferred_status_mail?: string | null
          preferred_status_retail?: string | null
          segment_id: string
          updated_at?: string | null
        }
        Update: {
          brand_dispensing_fee_30?: string | null
          brand_dispensing_fee_60?: string | null
          brand_dispensing_fee_90?: string | null
          contract_id?: string
          created_at?: string | null
          generic_dispensing_fee_30?: string | null
          generic_dispensing_fee_60?: string | null
          generic_dispensing_fee_90?: string | null
          in_area_flag?: string | null
          pharmacy_mail?: string | null
          pharmacy_number?: string
          pharmacy_retail?: string | null
          pharmacy_zipcode?: string | null
          plan_id?: string
          preferred_status_mail?: string | null
          preferred_status_retail?: string | null
          segment_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      plan_information: {
        Row: {
          contract_id: string
          contract_year: number
          created_at: string | null
          formulary_id: string | null
          organization_name: string | null
          plan_id: string
          plan_name: string | null
          segment_id: string
          updated_at: string | null
        }
        Insert: {
          contract_id: string
          contract_year: number
          created_at?: string | null
          formulary_id?: string | null
          organization_name?: string | null
          plan_id: string
          plan_name?: string | null
          segment_id: string
          updated_at?: string | null
        }
        Update: {
          contract_id?: string
          contract_year?: number
          created_at?: string | null
          formulary_id?: string | null
          organization_name?: string | null
          plan_id?: string
          plan_name?: string | null
          segment_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      table_schemas: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          schema: Json
          table_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          schema: Json
          table_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          schema?: Json
          table_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      upload_jobs: {
        Row: {
          created_at: string | null
          created_by: string
          end_time: string | null
          error_count: number | null
          file_name: string
          file_type: string
          job_id: string
          start_time: string
          status: string
          total_rows: number | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          end_time?: string | null
          error_count?: number | null
          file_name: string
          file_type: string
          job_id?: string
          start_time: string
          status: string
          total_rows?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          end_time?: string | null
          error_count?: number | null
          file_name?: string
          file_type?: string
          job_id?: string
          start_time?: string
          status?: string
          total_rows?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_cost_tier_analysis: {
        Args: Record<PropertyKey, never>
        Returns: {
          tiercostdistribution: Json
          costtrends: Json
          topcostlydrugs: Json
        }[]
      }
      get_coverage_analysis: {
        Args: Record<PropertyKey, never>
        Returns: {
          totalcovereddrugs: number
          totalexcludeddrugs: number
          coveragebyregion: Json
          topexcludeddrugs: Json
        }[]
      }
      get_drug_category_analysis: {
        Args: Record<PropertyKey, never>
        Returns: {
          categorydistribution: Json
          topcategories: Json
        }[]
      }
      get_formulary_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          totalformularies: number
          totaldrugs: number
          uniquecontracts: number
          uniqueplans: number
          tierdistribution: Json
        }[]
      }
      get_temporal_analysis: {
        Args: Record<PropertyKey, never>
        Returns: {
          coveragehistory: Json
          seasonalpatterns: Json
          changefrequency: Json
        }[]
      }
      process_formulary_staging: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
