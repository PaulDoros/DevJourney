export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      achievements: {
        Row: {
          id: string;
          name: string;
          description: string;
          points: number;
          icon_url: string | null;
          preset_avatar_id: string | null;
          created_at: string;
          component_id: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          points: number;
          icon_url?: string | null;
          preset_avatar_id?: string | null;
          created_at?: string;
          component_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          points?: number;
          icon_url?: string | null;
          preset_avatar_id?: string | null;
          created_at?: string;
          component_id?: string | null;
        };
      };
      // Add other tables as needed
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
