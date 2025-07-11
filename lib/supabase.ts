import { createClient } from '@supabase/supabase-js'
import type { User } from '@/app/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 실시간 기능을 위한 Supabase 클라이언트 설정
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
})

// user 테이블에 upsert(동기화)하는 useUserProfile 커스텀 훅
export type { User } 