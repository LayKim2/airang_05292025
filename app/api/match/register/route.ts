import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// [MCP] 전문가 등록 API (POST)
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      job_title,
      ai_category,
      phone,
      bio,
      ai_tools,
      portfolio_url,
      github_url,
      linkedin_url,
      etc_url
    } = body;

    // [MCP] 입력값 검증
    if (!name || !job_title || !ai_category || !bio) {
      return NextResponse.json(
        { error: '필수 입력값이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // [MCP] 중복 신청 방지: 이미 등록된 신청이 있는지 확인
    const { data: existing, error: existingError } = await supabase
      .from('expert_applications')
      .select('id, status')
      .eq('user_id', userId)
      .in('status', ['pending', 'approved'])
      .maybeSingle();
    if (existing) {
      return NextResponse.json(
        { error: '이미 전문가 신청 내역이 있습니다.' },
        { status: 400 }
      );
    }

    // [MCP] supabase에 전문가 신청 정보 저장
    const { data, error } = await supabase
      .from('expert_applications')
      .insert({
        user_id: userId,
        name: name.trim(),
        job_title: job_title.trim(),
        ai_category,
        phone,
        phone_verified: false, // 인증 기능 제외
        bio: bio.trim(),
        ai_tools: ai_tools || [],
        portfolio_url: portfolio_url || '',
        github_url: github_url || '',
        linkedin_url: linkedin_url || '',
        etc_url: etc_url || '',
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Expert register error:', error);
      return NextResponse.json(
        { error: '전문가 등록에 실패했습니다.' },
        { status: 500 }
      );
    }

    // [MCP] 성공 응답
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Expert register API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 