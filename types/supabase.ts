export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          org_id: string | null
          role: string | null
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          org_id?: string | null
          role?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          org_id?: string | null
          role?: string | null
          created_at?: string
        }
      }
      chatbots: {
        Row: {
          id: string
          org_id: string
          name: string
          config: Json | null
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          config?: Json | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          name?: string
          config?: Json | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      knowledge_base_sources: {
        Row: {
          id: string
          chatbot_id: string
          type: "file" | "url"
          content_uri: string | null
          source_url: string | null
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          chatbot_id: string
          type: "file" | "url"
          content_uri?: string | null
          source_url?: string | null
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          chatbot_id?: string
          type?: "file" | "url"
          content_uri?: string | null
          source_url?: string | null
          status?: string | null
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          chatbot_id: string
          visitor_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          chatbot_id: string
          visitor_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          chatbot_id?: string
          visitor_id?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: "user" | "assistant" | "system"
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: "user" | "assistant" | "system"
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: "user" | "assistant" | "system"
          content?: string
          created_at?: string
        }
      }
    }
  }
}
