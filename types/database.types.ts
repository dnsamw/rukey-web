// Auto-generated types from Supabase
// Run: npx supabase gen types typescript --local > lib/database.types.ts

export type Database = {
  public: {
    Tables: {
      hero_slides: {
        Row: {
          id: string;
          title: string;
          description: string;
          image_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          image_url: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          image_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
