import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-url.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          trust_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          trust_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          trust_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      tips: {
        Row: {
          id: string
          country: string
          city: string | null
          category: string
          title: string
          content: string
          image_url: string | null
          tags: string[] | null
          location: string | null
          author_id: string
          likes_count: number
          comments_count: number
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          country: string
          city?: string | null
          category: string
          title: string
          content: string
          image_url?: string | null
          tags?: string[] | null
          location?: string | null
          author_id: string
          likes_count?: number
          comments_count?: number
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          country?: string
          city?: string | null
          category?: string
          title?: string
          content?: string
          image_url?: string | null
          tags?: string[] | null
          location?: string | null
          author_id?: string
          likes_count?: number
          comments_count?: number
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          tip_id: string
          author_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          tip_id: string
          author_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          tip_id?: string
          author_id?: string
          content?: string
          created_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          tip_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          tip_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          tip_id?: string
          user_id?: string
          created_at?: string
        }
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
    }
  }
}