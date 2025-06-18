import { createClient } from '@supabase/supabase-js'
import type { User } from '@/app/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// user 테이블에 upsert(동기화)하는 useUserProfile 커스텀 훅
export type { User } 