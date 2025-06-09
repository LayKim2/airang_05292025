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
    id: "all",
    name: "All", 
    icon: Sparkles, 
    count: 156, 
    color: "from-violet-500 to-fuchsia-500" 
  },
  { 
    id: "chatbot",
    name: "Chatbot", 
    icon: MessageSquare, 
    count: 42, 
    color: "from-emerald-500 to-teal-500" 
  },
  { 
    id: "image",
    name: "Image", 
    icon: Image, 
    count: 38, 
    color: "from-rose-500 to-pink-500" 
  },
  { 
    id: "dev-tools",
    name: "Dev Tools", 
    icon: Code2, 
    count: 29, 
    color: "from-blue-500 to-indigo-500" 
  },
  { 
    id: "marketing",
    name: "Marketing", 
    icon: LineChart, 
    count: 25, 
    color: "from-amber-500 to-orange-500" 
  },
  { 
    id: "education",
    name: "Education", 
    icon: GraduationCap, 
    count: 22, 
    color: "from-cyan-500 to-blue-500" 
  },
  { 
    id: "data",
    name: "Data", 
    icon: Database, 
    count: 18, 
    color: "from-purple-500 to-violet-500" 
  },
  { 
    id: "productivity",
    name: "Productivity", 
    icon: Calendar, 
    count: 15, 
    color: "from-green-500 to-emerald-500" 
  },
  { 
    id: "community",
    name: "Community", 
    icon: Users, 
    count: 12, 
    color: "from-sky-500 to-blue-500" 
  }
] 