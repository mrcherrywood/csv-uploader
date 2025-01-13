import type { Json } from './common';

export interface BeneficiaryCost {
  contract_id: string;
  plan_id: string;
  segment_id: string;
  coverage_level: string;
  tier: string;
  days_supply: number;
  cost_type_pref: string | null;
  cost_amt_pref: number | null;
  cost_min_amt_pref: number | null;
  cost_max_amt_pref: number | null;
  cost_type_nonpref: string | null;
  cost_amt_nonpref: number | null;
  cost_min_amt_nonpref: number | null;
  cost_max_amt_nonpref: number | null;
  cost_type_mail_pref: string | null;
  cost_amt_mail_pref: number | null;
  cost_min_amt_mail_pref: number | null;
  cost_max_amt_mail_pref: number | null;
  cost_type_mail_nonpref: string | null;
  cost_amt_mail_nonpref: number | null;
  cost_min_amt_mail_nonpref: number | null;
  cost_max_amt_mail_nonpref: number | null;
  tier_specialty_yn: string | null;
  ded_applies_yn: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Export types related to beneficiary functionality
export interface BeneficiaryTypes {
  Tables: {
    beneficiary_cost: {
      Row: BeneficiaryCost;
      Insert: Omit<BeneficiaryCost, 'created_at' | 'updated_at'>;
      Update: Partial<Omit<BeneficiaryCost, 'created_at' | 'updated_at'>>;
    }
  }
}