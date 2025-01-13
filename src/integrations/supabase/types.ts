export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        Relationships: []
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
      beneficiary_cost: {
        Row: {
          contract_id: string
          cost_amt_mail_nonpref: number | null
          cost_amt_mail_pref: number | null
          cost_amt_nonpref: number | null
          cost_amt_pref: number | null
          cost_max_amt_mail_nonpref: number | null
          cost_max_amt_mail_pref: number | null
          cost_max_amt_nonpref: number | null
          cost_max_amt_pref: number | null
          cost_min_amt_mail_nonpref: number | null
          cost_min_amt_mail_pref: number | null
          cost_min_amt_nonpref: number | null
          cost_min_amt_pref: number | null
          cost_type_mail_nonpref: string | null
          cost_type_mail_pref: string | null
          cost_type_nonpref: string | null
          cost_type_pref: string | null
          coverage_level: string
          created_at: string | null
          days_supply: number
          ded_applies_yn: string | null
          plan_id: string
          segment_id: string
          tier: string
          tier_specialty_yn: string | null
          updated_at: string | null
        }
        Insert: {
          contract_id: string
          cost_amt_mail_nonpref?: number | null
          cost_amt_mail_pref?: number | null
          cost_amt_nonpref?: number | null
          cost_amt_pref?: number | null
          cost_max_amt_mail_nonpref?: number | null
          cost_max_amt_mail_pref?: number | null
          cost_max_amt_nonpref?: number | null
          cost_max_amt_pref?: number | null
          cost_min_amt_mail_nonpref?: number | null
          cost_min_amt_mail_pref?: number | null
          cost_min_amt_nonpref?: number | null
          cost_min_amt_pref?: number | null
          cost_type_mail_nonpref?: string | null
          cost_type_mail_pref?: string | null
          cost_type_nonpref?: string | null
          cost_type_pref?: string | null
          coverage_level: string
          created_at?: string | null
          days_supply: number
          ded_applies_yn?: string | null
          plan_id: string
          segment_id: string
          tier: string
          tier_specialty_yn?: string | null
          updated_at?: string | null
        }
        Update: {
          contract_id?: string
          cost_amt_mail_nonpref?: number | null
          cost_amt_mail_pref?: number | null
          cost_amt_nonpref?: number | null
          cost_amt_pref?: number | null
          cost_max_amt_mail_nonpref?: number | null
          cost_max_amt_mail_pref?: number | null
          cost_max_amt_nonpref?: number | null
          cost_max_amt_pref?: number | null
          cost_min_amt_mail_nonpref?: number | null
          cost_min_amt_mail_pref?: number | null
          cost_min_amt_nonpref?: number | null
          cost_min_amt_pref?: number | null
          cost_type_mail_nonpref?: string | null
          cost_type_mail_pref?: string | null
          cost_type_nonpref?: string | null
          cost_type_pref?: string | null
          coverage_level?: string
          created_at?: string | null
          days_supply?: number
          ded_applies_yn?: string | null
          plan_id?: string
          segment_id?: string
          tier?: string
          tier_specialty_yn?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
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
          },
        ]
      }
      excluded_drugs_formulary: {
        Row: {
          capped_benefit_yn: string | null
          contract_id: string
          created_at: string | null
          plan_id: string
          prior_auth_yn: string | null
          quantity_limit_amount: string | null
          quantity_limit_days: string | null
          quantity_limit_yn: string | null
          rxcui: string
          step_therapy_yn: string | null
          tier: string | null
          updated_at: string | null
        }
        Insert: {
          capped_benefit_yn?: string | null
          contract_id: string
          created_at?: string | null
          plan_id: string
          prior_auth_yn?: string | null
          quantity_limit_amount?: string | null
          quantity_limit_days?: string | null
          quantity_limit_yn?: string | null
          rxcui: string
          step_therapy_yn?: string | null
          tier?: string | null
          updated_at?: string | null
        }
        Update: {
          capped_benefit_yn?: string | null
          contract_id?: string
          created_at?: string | null
          plan_id?: string
          prior_auth_yn?: string | null
          quantity_limit_amount?: string | null
          quantity_limit_days?: string | null
          quantity_limit_yn?: string | null
          rxcui?: string
          step_therapy_yn?: string | null
          tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      geographic_locator: {
        Row: {
          county: string | null
          county_code: string
          created_at: string | null
          ma_region: string | null
          ma_region_code: string
          pdp_region: string | null
          pdp_region_code: string
          statename: string | null
          updated_at: string | null
        }
        Insert: {
          county?: string | null
          county_code: string
          created_at?: string | null
          ma_region?: string | null
          ma_region_code: string
          pdp_region?: string | null
          pdp_region_code: string
          statename?: string | null
          updated_at?: string | null
        }
        Update: {
          county?: string | null
          county_code?: string
          created_at?: string | null
          ma_region?: string | null
          ma_region_code?: string
          pdp_region?: string | null
          pdp_region_code?: string
          statename?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ibc_formulary: {
        Row: {
          contract_id: string
          created_at: string | null
          disease: string
          plan_id: string
          rxcui: string
          updated_at: string | null
        }
        Insert: {
          contract_id: string
          created_at?: string | null
          disease: string
          plan_id: string
          rxcui: string
          updated_at?: string | null
        }
        Update: {
          contract_id?: string
          created_at?: string | null
          disease?: string
          plan_id?: string
          rxcui?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      insulin_beneficiary_cost: {
        Row: {
          contract_id: string
          copay_amt_mail_nonpref_insln: number | null
          copay_amt_mail_pref_insln: number | null
          copay_amt_nonpref_insln: number | null
          copay_amt_pref_insln: number | null
          created_at: string | null
          days_supply: number
          plan_id: string
          segment_id: string
          tier: string
          updated_at: string | null
        }
        Insert: {
          contract_id: string
          copay_amt_mail_nonpref_insln?: number | null
          copay_amt_mail_pref_insln?: number | null
          copay_amt_nonpref_insln?: number | null
          copay_amt_pref_insln?: number | null
          created_at?: string | null
          days_supply: number
          plan_id: string
          segment_id: string
          tier: string
          updated_at?: string | null
        }
        Update: {
          contract_id?: string
          copay_amt_mail_nonpref_insln?: number | null
          copay_amt_mail_pref_insln?: number | null
          copay_amt_nonpref_insln?: number | null
          copay_amt_pref_insln?: number | null
          created_at?: string | null
          days_supply?: number
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
          contract_name: string | null
          county_code: string | null
          created_at: string | null
          deductible: number | null
          formulary_id: string | null
          ma_region_code: string | null
          pdp_region_code: string | null
          plan_id: string
          plan_name: string | null
          plan_suppressed_yn: string | null
          premium: number | null
          segment_id: string
          snp: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          contract_id: string
          contract_name?: string | null
          county_code?: string | null
          created_at?: string | null
          deductible?: number | null
          formulary_id?: string | null
          ma_region_code?: string | null
          pdp_region_code?: string | null
          plan_id: string
          plan_name?: string | null
          plan_suppressed_yn?: string | null
          premium?: number | null
          segment_id: string
          snp?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          contract_id?: string
          contract_name?: string | null
          county_code?: string | null
          created_at?: string | null
          deductible?: number | null
          formulary_id?: string | null
          ma_region_code?: string | null
          pdp_region_code?: string | null
          plan_id?: string
          plan_name?: string | null
          plan_suppressed_yn?: string | null
          premium?: number | null
          segment_id?: string
          snp?: string | null
          state?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
