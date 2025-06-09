import { Service } from "@/app/types"
import { categories } from "./categories"

export const services: Service[] = [
  {
    id: 1,
    title: "AI 채팅 어시스턴트",
    description: "자연스러운 대화를 통해 질문에 답변하고 도움을 주는 AI 채팅 서비스입니다.",
    creator: "AIrang",
    category: "chatbot",
    likes: 156,
    views: 1800,
    comments: 42,
    image: "/images/carousel/ai-chat.svg",
    tags: ["채팅", "AI", "어시스턴트"],
    trending: true,
    featured: true
  },
  {
    id: 2,
    title: "AI 비디오 생성기",
    description: "텍스트 프롬프트를 기반으로 고품질 비디오를 생성하는 AI 서비스입니다.",
    creator: "AIrang",
    category: "image",
    likes: 234,
    views: 3200,
    comments: 78,
    image: "/images/carousel/ai-video.svg",
    tags: ["비디오", "AI", "생성"],
    trending: true,
    featured: true
  },
  {
    id: 3,
    title: "AI 음악 생성기",
    description: "다양한 장르와 스타일의 음악을 자동으로 생성하는 AI 서비스입니다.",
    creator: "AIrang",
    category: "dev-tools",
    likes: 189,
    views: 2500,
    comments: 56,
    image: "/images/carousel/ai-music.svg",
    tags: ["음악", "AI", "생성"],
    trending: false,
    featured: true
  },
  {
    id: 4,
    title: "AI 3D 모델 생성기",
    description: "텍스트 설명을 기반으로 3D 모델을 자동으로 생성하는 AI 서비스입니다.",
    creator: "AIrang",
    category: "image",
    likes: 167,
    views: 2100,
    comments: 45,
    image: "/images/carousel/ai-3d.svg",
    tags: ["3D", "AI", "모델링"],
    trending: false,
    featured: true
  },
] 