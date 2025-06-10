import { Service } from "@/app/types"
import { categories } from "./categories"

export const services: Service[] = [
  {
    id: 1,
    title: "AI Chat Assistant",
    description: "An AI chat service that provides answers and assistance through natural conversations.",
    creator: "AIrang",
    category: "chatbot",
    likes: 156,
    views: 1800,
    comments: 42,
    image: "/images/carousel/ai-chat.svg",
    tags: ["Chat", "AI", "Assistant"],
    trending: true,
    featured: true
  },
  {
    id: 2,
    title: "AI Video Generator",
    description: "An AI service that generates high-quality videos based on text prompts.",
    creator: "AIrang",
    category: "image",
    likes: 234,
    views: 3200,
    comments: 78,
    image: "/images/carousel/ai-video.svg",
    tags: ["Video", "AI", "Generation"],
    trending: true,
    featured: true
  },
  {
    id: 3,
    title: "AI Music Generator",
    description: "An AI service that automatically generates music in various genres and styles.",
    creator: "AIrang",
    category: "dev-tools",
    likes: 189,
    views: 2500,
    comments: 56,
    image: "/images/carousel/ai-music.svg",
    tags: ["Music", "AI", "Generation"],
    trending: false,
    featured: true
  },
  {
    id: 4,
    title: "AI 3D Model Generator",
    description: "An AI service that automatically generates 3D models based on text descriptions.",
    creator: "AIrang",
    category: "image",
    likes: 167,
    views: 2100,
    comments: 45,
    image: "/images/carousel/ai-3d.svg",
    tags: ["3D", "AI", "Modeling"],
    trending: false,
    featured: true
  },
] 