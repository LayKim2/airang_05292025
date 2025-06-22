import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: 게시글 목록 조회
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'latest'; // 'latest' or 'popular'

    let query = supabase
      .from('posts')
      .select(`
        *,
        users!posts_author_id_fkey (
          first_name,
          last_name,
          avatar_url
        ),
        likes!left(user_id)
      `, { count: 'exact' });

    // 정렬
    if (sortBy === 'popular') {
      query = query.order('like_count', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // 카테고리 필터
    if (category) {
      query = query.eq('category', category);
    }

    // 검색 필터
    if (search) {
      query = query.ilike('content', `%${search}%`);
    }

    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: postsData, error, count } = await query;

    if (error) {
      console.error('Posts fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    // Add liked_by_user field
    const posts = postsData ? postsData.map(post => ({
      ...post,
      liked_by_user: userId ? (post.likes as any[]).some(like => like.user_id === userId) : false,
      likes: undefined // We don't need the full likes array on the client
    })) : [];

    return NextResponse.json({
      posts: posts,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Posts API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: 새 게시글 작성
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
    const { content, category, tags } = body;

    // 입력 검증
    if (!content || !category) {
      return NextResponse.json(
        { error: 'Content and category are required' },
        { status: 400 }
      );
    }

    // Supabase에 게시글 저장
    const { data, error } = await supabase
      .from('posts')
      .insert({
        content: content.trim(),
        category,
        tags: tags || [],
        author_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        users!posts_author_id_fkey (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Post creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Post creation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}