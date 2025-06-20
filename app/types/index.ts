import { LucideIcon } from "lucide-react"

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
  icon: LucideIcon
  count: number
  color: string
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