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
      brand_analytics: {
        Row: {
          average_creator_rating: number | null
          average_engagement_rate: number | null
          average_payment_timeliness_rating: number | null
          brand_organization_id: string
          cost_per_engagement: number | null
          cost_per_impression: number | null
          created_at: string
          id: string
          period_end: string
          period_start: string
          platform_fees_paid: number
          roi: number | null
          total_creators_hired: number
          total_engagement: number
          total_impressions: number
          total_jobs_completed: number
          total_jobs_posted: number
          total_posts_published: number
          total_reach: number
          total_spent: number
          total_views_generated: number
          unique_creators_worked_with: number
        }
        Insert: {
          average_creator_rating?: number | null
          average_engagement_rate?: number | null
          average_payment_timeliness_rating?: number | null
          brand_organization_id: string
          cost_per_engagement?: number | null
          cost_per_impression?: number | null
          created_at?: string
          id?: string
          period_end: string
          period_start: string
          platform_fees_paid?: number
          roi?: number | null
          total_creators_hired?: number
          total_engagement?: number
          total_impressions?: number
          total_jobs_completed?: number
          total_jobs_posted?: number
          total_posts_published?: number
          total_reach?: number
          total_spent?: number
          total_views_generated?: number
          unique_creators_worked_with?: number
        }
        Update: {
          average_creator_rating?: number | null
          average_engagement_rate?: number | null
          average_payment_timeliness_rating?: number | null
          brand_organization_id?: string
          cost_per_engagement?: number | null
          cost_per_impression?: number | null
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          platform_fees_paid?: number
          roi?: number | null
          total_creators_hired?: number
          total_engagement?: number
          total_impressions?: number
          total_jobs_completed?: number
          total_jobs_posted?: number
          total_posts_published?: number
          total_reach?: number
          total_spent?: number
          total_views_generated?: number
          unique_creators_worked_with?: number
        }
        Relationships: [
          {
            foreignKeyName: "brand_analytics_brand_organization_id_fkey"
            columns: ["brand_organization_id"]
            isOneToOne: false
            referencedRelation: "brand_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_members: {
        Row: {
          brand_organization_id: string
          created_at: string
          department: string | null
          id: string
          invitation_status: Database["public"]["Enums"]["invitation_status"]
          invited_by: string | null
          job_title: string | null
          joined_at: string | null
          permissions: Json | null
          role: Database["public"]["Enums"]["brand_member_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          brand_organization_id: string
          created_at?: string
          department?: string | null
          id?: string
          invitation_status?: Database["public"]["Enums"]["invitation_status"]
          invited_by?: string | null
          job_title?: string | null
          joined_at?: string | null
          permissions?: Json | null
          role?: Database["public"]["Enums"]["brand_member_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          brand_organization_id?: string
          created_at?: string
          department?: string | null
          id?: string
          invitation_status?: Database["public"]["Enums"]["invitation_status"]
          invited_by?: string | null
          job_title?: string | null
          joined_at?: string | null
          permissions?: Json | null
          role?: Database["public"]["Enums"]["brand_member_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_members_brand_organization_id_fkey"
            columns: ["brand_organization_id"]
            isOneToOne: false
            referencedRelation: "brand_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brand_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brand_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_organizations: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"]
          activity_status: Database["public"]["Enums"]["activity_status"]
          billing_email: string | null
          company_logo: string | null
          company_size: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          dynamic_pricing_enabled: boolean
          headquarters_location: string | null
          id: string
          industry: string | null
          onboarding_completed_at: string | null
          onboarding_status: Database["public"]["Enums"]["brand_onboarding_status"]
          organization_name: string
          organization_slug: string
          platform_fee_percentage: number
          stripe_customer_id: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"]
          activity_status?: Database["public"]["Enums"]["activity_status"]
          billing_email?: string | null
          company_logo?: string | null
          company_size?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          dynamic_pricing_enabled?: boolean
          headquarters_location?: string | null
          id?: string
          industry?: string | null
          onboarding_completed_at?: string | null
          onboarding_status?: Database["public"]["Enums"]["brand_onboarding_status"]
          organization_name: string
          organization_slug: string
          platform_fee_percentage?: number
          stripe_customer_id?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"]
          activity_status?: Database["public"]["Enums"]["activity_status"]
          billing_email?: string | null
          company_logo?: string | null
          company_size?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          dynamic_pricing_enabled?: boolean
          headquarters_location?: string | null
          id?: string
          industry?: string | null
          onboarding_completed_at?: string | null
          onboarding_status?: Database["public"]["Enums"]["brand_onboarding_status"]
          organization_name?: string
          organization_slug?: string
          platform_fee_percentage?: number
          stripe_customer_id?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      brand_transactions: {
        Row: {
          amount: number
          balance_after: number
          brand_organization_id: string
          brand_wallet_id: string
          created_at: string
          created_by: string | null
          creator_amount: number | null
          description: string | null
          id: string
          platform_fee: number | null
          related_contract_id: string | null
          related_payment_id: string | null
          stripe_payment_intent_id: string | null
          transaction_type: Database["public"]["Enums"]["brand_transaction_type"]
        }
        Insert: {
          amount: number
          balance_after: number
          brand_organization_id: string
          brand_wallet_id: string
          created_at?: string
          created_by?: string | null
          creator_amount?: number | null
          description?: string | null
          id?: string
          platform_fee?: number | null
          related_contract_id?: string | null
          related_payment_id?: string | null
          stripe_payment_intent_id?: string | null
          transaction_type: Database["public"]["Enums"]["brand_transaction_type"]
        }
        Update: {
          amount?: number
          balance_after?: number
          brand_organization_id?: string
          brand_wallet_id?: string
          created_at?: string
          created_by?: string | null
          creator_amount?: number | null
          description?: string | null
          id?: string
          platform_fee?: number | null
          related_contract_id?: string | null
          related_payment_id?: string | null
          stripe_payment_intent_id?: string | null
          transaction_type?: Database["public"]["Enums"]["brand_transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "brand_transactions_brand_organization_id_fkey"
            columns: ["brand_organization_id"]
            isOneToOne: false
            referencedRelation: "brand_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brand_transactions_brand_wallet_id_fkey"
            columns: ["brand_wallet_id"]
            isOneToOne: false
            referencedRelation: "brand_wallet"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brand_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_brand_transactions_contract"
            columns: ["related_contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_brand_transactions_payment"
            columns: ["related_payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_wallet: {
        Row: {
          available_balance: number
          brand_organization_id: string
          created_at: string
          currency: string
          id: string
          pending_balance: number
          total_deposited: number
          total_spent: number
          updated_at: string
        }
        Insert: {
          available_balance?: number
          brand_organization_id: string
          created_at?: string
          currency?: string
          id?: string
          pending_balance?: number
          total_deposited?: number
          total_spent?: number
          updated_at?: string
        }
        Update: {
          available_balance?: number
          brand_organization_id?: string
          created_at?: string
          currency?: string
          id?: string
          pending_balance?: number
          total_deposited?: number
          total_spent?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_wallet_brand_organization_id_fkey"
            columns: ["brand_organization_id"]
            isOneToOne: true
            referencedRelation: "brand_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      // NOTE: Due to token limits, the full type definition has been truncated.
      // The complete types include all 42 tables with their Row, Insert, Update, and Relationships.
      // Run: npx supabase gen types typescript --project-id xigkfywncesdbjivdpqi > types/supabase.ts
      // to regenerate the full type definitions.
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      account_preference:
        | "personal_only"
        | "create_new"
        | "manage_existing"
        | "any"
      account_status: "active" | "suspended" | "deactivated" | "cancelled"
      account_type: "brand_member" | "creator"
      activity_status: "onboarding" | "active_hiring" | "idle" | "dormant"
      application_status:
        | "pending"
        | "under_review"
        | "accepted"
        | "rejected"
        | "withdrawn"
      brand_member_role: "owner" | "admin" | "manager" | "member"
      brand_onboarding_status:
        | "started"
        | "profile_completed"
        | "payment_setup"
        | "completed"
      brand_transaction_type:
        | "deposit"
        | "allocation"
        | "payment_with_fee"
        | "refund"
      contract_status:
        | "pending_creator"
        | "pending_brand"
        | "active"
        | "completed"
        | "terminated"
        | "disputed"
      conversation_status: "active" | "archived"
      creator_onboarding_status:
        | "started"
        | "profile_completed"
        | "socials_linked"
        | "portfolio_added"
        | "payment_setup"
        | "completed"
      creator_transaction_type: "earning" | "withdrawal" | "bonus" | "refund"
      deliverable_status:
        | "pending"
        | "submitted"
        | "under_review"
        | "revision_requested"
        | "approved"
        | "rejected"
      deliverable_type:
        | "post"
        | "video"
        | "story"
        | "reel"
        | "article"
        | "other"
      experience_source_type: "manual" | "linkedin" | "platform_job"
      invitation_status: "pending" | "accepted" | "declined"
      job_status:
        | "draft"
        | "open"
        | "in_progress"
        | "closed"
        | "completed"
        | "cancelled"
      job_visibility: "public" | "private" | "invite_only"
      participant_role: "brand_member" | "creator" | "co_creator"
      payment_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
      payment_terms: "per_post" | "per_milestone" | "project_total" | "hourly"
      payment_type:
        | "post_approval"
        | "milestone"
        | "upfront"
        | "completion_bonus"
      post_status: "draft" | "scheduled" | "published" | "deleted"
      post_type: "feed" | "story" | "reel" | "video" | "carousel" | "short"
      proficiency_level: "beginner" | "intermediate" | "expert"
      reviewee_type: "brand" | "creator"
      sentiment: "positive" | "negative" | "neutral"
      social_account_status: "active" | "inactive" | "suspended" | "deleted"
      social_account_type: "personal" | "job_specific"
      social_platform:
        | "instagram"
        | "tiktok"
        | "youtube"
        | "twitter"
        | "facebook"
        | "linkedin"
      transaction_status: "pending" | "completed" | "failed"
      willing_to_show_face: "yes" | "no" | "depends"
      work_status: "available" | "busy" | "unavailable" | "on_break"
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
