import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// 좋아요 추가/삭제 API
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const postId = params.id;
    const numericPostId = parseInt(postId, 10);

    if (isNaN(numericPostId)) {
        return new NextResponse(JSON.stringify({ error: "Invalid post ID" }), { status: 400 });
    }

    try {
        // 1. Check if the user has already liked the post
        const { data: existingLike, error: likeError } = await supabase
            .from("post_likes")
            .select("id")
            .eq("post_id", numericPostId)
            .eq("user_id", userId)
            .single();

        if (likeError && likeError.code !== 'PGRST116') { // PGRST116: no rows found, which is fine
            console.error("Error checking for existing like:", likeError);
            return new NextResponse(JSON.stringify({ error: "Database error" }), { status: 500 });
        }

        if (existingLike) {
            // 2a. User has liked the post, so unlike it.
            // First, delete the record from the 'post_likes' table.
            const { error: deleteError } = await supabase
                .from("post_likes")
                .delete()
                .eq("id", existingLike.id);

            if (deleteError) {
                console.error("Error deleting like:", deleteError);
                return new NextResponse(JSON.stringify({ error: "Failed to unlike" }), { status: 500 });
            }

            // Then, fetch the current like_count and decrement it.
            // This is done in two steps to avoid complex syntax and ensure it works.
            const { data: postData } = await supabase.from('posts').select('like_count').eq('id', numericPostId).single();
            const newCount = Math.max(0, (postData?.like_count || 1) - 1);
            await supabase.from('posts').update({ like_count: newCount }).eq('id', numericPostId);

            return NextResponse.json({ success: true, action: 'unliked' });

        } else {
            // 2b. User has not liked the post, so like it.
            // First, insert a record into the 'post_likes' table.
            const { error: insertError } = await supabase
                .from("post_likes")
                .insert({ post_id: numericPostId, user_id: userId });

            if (insertError) {
                // If the user already liked it (e.g., race condition), it might fail.
                // We can just proceed to update the count.
                if (insertError.code !== '23505') { // 23505 is unique_violation
                    console.error("Error inserting like:", insertError);
                    return new NextResponse(JSON.stringify({ error: "Failed to like" }), { status: 500 });
                }
            }

            // Then, fetch the current like_count and increment it.
            const { data: postData } = await supabase.from('posts').select('like_count').eq('id', numericPostId).single();
            const newCount = (postData?.like_count || 0) + 1;
            await supabase.from('posts').update({ like_count: newCount }).eq('id', numericPostId);

            return NextResponse.json({ success: true, action: 'liked' });
        }
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        return new NextResponse(JSON.stringify({ error: "An internal error occurred" }), { status: 500 });
    }
} 