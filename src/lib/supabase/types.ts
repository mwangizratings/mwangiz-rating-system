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
      ratings: {
        Row: {
          id: string;
          rating: number;
          comment: string | null;
          device_id: string;
          ip_hash: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          rating: number;
          comment?: string | null;
          device_id: string;
          ip_hash: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          rating?: number;
          comment?: string | null;
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
