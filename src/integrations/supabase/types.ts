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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          detail: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          module: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          detail?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          module: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          detail?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          module?: string
          user_id?: string | null
        }
        Relationships: []
      }
      chart_of_accounts: {
        Row: {
          account_type: string
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          account_type: string
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          account_type?: string
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chart_of_accounts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      fasilitas: {
        Row: {
          catatan_perawatan: string | null
          created_at: string
          id: string
          is_active: boolean
          kategori: string | null
          kondisi: Database["public"]["Enums"]["kondisi_aset"]
          nama: string
          ruangan_id: string | null
          tanggal_perawatan: string | null
          updated_at: string
        }
        Insert: {
          catatan_perawatan?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          kategori?: string | null
          kondisi?: Database["public"]["Enums"]["kondisi_aset"]
          nama: string
          ruangan_id?: string | null
          tanggal_perawatan?: string | null
          updated_at?: string
        }
        Update: {
          catatan_perawatan?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          kategori?: string | null
          kondisi?: Database["public"]["Enums"]["kondisi_aset"]
          nama?: string
          ruangan_id?: string | null
          tanggal_perawatan?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fasilitas_ruangan_id_fkey"
            columns: ["ruangan_id"]
            isOneToOne: false
            referencedRelation: "ruangan"
            referencedColumns: ["id"]
          },
        ]
      }
      jamaah: {
        Row: {
          address: string | null
          created_at: string
          id: string
          is_active: boolean
          jenis_kelamin: string | null
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          jenis_kelamin?: string | null
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          jenis_kelamin?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          entry_date: string
          id: string
          is_posted: boolean
          reference_no: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          entry_date?: string
          id?: string
          is_posted?: boolean
          reference_no?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          entry_date?: string
          id?: string
          is_posted?: boolean
          reference_no?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      journal_entry_lines: {
        Row: {
          coa_id: string
          created_at: string
          credit: number
          debit: number
          description: string | null
          id: string
          journal_entry_id: string
        }
        Insert: {
          coa_id: string
          created_at?: string
          credit?: number
          debit?: number
          description?: string | null
          id?: string
          journal_entry_id: string
        }
        Update: {
          coa_id?: string
          created_at?: string
          credit?: number
          debit?: number
          description?: string | null
          id?: string
          journal_entry_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entry_lines_coa_id_fkey"
            columns: ["coa_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entry_lines_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "general_ledger_view"
            referencedColumns: ["journal_entry_id"]
          },
          {
            foreignKeyName: "journal_entry_lines_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      kegiatan: {
        Row: {
          created_at: string
          created_by: string | null
          deskripsi: string | null
          id: string
          nama: string
          penanggung_jawab: string | null
          room_id: string | null
          status: Database["public"]["Enums"]["kegiatan_status"]
          tanggal: string
          updated_at: string
          waktu_mulai: string
          waktu_selesai: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deskripsi?: string | null
          id?: string
          nama: string
          penanggung_jawab?: string | null
          room_id?: string | null
          status?: Database["public"]["Enums"]["kegiatan_status"]
          tanggal: string
          updated_at?: string
          waktu_mulai: string
          waktu_selesai: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deskripsi?: string | null
          id?: string
          nama?: string
          penanggung_jawab?: string | null
          room_id?: string | null
          status?: Database["public"]["Enums"]["kegiatan_status"]
          tanggal?: string
          updated_at?: string
          waktu_mulai?: string
          waktu_selesai?: string
        }
        Relationships: [
          {
            foreignKeyName: "kegiatan_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "ruangan"
            referencedColumns: ["id"]
          },
        ]
      }
      mosque_gallery: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          mosque_profile_id: string
          sort_order: number
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          mosque_profile_id: string
          sort_order?: number
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          mosque_profile_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "mosque_gallery_mosque_profile_id_fkey"
            columns: ["mosque_profile_id"]
            isOneToOne: false
            referencedRelation: "mosque_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      mosque_profile: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          jam_operasional: string | null
          kapasitas_jamaah: number | null
          logo_url: string | null
          luas_bangunan: string | null
          name: string
          phone: string | null
          tahun_berdiri: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          jam_operasional?: string | null
          kapasitas_jamaah?: number | null
          logo_url?: string | null
          luas_bangunan?: string | null
          name?: string
          phone?: string | null
          tahun_berdiri?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          jam_operasional?: string | null
          kapasitas_jamaah?: number | null
          logo_url?: string | null
          luas_bangunan?: string | null
          name?: string
          phone?: string | null
          tahun_berdiri?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      pemasukan: {
        Row: {
          amount: number
          category: string | null
          coa_id: string | null
          created_at: string
          created_by: string | null
          description: string
          id: string
          reference_no: string | null
          transaction_date: string
          updated_at: string
        }
        Insert: {
          amount: number
          category?: string | null
          coa_id?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          reference_no?: string | null
          transaction_date?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string | null
          coa_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          reference_no?: string | null
          transaction_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pemasukan_coa_id_fkey"
            columns: ["coa_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      pengeluaran: {
        Row: {
          amount: number
          category: string | null
          coa_id: string | null
          created_at: string
          created_by: string | null
          description: string
          id: string
          reference_no: string | null
          transaction_date: string
          updated_at: string
        }
        Insert: {
          amount: number
          category?: string | null
          coa_id?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          reference_no?: string | null
          transaction_date?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string | null
          coa_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          reference_no?: string | null
          transaction_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pengeluaran_coa_id_fkey"
            columns: ["coa_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reservasi: {
        Row: {
          created_at: string
          created_by: string | null
          end_time: string
          event_name: string
          id: string
          organizer_name: string
          organizer_phone: string | null
          purpose: string | null
          room_id: string | null
          start_time: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          end_time: string
          event_name: string
          id?: string
          organizer_name: string
          organizer_phone?: string | null
          purpose?: string | null
          room_id?: string | null
          start_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          end_time?: string
          event_name?: string
          id?: string
          organizer_name?: string
          organizer_phone?: string | null
          purpose?: string | null
          room_id?: string | null
          start_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservasi_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "ruangan"
            referencedColumns: ["id"]
          },
        ]
      }
      ruangan: {
        Row: {
          capacity: number | null
          category: string | null
          created_at: string
          description: string | null
          facilities_info: string | null
          id: string
          is_active: boolean
          name: string
          price: number | null
          rules: string | null
          type: Database["public"]["Enums"]["room_type"]
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          facilities_info?: string | null
          id?: string
          is_active?: boolean
          name: string
          price?: number | null
          rules?: string | null
          type?: Database["public"]["Enums"]["room_type"]
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          facilities_info?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price?: number | null
          rules?: string | null
          type?: Database["public"]["Enums"]["room_type"]
          updated_at?: string
        }
        Relationships: []
      }
      ruangan_gallery: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          ruangan_id: string
          sort_order: number
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          ruangan_id: string
          sort_order?: number
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          ruangan_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "ruangan_gallery_ruangan_id_fkey"
            columns: ["ruangan_id"]
            isOneToOne: false
            referencedRelation: "ruangan"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_events: {
        Row: {
          created_at: string
          event_date: string
          event_name: string
          id: string
          organizer_name: string
          status: Database["public"]["Enums"]["event_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_date: string
          event_name: string
          id?: string
          organizer_name: string
          status?: Database["public"]["Enums"]["event_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_date?: string
          event_name?: string
          id?: string
          organizer_name?: string
          status?: Database["public"]["Enums"]["event_status"]
          updated_at?: string
        }
        Relationships: []
      }
      tugas: {
        Row: {
          assignee_id: string | null
          column_id: Database["public"]["Enums"]["task_column"]
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          labels: string[] | null
          priority: Database["public"]["Enums"]["task_priority"]
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          column_id?: Database["public"]["Enums"]["task_column"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          labels?: string[] | null
          priority?: Database["public"]["Enums"]["task_priority"]
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          column_id?: Database["public"]["Enums"]["task_column"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          labels?: string[] | null
          priority?: Database["public"]["Enums"]["task_priority"]
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tugas_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      website_display_configs: {
        Row: {
          config_json: Json
          created_at: string
          created_by: string | null
          id: number
          is_active: boolean
          site_key: string
          updated_at: string
          version: number
        }
        Insert: {
          config_json: Json
          created_at?: string
          created_by?: string | null
          id?: never
          is_active?: boolean
          site_key?: string
          updated_at?: string
          version?: number
        }
        Update: {
          config_json?: Json
          created_at?: string
          created_by?: string | null
          id?: never
          is_active?: boolean
          site_key?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      website_sections: {
        Row: {
          config_json: Json | null
          created_at: string
          id: string
          is_visible: boolean
          section_key: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          config_json?: Json | null
          created_at?: string
          id?: string
          is_visible?: boolean
          section_key: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          config_json?: Json | null
          created_at?: string
          id?: string
          is_visible?: boolean
          section_key?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      general_ledger_view: {
        Row: {
          account_type: string | null
          coa_code: string | null
          coa_id: string | null
          coa_name: string | null
          credit: number | null
          debit: number | null
          entry_date: string | null
          journal_description: string | null
          journal_entry_id: string | null
          line_description: string | null
          reference_no: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_entry_lines_coa_id_fkey"
            columns: ["coa_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_any_role: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_bendahara_or_sekretaris: {
        Args: { _user_id: string }
        Returns: boolean
      }
      log_audit: {
        Args: {
          _action: string
          _detail?: string
          _metadata?: Json
          _module: string
          _user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role:
        | "superadmin"
        | "ketua_dkm"
        | "sekretaris"
        | "bendahara"
        | "admin_konten"
      event_status: "draft" | "published" | "cancelled"
      kegiatan_status: "dijadwalkan" | "berlangsung" | "selesai" | "dibatalkan"
      kondisi_aset: "baik" | "rusak_ringan" | "rusak_berat" | "dalam_perbaikan"
      room_type: "bookable" | "non_bookable"
      task_column: "backlog" | "todo" | "in_progress" | "done"
      task_priority: "low" | "medium" | "high"
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
    Enums: {
      app_role: [
        "superadmin",
        "ketua_dkm",
        "sekretaris",
        "bendahara",
        "admin_konten",
      ],
      event_status: ["draft", "published", "cancelled"],
      kegiatan_status: ["dijadwalkan", "berlangsung", "selesai", "dibatalkan"],
      kondisi_aset: ["baik", "rusak_ringan", "rusak_berat", "dalam_perbaikan"],
      room_type: ["bookable", "non_bookable"],
      task_column: ["backlog", "todo", "in_progress", "done"],
      task_priority: ["low", "medium", "high"],
    },
  },
} as const
