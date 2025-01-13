export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Tables<T extends { schema: keyof Database }, TableName extends keyof Database[T["schema"]]["Tables"] = never> = 
  Database[T["schema"]]["Tables"][TableName] extends { Row: infer R }
    ? R
    : never;

export type TablesInsert<T extends { schema: keyof Database }, TableName extends keyof Database[T["schema"]]["Tables"] = never> = 
  Database[T["schema"]]["Tables"][TableName] extends { Insert: infer I }
    ? I
    : never;

export type TablesUpdate<T extends { schema: keyof Database }, TableName extends keyof Database[T["schema"]]["Tables"] = never> = 
  Database[T["schema"]]["Tables"][TableName] extends { Update: infer U }
    ? U
    : never;

// Import Database type but don't export it to avoid conflicts
import type { Database } from './schema';