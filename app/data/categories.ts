import { Category } from "@/app/types"
import { 
  Globe, 
  MessageSquare, 
  Image, 
  Code2, 
  LineChart, 
  GraduationCap,
  Database,
  Calendar,
  Users,
  Sparkles
} from "lucide-react"

export const categories: Category[] = [
  { 
    name: "전체", 
    icon: Sparkles, 
    count: 156, 
    color: "from-violet-500 to-fuchsia-500" 
  },
  { 
    name: "챗봇", 
    icon: MessageSquare, 
    count: 42, 
    color: "from-emerald-500 to-teal-500" 
  },
  { 
    name: "이미지", 
    icon: Image, 
    count: 38, 
    color: "from-rose-500 to-pink-500" 
  },
  { 
    name: "개발도구", 
    icon: Code2, 
    count: 29, 
    color: "from-blue-500 to-indigo-500" 
  },
  { 
    name: "마케팅", 
    icon: LineChart, 
    count: 25, 
    color: "from-amber-500 to-orange-500" 
  },
  { 
    name: "교육", 
    icon: GraduationCap, 
    count: 22, 
    color: "from-cyan-500 to-blue-500" 
  },
  { 
    name: "데이터", 
    icon: Database, 
    count: 18, 
    color: "from-purple-500 to-violet-500" 
  },
  { 
    name: "생산성", 
    icon: Calendar, 
    count: 15, 
    color: "from-green-500 to-emerald-500" 
  },
  { 
    name: "커뮤니티", 
    icon: Users, 
    count: 12, 
    color: "from-sky-500 to-blue-500" 
  }
] 