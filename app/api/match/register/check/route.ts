import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// [MCP] 전문가 중복 신청 여부 확인 API
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');
  if (!user_id) {
    return NextResponse.json({ error: 'user_id가 필요합니다.' }, { status: 400 });
  }
  // [MCP] expert_applications에 pending/approved 상태가 있는지 확인
  const { data, error } = await supabase
    .from('expert_applications')
    .select('id')
    .eq('user_id', user_id)
    .in('status', ['pending', 'approved'])
    .maybeSingle();
  return NextResponse.json({ exists: !!data });
} 