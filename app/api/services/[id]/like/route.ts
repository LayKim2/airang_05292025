import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// [서비스 좋아요 추가/삭제 API]
// - 사용자가 이미 좋아요를 눌렀으면 취소(unlike), 아니면 추가(like)
// - service_likes 테이블 사용
// - like_count 필드 동기화
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const serviceId = params.id;
  const numericServiceId = parseInt(serviceId, 10);
  if (isNaN(numericServiceId)) {
    return new NextResponse(JSON.stringify({ error: 'Invalid service ID' }), { status: 400 });
  }

  try {
    // 1. 이미 좋아요를 눌렀는지 확인
    const { data: existingLike, error: likeError } = await supabase
      .from('service_likes')
      .select('id')
      .eq('service_id', numericServiceId)
      .eq('user_id', userId)
      .single();

    if (likeError && likeError.code !== 'PGRST116') {
      // PGRST116: no rows found
      console.error('Error checking for existing like:', likeError);
      return new NextResponse(JSON.stringify({ error: 'Database error' }), { status: 500 });
    }

    if (existingLike) {
      // 이미 좋아요를 눌렀으면 취소(unlike)
      const { error: deleteError } = await supabase
        .from('service_likes')
        .delete()
        .eq('id', existingLike.id);
      if (deleteError) {
        console.error('Error deleting like:', deleteError);
        return new NextResponse(JSON.stringify({ error: 'Failed to unlike' }), { status: 500 });
      }
      // like_count 감소
      const { data: serviceData } = await supabase.from('services').select('like_count').eq('id', numericServiceId).single();
      const newCount = Math.max(0, (serviceData?.like_count || 1) - 1);
      await supabase.from('services').update({ like_count: newCount }).eq('id', numericServiceId);
      return NextResponse.json({ success: true, action: 'unliked' });
    } else {
      // 좋아요 추가
      const { error: insertError } = await supabase
        .from('service_likes')
        .insert({ service_id: numericServiceId, user_id: userId });
      if (insertError) {
        if (insertError.code !== '23505') { // unique_violation
          console.error('Error inserting like:', insertError);
          return new NextResponse(JSON.stringify({ error: 'Failed to like' }), { status: 500 });
        }
      }
      // like_count 증가
      const { data: serviceData } = await supabase.from('services').select('like_count').eq('id', numericServiceId).single();
      const newCount = (serviceData?.like_count || 0) + 1;
      await supabase.from('services').update({ like_count: newCount }).eq('id', numericServiceId);
      return NextResponse.json({ success: true, action: 'liked' });
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return new NextResponse(JSON.stringify({ error: 'An internal error occurred' }), { status: 500 });
  }
} 