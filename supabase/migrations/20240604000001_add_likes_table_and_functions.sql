-- 1. Create the 'likes' table
CREATE TABLE likes (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(clerk_user_id) ON DELETE CASCADE,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate likes from the same user on the same post
  UNIQUE(user_id, post_id)
);

-- Add comments to the table and columns for clarity
COMMENT ON TABLE public.likes IS 'Stores a record of which user liked which post.';
COMMENT ON COLUMN public.likes.user_id IS 'The ID of the user who liked the post, referencing the Clerk user ID.';
COMMENT ON COLUMN public.likes.post_id IS 'The ID of the post that was liked.';


-- 2. Create the function to increment the like_count on the 'posts' table
CREATE OR REPLACE FUNCTION increment_like(post_id_to_update BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE posts 
  SET like_count = like_count + 1 
  WHERE id = post_id_to_update;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.increment_like(BIGINT) IS 'Increments the like_count of a specific post by 1.';


-- 3. Create the function to decrement the like_count on the 'posts' table
CREATE OR REPLACE FUNCTION decrement_like(post_id_to_update BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE posts 
  SET like_count = GREATEST(like_count - 1, 0) -- Ensures the count never goes below 0
  WHERE id = post_id_to_update;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.decrement_like(BIGINT) IS 'Decrements the like_count of a specific post by 1, ensuring it does not go below zero.'; 