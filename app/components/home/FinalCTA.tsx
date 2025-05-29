"use client"

import { Button } from "@/app/components/ui/button"
import { Sparkles, Coffee } from "lucide-react"

export function FinalCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h2 className="text-5xl lg:text-6xl font-black mb-8 leading-tight">
            AI 혁신의 여정을
            <br />
            함께 시작해보세요
          </h2>
          <p className="text-xl lg:text-2xl mb-12 opacity-90 leading-relaxed">
            AIrang에서 당신의 AI 아이디어를 현실로 만들고, 전 세계 크리에이터들과 함께 성장하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-white text-violet-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-lg"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              지금 시작하기
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-violet-600 font-bold px-8 py-4 rounded-2xl transition-all duration-300 text-lg"
            >
              <Coffee className="w-6 h-6 mr-3" />
              커뮤니티 둘러보기
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
} 