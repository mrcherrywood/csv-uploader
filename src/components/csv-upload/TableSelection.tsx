import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Database } from '@/integrations/supabase/types';
import { Button } from "@/components/ui/button";
import { Database as DatabaseIcon } from "lucide-react";

type TableNames = keyof Database['public']['Tables'];

interface TableSelectionProps {
  headers: string[];
  onTableSelect: (tableName: TableNames) => void;
}

export const TableSelection = ({ headers, onTableSelect }: TableSelectionProps) => {
  const tables: TableNames[] = [
    'basic_formulary',
    'beneficiary_cost',
    'excluded_drugs_formulary',
    'geographic_locator',
    'ibc_formulary',
    'insulin_beneficiary_cost',
    'pharmacy_networks',
    'plan_information'
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="flex items-center gap-4 p-6 border rounded-lg bg-white">
        <DatabaseIcon className="h-5 w-5 text-gray-500" />
        <div className="flex-1">
          <Select onValueChange={onTableSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select target table" />
            </SelectTrigger>
            <SelectContent>
              {tables.map((table) => (
                <SelectItem key={table} value={table}>
                  {table.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};