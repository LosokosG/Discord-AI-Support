export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  graphql_public: {
    Tables: Record<never, never>;
    Views: Record<never, never>;
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
  public: {
    Tables: {
      analytics: {
        Row: {
          average_response_time: number | null;
          created_at: string;
          date: string;
          forwarded_tickets: number;
          id: string;
          resolved_queries: number;
          server_id: number;
          total_queries: number;
          updated_at: string;
        };
        Insert: {
          average_response_time?: number | null;
          created_at?: string;
          date: string;
          forwarded_tickets?: number;
          id?: string;
          resolved_queries?: number;
          server_id: number;
          total_queries?: number;
          updated_at?: string;
        };
        Update: {
          average_response_time?: number | null;
          created_at?: string;
          date?: string;
          forwarded_tickets?: number;
          id?: string;
          resolved_queries?: number;
          server_id?: number;
          total_queries?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "analytics_server_id_fkey";
            columns: ["server_id"];
            isOneToOne: false;
            referencedRelation: "servers";
            referencedColumns: ["id"];
          },
        ];
      };
      billing_plans: {
        Row: {
          created_at: string;
          currency: string;
          description: string | null;
          features: Json;
          id: string;
          interval: string;
          name: string;
          price: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          currency?: string;
          description?: string | null;
          features?: Json;
          id?: string;
          interval: string;
          name: string;
          price: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          currency?: string;
          description?: string | null;
          features?: Json;
          id?: string;
          interval?: string;
          name?: string;
          price?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          channel_id: string;
          completed_at: string | null;
          created_at: string;
          id: string;
          server_id: number;
          status: string;
          thread_id: string | null;
          transcript: Json;
          updated_at: string;
          user_id: string;
          username: string;
        };
        Insert: {
          channel_id: string;
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          server_id: number;
          status?: string;
          thread_id?: string | null;
          transcript: Json;
          updated_at?: string;
          user_id: string;
          username: string;
        };
        Update: {
          channel_id?: string;
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          server_id?: number;
          status?: string;
          thread_id?: string | null;
          transcript?: Json;
          updated_at?: string;
          user_id?: string;
          username?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conversations_server_id_fkey";
            columns: ["server_id"];
            isOneToOne: false;
            referencedRelation: "servers";
            referencedColumns: ["id"];
          },
        ];
      };
      forwarded_tickets: {
        Row: {
          assigned_to: string | null;
          conversation_id: string;
          forwarded_at: string;
          id: string;
          resolution_notes: string | null;
          resolved_at: string | null;
          server_id: number;
          status: string;
        };
        Insert: {
          assigned_to?: string | null;
          conversation_id: string;
          forwarded_at?: string;
          id?: string;
          resolution_notes?: string | null;
          resolved_at?: string | null;
          server_id: number;
          status?: string;
        };
        Update: {
          assigned_to?: string | null;
          conversation_id?: string;
          forwarded_at?: string;
          id?: string;
          resolution_notes?: string | null;
          resolved_at?: string | null;
          server_id?: number;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "forwarded_tickets_conversation_id_server_id_fkey";
            columns: ["conversation_id", "server_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id", "server_id"];
          },
          {
            foreignKeyName: "forwarded_tickets_server_id_fkey";
            columns: ["server_id"];
            isOneToOne: false;
            referencedRelation: "servers";
            referencedColumns: ["id"];
          },
        ];
      };
      invoices: {
        Row: {
          amount: number;
          created_at: string;
          currency: string;
          due_date: string;
          id: string;
          invoice_date: string;
          paid_at: string | null;
          payment_processor_id: string | null;
          server_id: number;
          status: string;
          subscription_id: string;
          updated_at: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          currency?: string;
          due_date: string;
          id?: string;
          invoice_date: string;
          paid_at?: string | null;
          payment_processor_id?: string | null;
          server_id: number;
          status: string;
          subscription_id: string;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          currency?: string;
          due_date?: string;
          id?: string;
          invoice_date?: string;
          paid_at?: string | null;
          payment_processor_id?: string | null;
          server_id?: number;
          status?: string;
          subscription_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_server_id_fkey";
            columns: ["server_id"];
            isOneToOne: false;
            referencedRelation: "servers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_subscription_id_fkey";
            columns: ["subscription_id"];
            isOneToOne: false;
            referencedRelation: "subscriptions";
            referencedColumns: ["id"];
          },
        ];
      };
      knowledge_documents: {
        Row: {
          content: string;
          content_vector: unknown | null;
          created_at: string;
          created_by: string | null;
          file_type: string;
          id: string;
          server_id: number;
          storage_path: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          content: string;
          content_vector?: unknown | null;
          created_at?: string;
          created_by?: string | null;
          file_type: string;
          id?: string;
          server_id: number;
          storage_path?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          content_vector?: unknown | null;
          created_at?: string;
          created_by?: string | null;
          file_type?: string;
          id?: string;
          server_id?: number;
          storage_path?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "knowledge_documents_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "knowledge_documents_server_id_fkey";
            columns: ["server_id"];
            isOneToOne: false;
            referencedRelation: "servers";
            referencedColumns: ["id"];
          },
        ];
      };
      server_admins: {
        Row: {
          created_at: string;
          server_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          server_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          server_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "server_admins_server_id_fkey";
            columns: ["server_id"];
            isOneToOne: false;
            referencedRelation: "servers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "server_admins_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      server_shards: {
        Row: {
          assigned_at: string;
          server_id: number;
          shard_id: number;
        };
        Insert: {
          assigned_at?: string;
          server_id: number;
          shard_id: number;
        };
        Update: {
          assigned_at?: string;
          server_id?: number;
          shard_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "server_shards_server_id_fkey";
            columns: ["server_id"];
            isOneToOne: true;
            referencedRelation: "servers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "server_shards_shard_id_fkey";
            columns: ["shard_id"];
            isOneToOne: false;
            referencedRelation: "shards";
            referencedColumns: ["id"];
          },
        ];
      };
      servers: {
        Row: {
          active: boolean;
          config: Json;
          created_at: string;
          icon_url: string | null;
          id: number;
          name: string;
          plan_id: string | null;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          config?: Json;
          created_at?: string;
          icon_url?: string | null;
          id: number;
          name: string;
          plan_id?: string | null;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          config?: Json;
          created_at?: string;
          icon_url?: string | null;
          id?: number;
          name?: string;
          plan_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "servers_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "billing_plans";
            referencedColumns: ["id"];
          },
        ];
      };
      shards: {
        Row: {
          created_at: string;
          id: number;
          last_heartbeat: string | null;
          server_count: number;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id: number;
          last_heartbeat?: string | null;
          server_count?: number;
          status?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          last_heartbeat?: string | null;
          server_count?: number;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          canceled_at: string | null;
          created_at: string;
          current_period_end: string;
          current_period_start: string;
          id: string;
          plan_id: string;
          server_id: number;
          status: string;
          updated_at: string;
        };
        Insert: {
          canceled_at?: string | null;
          created_at?: string;
          current_period_end: string;
          current_period_start: string;
          id?: string;
          plan_id: string;
          server_id: number;
          status: string;
          updated_at?: string;
        };
        Update: {
          canceled_at?: string | null;
          created_at?: string;
          current_period_end?: string;
          current_period_start?: string;
          id?: string;
          plan_id?: string;
          server_id?: number;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "billing_plans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_server_id_fkey";
            columns: ["server_id"];
            isOneToOne: true;
            referencedRelation: "servers";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          discord_id: string;
          discord_username: string;
          id: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          discord_id: string;
          discord_username: string;
          id: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          discord_id?: string;
          discord_username?: string;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
}

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
