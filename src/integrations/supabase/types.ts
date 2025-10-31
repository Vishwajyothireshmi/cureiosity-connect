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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          patient_id: string | null
          provider_id: string | null
          slot_id: string | null
          status: string
          updated_at: string | null
          visit_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          provider_id?: string | null
          slot_id?: string | null
          status?: string
          updated_at?: string | null
          visit_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          provider_id?: string | null
          slot_id?: string | null
          status?: string
          updated_at?: string | null
          visit_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "slots"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_payers: {
        Row: {
          code: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      insurance_plans: {
        Row: {
          created_at: string | null
          id: string
          name: string
          payer_id: string | null
          plan_code: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          payer_id?: string | null
          plan_code?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          payer_id?: string | null
          plan_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_plans_payer_id_fkey"
            columns: ["payer_id"]
            isOneToOne: false
            referencedRelation: "insurance_payers"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string
          city: string | null
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          provider_id: string | null
          state: string | null
          zip_code: string | null
        }
        Insert: {
          address: string
          city?: string | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          provider_id?: string | null
          state?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string
          city?: string | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          provider_id?: string | null
          state?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_insurance: {
        Row: {
          created_at: string | null
          id: string
          member_id: string | null
          plan_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          member_id?: string | null
          plan_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          member_id?: string | null
          plan_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_insurance_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "insurance_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      provider_insurance: {
        Row: {
          created_at: string | null
          id: string
          plan_id: string | null
          provider_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          plan_id?: string | null
          provider_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          plan_id?: string | null
          provider_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_insurance_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "insurance_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_insurance_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          accepts_telehealth: boolean | null
          bio: string | null
          created_at: string | null
          id: string
          name: string
          npi: string | null
          photo_url: string | null
          profile_url: string | null
          rating: number | null
          specialty: string
        }
        Insert: {
          accepts_telehealth?: boolean | null
          bio?: string | null
          created_at?: string | null
          id?: string
          name: string
          npi?: string | null
          photo_url?: string | null
          profile_url?: string | null
          rating?: number | null
          specialty: string
        }
        Update: {
          accepts_telehealth?: boolean | null
          bio?: string | null
          created_at?: string | null
          id?: string
          name?: string
          npi?: string | null
          photo_url?: string | null
          profile_url?: string | null
          rating?: number | null
          specialty?: string
        }
        Relationships: []
      }
      slots: {
        Row: {
          created_at: string | null
          end_time: string
          id: string
          is_booked: boolean | null
          location_id: string | null
          provider_id: string | null
          start_time: string
          visit_type: string
        }
        Insert: {
          created_at?: string | null
          end_time: string
          id?: string
          is_booked?: boolean | null
          location_id?: string | null
          provider_id?: string | null
          start_time: string
          visit_type: string
        }
        Update: {
          created_at?: string | null
          end_time?: string
          id?: string
          is_booked?: boolean | null
          location_id?: string | null
          provider_id?: string | null
          start_time?: string
          visit_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "slots_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slots_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      triage_logs: {
        Row: {
          confidence: number | null
          created_at: string | null
          id: string
          rationale: Json | null
          specialty: string | null
          symptom_text: string
          urgency: string | null
          user_id: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          rationale?: Json | null
          specialty?: string | null
          symptom_text: string
          urgency?: string | null
          user_id?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          rationale?: Json | null
          specialty?: string | null
          symptom_text?: string
          urgency?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
