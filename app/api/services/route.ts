import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'

// AI 서비스 등록 API
export async function POST(req: NextRequest) {
  // 1. 인증 확인 (Clerk)
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. 입력값 파싱
  const body = await req.json()
  const { title, description, category, tags, image_url, demo_url, ai_tools } = body

  // 3. 필수값 검증
  if (!title || !description || !category) {
    return NextResponse.json({ error: '필수 항목 누락' }, { status: 400 })
  }

  // 4. Supabase insert
  const { error } = await supabase.from('services').insert([
    {
      author_id: userId,
      title,
      description,
      category,
      tags,
      image_url,
      demo_url,
      ai_tools,
    }
  ])
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 5. 성공 응답
  return NextResponse.json({ ok: true })
}

// AI 서비스 리스트 조회 API (필터/검색/정렬)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') || 'all'
  const search = searchParams.get('search') || ''
  const sortBy = searchParams.get('sortBy') || 'latest'

  let query = supabase.from('services').select(`
    *,
    users:users!services_author_id_fkey (
      first_name,
      last_name,
      avatar_url
    )
  `)

  // 카테고리 필터
  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  // 검색 (title, description, tags, ai_tools)
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}},ai_tools.cs.{${search}}`)
  }

  // 정렬
  if (sortBy === 'popular') {
    query = query.order('like_count', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ services: data })
} 