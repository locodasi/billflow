export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      clients: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          profile_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          profile_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_applications: {
        Row: {
          amount_applied: number
          amount_applied_usd: number
          created_at: string
          credit_id: number
          id: number
          invoice_id: string
          payment_id: string | null
        }
        Insert: {
          amount_applied: number
          amount_applied_usd: number
          created_at?: string
          credit_id: number
          id?: never
          invoice_id: string
          payment_id?: string | null
        }
        Update: {
          amount_applied?: number
          amount_applied_usd?: number
          created_at?: string
          credit_id?: number
          id?: never
          invoice_id?: string
          payment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_applications_credit_id_fkey"
            columns: ["credit_id"]
            isOneToOne: false
            referencedRelation: "project_credits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_applications_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoice_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_applications_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_applications_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          amount_usd: number
          created_at: string
          currency: string
          due_date: string | null
          exchange_rate_to_usd: number
          id: string
          invoice_number: string
          metadata: Json | null
          notes: string | null
          pdf_path: string | null
          project_id: string
        }
        Insert: {
          amount: number
          amount_usd: number
          created_at?: string
          currency?: string
          due_date?: string | null
          exchange_rate_to_usd: number
          id?: string
          invoice_number: string
          metadata?: Json | null
          notes?: string | null
          pdf_path?: string | null
          project_id: string
        }
        Update: {
          amount?: number
          amount_usd?: number
          created_at?: string
          currency?: string
          due_date?: string | null
          exchange_rate_to_usd?: number
          id?: string
          invoice_number?: string
          metadata?: Json | null
          notes?: string | null
          pdf_path?: string | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_stats"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_invoices: {
        Row: {
          amount_applied: number
          amount_applied_usd: number
          id: string
          invoice_id: string
          payment_id: string
        }
        Insert: {
          amount_applied: number
          amount_applied_usd: number
          id?: string
          invoice_id: string
          payment_id: string
        }
        Update: {
          amount_applied?: number
          amount_applied_usd?: number
          id?: string
          invoice_id?: string
          payment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_invoices_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoice_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_invoices_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_invoices_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          amount_usd: number
          created_at: string
          currency: string
          exchange_rate_to_usd: number
          id: string
          notes: string | null
          payment_method: string | null
          payment_number: string
          project_id: string
          receipt_pdf_path: string | null
          status: string
        }
        Insert: {
          amount: number
          amount_usd: number
          created_at?: string
          currency?: string
          exchange_rate_to_usd: number
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_number: string
          project_id: string
          receipt_pdf_path?: string | null
          status?: string
        }
        Update: {
          amount?: number
          amount_usd?: number
          created_at?: string
          currency?: string
          exchange_rate_to_usd?: number
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_number?: string
          project_id?: string
          receipt_pdf_path?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_stats"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          language: string
          role: string
          settings: Json
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          language?: string
          role?: string
          settings?: Json
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          language?: string
          role?: string
          settings?: Json
        }
        Relationships: []
      }
      project_credits: {
        Row: {
          amount: number
          created_at: string
          id: number
          payment_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: never
          payment_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: never
          payment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_credits_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          bill_address: string | null
          client_id: string
          created_at: string
          currency: string
          id: string
          name: string
        }
        Insert: {
          bill_address?: string | null
          client_id: string
          created_at?: string
          currency?: string
          id?: string
          name: string
        }
        Update: {
          bill_address?: string | null
          client_id?: string
          created_at?: string
          currency?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_stats"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      client_stats: {
        Row: {
          client_id: string | null
          email: string | null
          invoice_count: number | null
          name: string | null
          project_count: number | null
          total_invoiced_usd: number | null
        }
        Relationships: []
      }
      invoice_summary: {
        Row: {
          amount: number | null
          amount_usd: number | null
          computed_status: string | null
          created_at: string | null
          credit_paid_amount: number | null
          credit_pending_amount: number | null
          currency: string | null
          due_date: string | null
          exchange_rate_to_usd: number | null
          id: string | null
          invoice_number: string | null
          metadata: Json | null
          notes: string | null
          outstanding_amount: number | null
          paid_amount: number | null
          pdf_path: string | null
          pending_amount: number | null
          project_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_stats"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_stats: {
        Row: {
          bill_address: string | null
          client_id: string | null
          currency: string | null
          invoice_count: number | null
          name: string | null
          project_id: string | null
          total_collected: number | null
          total_invoiced: number | null
          total_pending: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_stats"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_cards_metrics: {
        Args: {
          p_end: string
          p_prev_end: string
          p_prev_start: string
          p_project_id: string
          p_start: string
        }
        Returns: {
          invoiced: number
          payed: number
          prev_invoiced: number
          prev_payed: number
          prev_total_invoices: number
          total_invoices: number
        }[]
      }
      get_credit_metrics: {
        Args: {
          p_end: string
          p_project_id: string
          p_start: string
          p_value_type?: string
        }
        Returns: {
          applied: number
          created_at: string
          credit_id: number
          generated: number
        }[]
      }
      get_global_cards_metrics: {
        Args: {
          p_end: string
          p_prev_end: string
          p_prev_start: string
          p_start: string
        }
        Returns: {
          invoiced: number
          payed: number
          prev_invoiced: number
          prev_payed: number
          prev_total_invoices: number
          total_invoices: number
        }[]
      }
      get_global_charts_metrics: {
        Args: { p_end: string; p_granularity: string; p_start: string }
        Returns: Json
      }
      get_project_charts_metrics: {
        Args: {
          p_end: string
          p_granularity: string
          p_project_id: string
          p_start: string
        }
        Returns: {
          bucket: string
          invoiced: number
          invoiced_cumulative: number
          paid: number
          paid_cumulative: number
        }[]
      }
      get_user_role: { Args: { user_id: string }; Returns: string }
      is_project_owner: { Args: { project_id: string }; Returns: boolean }
      update_profile_setting: {
        Args: { p_path: string[]; p_profile_id: string; p_value: Json }
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
