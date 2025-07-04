import { Category } from "@/app/types"
import { Grid, Image as ImageIcon, FileText, Video, Globe, Users, Mic, Box, Zap, Sparkles } from "lucide-react"

export const categories: Category[] = [
  { id: "all", name: "전체" },
  { id: "image", name: "이미지 생성" },
  { id: "text", name: "텍스트 생성" },
  { id: "video", name: "영상/애니메이션" },
  { id: "webapp", name: "웹/앱 서비스" },
  { id: "social", name: "소셜미디어" },
  { id: "voice", name: "음성/음악" },
  { id: "3d", name: "3D" },
  { id: "automation", name: "자동화/스크립트" },
  { id: "etc", name: "기타" },
]

// [MCP] 카테고리 id → 아이콘 컴포넌트 매핑
export const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  all: Grid,
  image: ImageIcon,
  text: FileText,
  video: Video,
  webapp: Globe,
  social: Users,
  voice: Mic,
  "3d": Box,
  automation: Zap,
  etc: Sparkles,
}

// [MCP] 카테고리별 연한 배경색/텍스트색 매핑
export const categoryBgMap: Record<string, string> = {
  image: 'bg-blue-50',
  text: 'bg-yellow-50',
  video: 'bg-pink-50',
  webapp: 'bg-green-50',
  social: 'bg-indigo-50',
  voice: 'bg-purple-50',
  '3d': 'bg-orange-50',
  automation: 'bg-teal-50',
  etc: 'bg-gray-50',
  all: 'bg-gray-100',
}
export const categoryTextMap: Record<string, string> = {
  image: 'text-blue-700',
  text: 'text-yellow-800',
  video: 'text-pink-700',
  webapp: 'text-green-700',
  social: 'text-indigo-700',
  voice: 'text-purple-700',
  '3d': 'text-orange-700',
  automation: 'text-teal-700',
  etc: 'text-gray-700',
  all: 'text-gray-700',
} 