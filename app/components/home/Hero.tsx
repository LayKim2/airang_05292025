"use client"

import { Button } from "@/app/components/ui/button"
import { Users, Play, MessageCircle } from "lucide-react"
import { ServiceCarousel } from "@/app/components/home/ServiceCarousel"
import { motion } from "framer-motion"

interface HeroProps {
  services: any[] // TODO: Add proper type
}

export function Hero({ services }: HeroProps) {
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
  const float1 = {
    animate: {
      rotate: [0, 5, 0, -5, 0],
      scale: [1, 1.1, 1],
    },
    transition: {
      duration: 20, // 기존 10에서 20으로 늘림
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
  const float2 = {
    animate: {
      rotate: [0, -5, 0, 5, 0],
      scale: [1, 1.1, 1],
    },
    transition: {
      duration: 24, // 기존 12에서 24로 늘림
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Gradient Orbs */}
        <motion.div 
          className="absolute top-32 left-32 w-64 h-64 bg-gradient-to-r from-violet-200/20 to-purple-200/20 rounded-full blur-3xl"
          {...orbAnimation}
        />
        <motion.div 
          className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl"
          {...orb2Animation}
        />

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Floating Elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-violet-100/40 to-purple-100/40 rounded-2xl blur-xl"
          {...float1}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-100/40 to-cyan-100/40 rounded-2xl blur-xl"
          {...float2}
        />

        {/* Radial Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.05),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.05),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Content - Service Carousel */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-2">AI Creator들의 서비스</h2>
              <p className="text-gray-600">실제로 만들어진 AI 서비스들을 둘러보세요</p>
            </motion.div>
            <ServiceCarousel services={services} />
          </motion.div>

          {/* Right Content - Text Content */}
          <div className="space-y-12">
            {/* Subtle Badge */}
            <motion.div 
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="w-2 h-2 bg-violet-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span className="text-gray-600 text-sm font-medium">AI 크리에이터 커뮤니티</span>
            </motion.div>

            {/* Speech Bubbles */}
            <div className="space-y-6">
              {/* First Speech Bubble */}
              <motion.div 
                className="relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg max-w-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="absolute -right-2 top-6 w-4 h-4 bg-white/90 rotate-45" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">혼자 AI 서비스 만들기</h2>
                <p className="text-gray-600">막막하셨죠?</p>
              </motion.div>

              {/* Second Speech Bubble */}
              <motion.div 
                className="relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg max-w-lg mr-12"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="absolute -right-2 top-6 w-4 h-4 bg-white/90 rotate-45" />
                <p className="text-gray-700 leading-relaxed">
                  실전 사례부터 아이디어, MVP, 출시까지 함께 공유하고
                  <br />
                  협업 파트너도 만날 수 있는
                </p>
              </motion.div>

              {/* Third Speech Bubble */}
              <motion.div 
                className="relative bg-gradient-to-r from-violet-50 to-blue-50 backdrop-blur-sm p-6 rounded-2xl shadow-lg max-w-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="absolute -right-2 top-6 w-4 h-4 bg-gradient-to-r from-violet-50 to-blue-50 rotate-45" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">기획자·개발자·디자이너의</h2>
                <motion.span 
                  className="text-2xl font-bold bg-clip-text text-transparent"
                  animate={{
                    backgroundImage: [
                      "linear-gradient(to right, #7c3aed, #2563eb)",
                      "linear-gradient(to right, #2563eb, #7c3aed)",
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  AI 크리에이터 커뮤니티, AIrang
                </motion.span>
              </motion.div>

              {/* Description */}
              <motion.p 
                className="text-gray-500 leading-relaxed max-w-lg mr-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                더 이상 혼자 고민하지 마세요. AIrang에서 당신의 AI 프로젝트를 현실로 만들어보세요.
              </motion.p>
            </div>

            {/* Refined CTA */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mr-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <Button
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 group shadow-lg hover:shadow-xl"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                </motion.div>
                커뮤니티 참여하기
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border border-gray-300 hover:border-gray-400 hover:bg-gray-50 font-medium px-6 py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Play className="w-5 h-5 mr-2" />
                둘러보기
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
} 