export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_logs: {
        Row: {
          id: string
          processing_time: number | null
          prompt: string
          response: string
          timestamp: string | null
        }
        Insert: {
          id?: string
          processing_time?: number | null
          prompt: string
          response: string
          timestamp?: string | null
        }
        Update: {
          id?: string
          processing_time?: number | null
          prompt?: string
          response?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      colony_evolution: {
        Row: {
          id: number
          location: string
          population_growth: number
          risk_level: string
        }
        Insert: {
          id?: number
          location: string
          population_growth: number
          risk_level: string
        }
        Update: {
          id?: number
          location?: string
          population_growth?: number
          risk_level?: string
        }
        Relationships: []
      }
      environmental_data: {
        Row: {
          created_at: string | null
          humidity: number | null
          id: number
          location_id: number | null
          rainfall: number | null
          soil_moisture: number | null
          temperature: number | null
          timestamp: string
          vegetation_index: number | null
        }
        Insert: {
          created_at?: string | null
          humidity?: number | null
          id?: number
          location_id?: number | null
          rainfall?: number | null
          soil_moisture?: number | null
          temperature?: number | null
          timestamp: string
          vegetation_index?: number | null
        }
        Update: {
          created_at?: string | null
          humidity?: number | null
          id?: number
          location_id?: number | null
          rainfall?: number | null
          soil_moisture?: number | null
          temperature?: number | null
          timestamp?: string
          vegetation_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "environmental_data_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          created_at: string | null
          elevation: number | null
          id: number
          latitude: number
          longitude: number
          name: string
          risk_level: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          elevation?: number | null
          id?: number
          latitude: number
          longitude: number
          name: string
          risk_level?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          elevation?: number | null
          id?: number
          latitude?: number
          longitude?: number
          name?: string
          risk_level?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mastomys_colonies: {
        Row: {
          created_at: string | null
          id: string
          location_id: number | null
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location_id?: number | null
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location_id?: number | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "mastomys_colonies_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      mastomys_observations: {
        Row: {
          created_at: string | null
          habitat_description: string | null
          id: string
          images: string[] | null
          location_id: number | null
          notes: string | null
          observation_date: string
          population_count: number | null
          status: string | null
          updated_at: string | null
          weather_conditions: Json | null
        }
        Insert: {
          created_at?: string | null
          habitat_description?: string | null
          id?: string
          images?: string[] | null
          location_id?: number | null
          notes?: string | null
          observation_date: string
          population_count?: number | null
          status?: string | null
          updated_at?: string | null
          weather_conditions?: Json | null
        }
        Update: {
          created_at?: string | null
          habitat_description?: string | null
          id?: string
          images?: string[] | null
          location_id?: number | null
          notes?: string | null
          observation_date?: string
          population_count?: number | null
          status?: string | null
          updated_at?: string | null
          weather_conditions?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "mastomys_observations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      mastomys_tracking: {
        Row: {
          detection_time: string
          group_size: number
          id: number
          location: string
          species: string
        }
        Insert: {
          detection_time: string
          group_size: number
          id?: number
          location: string
          species: string
        }
        Update: {
          detection_time?: string
          group_size?: number
          id?: number
          location?: string
          species?: string
        }
        Relationships: []
      }
      module_progress: {
        Row: {
          completed_at: string | null
          id: string
          last_activity_at: string | null
          module_id: string | null
          progress: number | null
          session_id: string | null
          started_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          last_activity_at?: string | null
          module_id?: string | null
          progress?: number | null
          session_id?: string | null
          started_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          last_activity_at?: string | null
          module_id?: string | null
          progress?: number | null
          session_id?: string | null
          started_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "training_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_progress_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      observations: {
        Row: {
          created_at: string | null
          habitat_description: string | null
          id: number
          images: string[] | null
          location_id: number | null
          notes: string | null
          observation_date: string
          observer_id: string | null
          population_count: number | null
          status: string | null
          updated_at: string | null
          weather_conditions: Json | null
        }
        Insert: {
          created_at?: string | null
          habitat_description?: string | null
          id?: number
          images?: string[] | null
          location_id?: number | null
          notes?: string | null
          observation_date: string
          observer_id?: string | null
          population_count?: number | null
          status?: string | null
          updated_at?: string | null
          weather_conditions?: Json | null
        }
        Update: {
          created_at?: string | null
          habitat_description?: string | null
          id?: number
          images?: string[] | null
          location_id?: number | null
          notes?: string | null
          observation_date?: string
          observer_id?: string | null
          population_count?: number | null
          status?: string | null
          updated_at?: string | null
          weather_conditions?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "observations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_assessments: {
        Row: {
          assessment_date: string
          created_at: string | null
          factors: Json | null
          id: number
          location_id: number | null
          mitigation_measures: string[] | null
          risk_level: string | null
          updated_at: string | null
        }
        Insert: {
          assessment_date: string
          created_at?: string | null
          factors?: Json | null
          id?: number
          location_id?: number | null
          mitigation_measures?: string[] | null
          risk_level?: string | null
          updated_at?: string | null
        }
        Update: {
          assessment_date?: string
          created_at?: string | null
          factors?: Json | null
          id?: number
          location_id?: number | null
          mitigation_measures?: string[] | null
          risk_level?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "risk_assessments_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      system_metrics: {
        Row: {
          cpu_usage: number | null
          id: string
          network_in: number | null
          network_out: number | null
          ram_usage: number | null
          timestamp: string
        }
        Insert: {
          cpu_usage?: number | null
          id?: string
          network_in?: number | null
          network_out?: number | null
          ram_usage?: number | null
          timestamp: string
        }
        Update: {
          cpu_usage?: number | null
          id?: string
          network_in?: number | null
          network_out?: number | null
          ram_usage?: number | null
          timestamp?: string
        }
        Relationships: []
      }
      training_metrics: {
        Row: {
          accuracy: number
          created_at: string | null
          epoch: number
          id: string
          loss: number
          metadata: Json | null
          updated_at: string | null
        }
        Insert: {
          accuracy: number
          created_at?: string | null
          epoch: number
          id?: string
          loss: number
          metadata?: Json | null
          updated_at?: string | null
        }
        Update: {
          accuracy?: number
          created_at?: string | null
          epoch?: number
          id?: string
          loss?: number
          metadata?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      training_modules: {
        Row: {
          created_at: string | null
          description: string
          duration: number | null
          id: string
          order_index: number
          prerequisites: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          duration?: number | null
          id?: string
          order_index: number
          prerequisites?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          duration?: number | null
          id?: string
          order_index?: number
          prerequisites?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      training_sessions: {
        Row: {
          completed_at: string | null
          current_module: string | null
          id: string
          progress: number | null
          started_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          current_module?: string | null
          id?: string
          progress?: number | null
          started_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          current_module?: string | null
          id?: string
          progress?: number | null
          started_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_sessions_current_module_fkey"
            columns: ["current_module"]
            isOneToOne: false
            referencedRelation: "training_modules"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
