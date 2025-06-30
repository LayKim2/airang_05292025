import { LucideIcon } from "lucide-react"
import React from "react"

export interface Service {
  id: number
  title: string
  description: string
  creator: string
  category: string
  likes: number
  views: number
  comments: number
  image: string
  tags: string[]
  trending?: boolean
  featured?: boolean
}

export interface CommunityMember {
  id: number
  name: string
  role: string
  interests: string[]
  location: string
  experience: string
  avatar: string
  status: "온라인" | "방금 전" | "오프라인" | "online" | "just now" | "offline"
  projects: number
  connections: number
}

export interface Category {
  id: string
  name: string
}

export interface Feature {
  icon: LucideIcon
  title: string
  description: string
  color: string
}

export interface User {
  clerk_user_id: string;
  auth_type: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at?: string;
  last_sign_in_at?: string;
  updated_at?: string;
}

export type Post = {
    id: number;
    author_id: string;
    content: string;
    category: string;
    tags: string[];
    created_at: string;
    updated_at: string;
    like_count: number;
    is_published: boolean;
    is_featured: boolean;
    liked_by_user?: boolean;
    view_count?: number;
    users?: {
      first_name: string | null;
      last_name: string | null;
      avatar_url: string | null;
      role?: string;
    };
}

export type Like = {
    id: number;
    user_id: string;
    post_id: number;
    created_at: string;
} 