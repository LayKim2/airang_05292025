import { Category } from "@/app/types"
import { Globe, MessageCircle, Palette, Code, TrendingUp, Brain } from "lucide-react"

export const categories: Category[] = [
  { name: "전체", icon: Globe, count: 156, color: "from-blue-500 to-cyan-500" },
  { name: "챗봇", icon: MessageCircle, count: 42, color: "from-green-500 to-emerald-500" },
  { name: "이미지", icon: Palette, count: 38, color: "from-purple-500 to-pink-500" },
  { name: "개발도구", icon: Code, count: 29, color: "from-orange-500 to-red-500" },
  { name: "마케팅", icon: TrendingUp, count: 25, color: "from-indigo-500 to-blue-500" },
  { name: "교육", icon: Brain, count: 22, color: "from-teal-500 to-green-500" },
] 