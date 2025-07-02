-- 1. Create the 'users' table
CREATE TABLE users (
  clerk_user_id TEXT PRIMARY KEY,
  auth_type TEXT NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_sign_in_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_role VARCHAR(100)
);

-- Add comments to the users table and columns
COMMENT ON TABLE public.users IS 'Stores user information from Clerk authentication.';
COMMENT ON COLUMN public.users.clerk_user_id IS 'Primary key from Clerk authentication service.';
COMMENT ON COLUMN public.users.auth_type IS 'Type of authentication used (e.g., oauth, email).';
COMMENT ON COLUMN public.users.email IS 'User email address.';
COMMENT ON COLUMN public.users.first_name IS 'User first name.';
COMMENT ON COLUMN public.users.last_name IS 'User last name.';
COMMENT ON COLUMN public.users.avatar_url IS 'URL to user profile picture.';
COMMENT ON COLUMN public.users.user_role IS 'User role for authorization purposes.';

-- 2. Create the 'posts' table
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  author_id VARCHAR(255) NOT NULL REFERENCES users(clerk_user_id),
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  like_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false
);

-- Add comments to the posts table and columns
COMMENT ON TABLE public.posts IS 'Stores community posts created by users.';
COMMENT ON COLUMN public.posts.author_id IS 'Reference to the user who created the post.';
COMMENT ON COLUMN public.posts.content IS 'The main content of the post.';
COMMENT ON COLUMN public.posts.category IS 'Category classification of the post.';
COMMENT ON COLUMN public.posts.tags IS 'Array of tags associated with the post.';
COMMENT ON COLUMN public.posts.like_count IS 'Number of likes the post has received.';
COMMENT ON COLUMN public.posts.view_count IS 'Number of views the post has received.';
COMMENT ON COLUMN public.posts.is_published IS 'Whether the post is visible to the public.';
COMMENT ON COLUMN public.posts.is_featured IS 'Whether the post is featured/promoted.';

-- Create indexes for posts table (performance optimization)
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- 3. Create the 'likes' table
CREATE TABLE post_likes (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(clerk_user_id) ON DELETE CASCADE,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Prevent duplicate likes from the same user on the same post
  UNIQUE(user_id, post_id)
);

-- Add comments to the likes table and columns for clarity
COMMENT ON TABLE public.likes IS 'Stores a record of which user liked which post.';
COMMENT ON COLUMN public.likes.user_id IS 'The ID of the user who liked the post, referencing the Clerk user ID.';
COMMENT ON COLUMN public.likes.post_id IS 'The ID of the post that was liked.';

-- 4. Create the 'services' table (AI 서비스 등록)
CREATE TABLE services (
  id BIGSERIAL PRIMARY KEY,
  author_id VARCHAR(255) NOT NULL REFERENCES users(clerk_user_id),
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  demo_url TEXT,
  ai_tools TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT true,
  like_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0
);

-- Add comments to the services table and columns
COMMENT ON TABLE public.services IS 'Stores AI services registered by users.';
COMMENT ON COLUMN public.services.author_id IS 'Reference to the user who registered the service.';
COMMENT ON COLUMN public.services.title IS 'Service name.';
COMMENT ON COLUMN public.services.description IS 'Detailed description of the service.';
COMMENT ON COLUMN public.services.category IS 'Service category.';
COMMENT ON COLUMN public.services.tags IS 'Array of tags associated with the service.';
COMMENT ON COLUMN public.services.image_url IS 'URL to the main image or screenshot.';
COMMENT ON COLUMN public.services.demo_url IS 'Demo or live service URL.';
COMMENT ON COLUMN public.services.ai_tools IS 'Array of AI tools or models used in the service.';
COMMENT ON COLUMN public.services.like_count IS 'Number of likes the service has received.';
COMMENT ON COLUMN public.services.view_count IS 'Number of views the service has received.';
COMMENT ON COLUMN public.services.is_published IS 'Whether the service is visible to the public.';

-- Create indexes for services table (performance optimization)
CREATE INDEX idx_services_author_id ON services(author_id);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_created_at ON services(created_at DESC);
CREATE INDEX idx_services_tags ON services USING GIN(tags);
CREATE INDEX idx_services_ai_tools ON services USING GIN(ai_tools);


CREATE TABLE service_likes (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(clerk_user_id) ON DELETE CASCADE,
  service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Prevent duplicate likes from the same user on the same service
  UNIQUE(user_id, service_id)
);

-- Add comments to the service_likes table
COMMENT ON TABLE public.service_likes IS 'Stores a record of which user liked which service.';
COMMENT ON COLUMN public.service_likes.user_id IS 'The ID of the user who liked the service, referencing the Clerk user ID.';
COMMENT ON COLUMN public.service_likes.service_id IS 'The ID of the service that was liked.';

-- Create indexes for service_likes table
CREATE INDEX idx_service_likes_user_id ON service_likes(user_id);
CREATE INDEX idx_service_likes_service_id ON service_likes(service_id);
CREATE INDEX idx_service_likes_created_at ON service_likes(created_at DESC);

-- 5. Create the 'expert_applications' table (전문가 신청 폼)
CREATE TABLE expert_applications (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(clerk_user_id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- 닉네임 or 이름 (구글 연동)
  job_title VARCHAR(100) NOT NULL, -- 직무
  ai_category VARCHAR(100) NOT NULL, -- 전문분야 (AI category)
  phone VARCHAR(30) NULL, -- 휴대폰 번호
  phone_verified BOOLEAN DEFAULT false, -- 휴대폰 인증 여부
  bio VARCHAR(200), -- 한줄 소개
  ai_tools TEXT[], -- 사용하는 AI 도구 (기술 스택)
  portfolio_url TEXT, -- 포트폴리오 URL
  github_url TEXT, -- GitHub URL
  linkedin_url TEXT, -- LinkedIn URL
  etc_url TEXT, -- 기타 URL
  status VARCHAR(30) DEFAULT 'pending', -- 신청 상태 (pending/approved/rejected)
  reviewed_at TIMESTAMPTZ, -- 승인/거절 처리 시각
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comments to the expert_applications table and columns
COMMENT ON TABLE public.expert_applications IS 'Stores applications for expert registration.';
COMMENT ON COLUMN public.expert_applications.user_id IS 'Reference to the user who applied.';
COMMENT ON COLUMN public.expert_applications.name IS 'User nickname or name (from Google/Clerk).';
COMMENT ON COLUMN public.expert_applications.job_title IS 'Current job title.';
COMMENT ON COLUMN public.expert_applications.ai_category IS 'Expertise category (AI service category).';
COMMENT ON COLUMN public.expert_applications.phone IS 'Phone number.';
COMMENT ON COLUMN public.expert_applications.phone_verified IS 'Whether the phone number is verified.';
COMMENT ON COLUMN public.expert_applications.bio IS 'Short introduction.';
COMMENT ON COLUMN public.expert_applications.ai_tools IS 'Array of AI tools/tech stack.';
COMMENT ON COLUMN public.expert_applications.portfolio_url IS 'Portfolio URL.';
COMMENT ON COLUMN public.expert_applications.github_url IS 'GitHub URL.';
COMMENT ON COLUMN public.expert_applications.linkedin_url IS 'LinkedIn URL.';
COMMENT ON COLUMN public.expert_applications.status IS 'Application status (pending/approved/rejected).';
COMMENT ON COLUMN public.expert_applications.reviewed_at IS 'Datetime when application was reviewed.';

-- Create index for fast lookup by user_id and status
CREATE INDEX idx_expert_applications_user_id ON expert_applications(user_id);
CREATE INDEX idx_expert_applications_status ON expert_applications(status);

-- 6. Create the 'groups' table (AI 크리에이터 모임)
CREATE TABLE groups (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(clerk_user_id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL, -- 모임명
  category VARCHAR(100) NOT NULL, -- 카테고리
  ai_tools TEXT[] DEFAULT '{}', -- 관련 AI 도구/모델
  deadline DATE, -- 모집 마감일
  recruit_count INTEGER, -- 모집 인원
  description TEXT, -- 상세 소개(HTML)
  image_url TEXT, -- 대표 이미지
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comments to the groups table and columns
COMMENT ON TABLE public.groups IS 'Stores AI creator group (모임) information.';
COMMENT ON COLUMN public.groups.user_id IS 'Reference to the user who created the group.';
COMMENT ON COLUMN public.groups.title IS 'Group title (모임명)';
COMMENT ON COLUMN public.groups.category IS 'Group category';
COMMENT ON COLUMN public.groups.ai_tools IS 'Array of related AI tools/models';
COMMENT ON COLUMN public.groups.deadline IS 'Recruitment deadline';
COMMENT ON COLUMN public.groups.recruit_count IS 'Number of people to recruit';
COMMENT ON COLUMN public.groups.description IS 'Detailed group description (HTML)';
COMMENT ON COLUMN public.groups.image_url IS 'Main image URL';
COMMENT ON COLUMN public.groups.created_at IS 'Creation timestamp';
COMMENT ON COLUMN public.groups.updated_at IS 'Last update timestamp';

-- Create indexes for groups table (performance optimization)
CREATE INDEX idx_groups_category ON groups(category);
CREATE INDEX idx_groups_created_at ON groups(created_at DESC);
CREATE INDEX idx_groups_user_id ON groups(user_id);
CREATE INDEX idx_groups_ai_tools ON groups USING GIN(ai_tools);
