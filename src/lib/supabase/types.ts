export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admin_whitelist: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      branches: {
        Row: {
          id: string;
          name: string;
          slug: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ratings: {
        Row: {
          id: string;
          rating: number;
          comment: string | null;
          branch_id: string;
          device_id: string;
          ip_hash: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          rating: number;
          comment?: string | null;
          branch_id: string;
          device_id: string;
          ip_hash: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          rating?: number;
          comment?: string | null;
          branch_id?: string;
          device_id?: string;
          ip_hash?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type RatingInsert = Database["public"]["Tables"]["ratings"]["Insert"];
export type RatingRow = Database["public"]["Tables"]["ratings"]["Row"];
export type BranchInsert = Database["public"]["Tables"]["branches"]["Insert"];
export type BranchRow = Database["public"]["Tables"]["branches"]["Row"];
