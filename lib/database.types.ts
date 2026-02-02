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
                    stripe_customer_id: string | null
                    subscription_status: string | null
                    plan_id: string | null
                    messages_count: number | null
                    last_reset: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    stripe_customer_id?: string | null
                    subscription_status?: string | null
                    plan_id?: string | null
                    messages_count?: number | null
                    last_reset?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    stripe_customer_id?: string | null
                    subscription_status?: string | null
                    plan_id?: string | null
                    messages_count?: number | null
                    last_reset?: string | null
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
                    status: "ai" | "waiting" | "active" | "closed"
                    assigned_to: string | null
                    unread_count: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    chatbot_id: string
                    visitor_id?: string | null
                    status?: "ai" | "waiting" | "active" | "closed"
                    assigned_to?: string | null
                    unread_count?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    chatbot_id?: string
                    visitor_id?: string | null
                    status?: "ai" | "waiting" | "active" | "closed"
                    assigned_to?: string | null
                    unread_count?: number
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
            products: {
                Row: {
                    id: string
                    active: boolean | null
                    name: string | null
                    description: string | null
                    image: string | null
                    metadata: Json | null
                }
                Insert: {
                    id: string
                    active?: boolean | null
                    name?: string | null
                    description?: string | null
                    image?: string | null
                    metadata?: Json | null
                }
                Update: {
                    id?: string
                    active?: boolean | null
                    name?: string | null
                    description?: string | null
                    image?: string | null
                    metadata?: Json | null
                }
            }
            prices: {
                Row: {
                    id: string
                    product_id: string | null
                    active: boolean | null
                    description: string | null
                    unit_amount: number | null
                    currency: string | null
                    type: "one_time" | "recurring" | null
                    interval: "day" | "week" | "month" | "year" | null
                    interval_count: number | null
                    trial_period_days: number | null
                    metadata: Json | null
                }
                Insert: {
                    id: string
                    product_id?: string | null
                    active?: boolean | null
                    description?: string | null
                    unit_amount?: number | null
                    currency?: string | null
                    type?: "one_time" | "recurring" | null
                    interval?: "day" | "week" | "month" | "year" | null
                    interval_count?: number | null
                    trial_period_days?: number | null
                    metadata?: Json | null
                }
                Update: {
                    id?: string
                    product_id?: string | null
                    active?: boolean | null
                    description?: string | null
                    unit_amount?: number | null
                    currency?: string | null
                    type?: "one_time" | "recurring" | null
                    interval?: "day" | "week" | "month" | "year" | null
                    interval_count?: number | null
                    trial_period_days?: number | null
                    metadata?: Json | null
                }
            }
        }
    }
}
