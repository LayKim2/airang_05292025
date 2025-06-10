"use client"

import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { TrendingUp, Calendar, Eye, MessageCircle, ArrowUpRight } from "lucide-react"
import { useTranslation } from "@/app/i18n/useTranslation"
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
    title: "OpenAI Announces GPT-5 Development",
    description: "Development of GPT-5 has begun with enhanced performance and safety. This version is expected to show significant improvements in multimodal learning and reinforcement learning.",
    date: "2024.03.15",
    category: "LLM",
    views: 2345,
    comments: 128,
    trending: true
  },
  {
    id: 2,
    title: "Google Releases Gemini Pro 2.0",
    description: "Google has released a new version of Gemini Pro. This update significantly enhances code generation capabilities and enables more accurate mathematical reasoning.",
    date: "2024.03.14",
    category: "LLM",
    views: 1890,
    comments: 95,
    trending: true
  },
  {
    id: 3,
    title: "Stable Diffusion 3.0 Beta Release",
    description: "Stability AI has released a new version of Stable Diffusion in beta. This version shows significant improvements in text-to-image generation accuracy.",
    date: "2024.03.13",
    category: "Image Generation",
    views: 1567,
    comments: 82,
    trending: false
  },
  {
    id: 4,
    title: "Microsoft Launches 'Copilot Pro' AI Developer Tool",
    description: "Microsoft has released a new AI tool for developers. It provides various features including code review, bug fixing, and performance optimization.",
    date: "2024.03.12",
    category: "Development Tools",
    views: 1432,
    comments: 76,
    trending: false
  },
  {
    id: 5,
    title: "Meta Releases Open Source LLM 'Llama 3'",
    description: "Meta has released a new open-source large language model. This model enables more efficient learning and inference compared to previous versions.",
    date: "2024.03.11",
    category: "LLM",
    views: 1987,
    comments: 103,
    trending: true
  },
  {
    id: 6,
    title: "Anthropic Launches Claude 3 Series",
    description: "Anthropic has released a new version of Claude. This version adds multimodal capabilities, enabling simultaneous processing of images and text.",
    date: "2024.03.10",
    category: "LLM",
    views: 1765,
    comments: 89,
    trending: true
  }
]

// 애니메이션 config 재사용
const orbAnimation = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.2, 0.3, 0.2],
    x: [0, 20, 0],
    y: [0, -20, 0],
  },
  transition: {
    duration: 16, // 기존 8에서 16으로 늘림
    repeat: Infinity,
    ease: "easeInOut"
  }
}
const orb2Animation = {
  animate: {
    scale: [1, 1.3, 1],
    opacity: [0.2, 0.4, 0.2],
    x: [0, -20, 0],
    y: [0, 20, 0],
  },
  transition: {
    duration: 20, // 기존 10에서 20으로 늘림
    repeat: Infinity,
    ease: "easeInOut"
  }
}

export default function TrendsPage() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen pt-[128px] sm:pt-16 bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-8 md:py-12 lg:py-16">
        {/* Modern Background Elements */}
        <div className="absolute inset-0">
          {/* Animated Gradient Orbs */}
          <motion.div className="absolute top-32 left-32 w-64 h-64 bg-gradient-to-r from-violet-200/20 to-purple-200/20 rounded-full blur-3xl" {...orbAnimation} />
          <motion.div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl" {...orb2Animation} />

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
            className="text-center mb-4 md:mb-6 lg:mb-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Badge className="bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700 border-0 px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 text-base sm:text-lg font-semibold">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {t('trendsTitle')}
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
                          {t('trending')}
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
                          <span>{t('viewDetails')}</span>
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