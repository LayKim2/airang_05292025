"use client"

import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { TrendingUp, Calendar, Eye, MessageCircle, ArrowUpRight } from "lucide-react"
import {
  TrendCard,
  TrendCardContent,
  TrendCardHeader,
  TrendCardTitle,
  TrendCardDescription,
  TrendCardFooter,
} from "@/app/components/ui/trend-card"

const trends = [
  {
    id: 1,
    title: "OpenAI, GPT-5 개발 시작 발표",
    description: "더욱 강력한 성능과 안전성을 갖춘 GPT-5 개발이 시작되었습니다. 이번 버전에서는 멀티모달 학습과 강화학습이 크게 개선될 것으로 예상됩니다.",
    date: "2024.03.15",
    category: "LLM",
    views: 2345,
    comments: 128,
    trending: true
  },
  {
    id: 2,
    title: "Google, Gemini Pro 2.0 출시",
    description: "Google이 Gemini Pro의 새로운 버전을 출시했습니다. 이번 업데이트에서는 코드 생성 능력이 크게 향상되었으며, 더 정확한 수학적 추론이 가능해졌습니다.",
    date: "2024.03.14",
    category: "LLM",
    views: 1890,
    comments: 95,
    trending: true
  },
  {
    id: 3,
    title: "Stable Diffusion 3.0 베타 출시",
    description: "Stability AI가 Stable Diffusion의 새로운 버전을 베타로 출시했습니다. 이번 버전에서는 텍스트-이미지 생성의 정확도가 크게 향상되었습니다.",
    date: "2024.03.13",
    category: "이미지 생성",
    views: 1567,
    comments: 82,
    trending: false
  },
  {
    id: 4,
    title: "Microsoft, AI 개발자 도구 'Copilot Pro' 출시",
    description: "Microsoft가 개발자를 위한 새로운 AI 도구를 출시했습니다. 코드 리뷰, 버그 수정, 성능 최적화 등 다양한 기능을 제공합니다.",
    date: "2024.03.12",
    category: "개발 도구",
    views: 1432,
    comments: 76,
    trending: false
  },
  {
    id: 5,
    title: "Meta, 오픈소스 LLM 'Llama 3' 공개",
    description: "Meta가 새로운 오픈소스 대규모 언어 모델을 공개했습니다. 이번 모델은 이전 버전보다 더 효율적인 학습과 추론이 가능합니다.",
    date: "2024.03.11",
    category: "LLM",
    views: 1987,
    comments: 103,
    trending: true
  },
  {
    id: 6,
    title: "Anthropic, Claude 3 시리즈 출시",
    description: "Anthropic이 Claude의 새로운 버전을 출시했습니다. 이번 버전에서는 멀티모달 기능이 추가되어 이미지와 텍스트를 동시에 처리할 수 있습니다.",
    date: "2024.03.10",
    category: "LLM",
    views: 1765,
    comments: 89,
    trending: true
  }
]

export default function TrendsPage() {
  return (
    <main className="min-h-screen pt-16 bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-8 md:py-12 lg:py-16">
        {/* Modern Background Elements */}
        <div className="absolute inset-0">
          {/* Animated Gradient Orbs */}
          <motion.div 
            className="absolute top-32 left-32 w-64 h-64 bg-gradient-to-r from-violet-200/20 to-purple-200/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -20, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

          {/* Radial Gradients */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.05),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.05),transparent_50%)]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12 lg:mb-16"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Badge className="bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700 border-0 px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 text-base sm:text-lg font-semibold">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                AI 트렌드
              </Badge>
            </motion.div>
          </motion.div>

          {/* Trends Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trends.map((trend, index) => (
              <motion.div
                key={trend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TrendCard className="group h-full">
                  <TrendCardContent>
                    <TrendCardHeader>
                      <Badge className="bg-violet-100 text-violet-700 border-0">
                        {trend.category}
                      </Badge>
                      {trend.trending && (
                        <Badge className="bg-gradient-to-r from-pink-500 to-orange-500 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                          <TrendingUp className="w-3 h-3 mr-1 animate-pulse" />
                          트렌딩
                        </Badge>
                      )}
                    </TrendCardHeader>

                    <div className="space-y-4">
                      <div>
                        <TrendCardTitle>
                          {trend.title}
                        </TrendCardTitle>
                        <TrendCardDescription>
                          {trend.description}
                        </TrendCardDescription>
                      </div>

                      <TrendCardFooter>
                        <div className="flex items-center space-x-2 text-gray-500 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{trend.date}</span>
                        </div>

                        <div className="flex items-center space-x-4 text-gray-500 text-sm">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{trend.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{trend.comments}</span>
                          </div>
                        </div>
                      </TrendCardFooter>

                      <div className="flex justify-end">
                        <button className="flex items-center space-x-1 text-violet-600 hover:text-violet-700 text-sm font-medium transition-colors">
                          <span>자세히 보기</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </TrendCardContent>
                </TrendCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
} 