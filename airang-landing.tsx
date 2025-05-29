"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Users,
  Rocket,
  Brain,
  ChevronRight,
  Heart,
  Eye,
  MessageCircle,
  TrendingUp,
  Zap,
  Globe,
  Code,
  Palette,
} from "lucide-react"

export default function AIrangLanding() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const aiServices = [
    {
      id: 1,
      title: "AI 챗봇 빌더",
      description: "드래그 앤 드롭으로 쉽게 만드는 맞춤형 AI 챗봇",
      creator: "김개발",
      category: "챗봇",
      likes: 234,
      views: 1520,
      comments: 45,
      image: "/placeholder.svg?height=200&width=300",
      tags: ["GPT-4", "노코드", "비즈니스"],
      trending: true,
    },
    {
      id: 2,
      title: "스마트 이미지 편집기",
      description: "AI가 자동으로 배경을 제거하고 스타일을 변환해주는 도구",
      creator: "박디자인",
      category: "이미지",
      likes: 189,
      views: 980,
      comments: 32,
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Stable Diffusion", "이미지 처리", "자동화"],
    },
    {
      id: 3,
      title: "코드 리뷰 AI",
      description: "실시간으로 코드를 분석하고 개선점을 제안하는 AI 도구",
      creator: "이개발자",
      category: "개발도구",
      likes: 312,
      views: 2100,
      comments: 67,
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Claude", "코드분석", "개발자도구"],
      trending: true,
    },
    {
      id: 4,
      title: "AI 콘텐츠 플래너",
      description: "소셜미디어 콘텐츠를 자동으로 기획하고 스케줄링",
      creator: "최마케터",
      category: "마케팅",
      likes: 156,
      views: 750,
      comments: 28,
      image: "/placeholder.svg?height=200&width=300",
      tags: ["GPT-4", "마케팅", "자동화"],
    },
    {
      id: 5,
      title: "음성 번역 앱",
      description: "실시간 음성 인식과 다국어 번역을 제공하는 모바일 앱",
      creator: "정언어학",
      category: "번역",
      likes: 278,
      views: 1340,
      comments: 51,
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Whisper", "번역", "모바일"],
    },
    {
      id: 6,
      title: "AI 학습 도우미",
      description: "개인 맞춤형 학습 계획과 퀴즈를 생성하는 교육 플랫폼",
      creator: "한교육자",
      category: "교육",
      likes: 203,
      views: 1120,
      comments: 39,
      image: "/placeholder.svg?height=200&width=300",
      tags: ["교육", "개인화", "학습분석"],
    },
  ]

  const categories = [
    { name: "전체", icon: Globe, count: 156 },
    { name: "챗봇", icon: MessageCircle, count: 42 },
    { name: "이미지", icon: Palette, count: 38 },
    { name: "개발도구", icon: Code, count: 29 },
    { name: "마케팅", icon: TrendingUp, count: 25 },
    { name: "교육", icon: Brain, count: 22 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AIrang
                </h1>
                <p className="text-xs text-slate-500">AI와 함께 만드는 미래</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
                서비스 갤러리
              </Link>
              <Link href="#" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
                커뮤니티
              </Link>
              <Link href="#" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
                AI 트렌드
              </Link>
              <Link href="#" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
                협업 찾기
              </Link>
              <Link href="#" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
                이벤트
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" className="text-slate-600">
                로그인
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                시작하기
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-pink-600/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0 px-4 py-2">
                  <Zap className="w-4 h-4 mr-2" />
                  AI 크리에이터들의 새로운 놀이터
                </Badge>

                <div className="space-y-4">
                  <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                    <span className="text-slate-700">혼자 AI 서비스 만들기</span>
                    <br />
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                      막막하셨죠?
                    </span>
                  </h1>

                  <div className="text-lg lg:text-xl text-slate-600 leading-relaxed space-y-2">
                    <p>실전 사례부터 아이디어, MVP, 출시까지 함께 공유하고</p>
                    <p>협업 파트너도 만날 수 있는</p>
                  </div>

                  <h2 className="text-4xl lg:text-5xl font-bold">
                    <span className="text-slate-800">기획자·개발자·디자이너의</span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      AI 공동 작업실
                    </span>
                    <span className="text-slate-900">, </span>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-black">
                      AIrang
                    </span>
                  </h2>
                </div>

                <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
                  더 이상 혼자 고민하지 마세요. AIrang에서 당신의 AI 프로젝트를 현실로 만들어보세요.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  커뮤니티 참여하기
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  서비스 둘러보기
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">2,500+</div>
                  <div className="text-sm text-slate-500">활성 크리에이터</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">850+</div>
                  <div className="text-sm text-slate-500">AI 서비스</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">15K+</div>
                  <div className="text-sm text-slate-500">월간 사용자</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/hero-bg.png"
                  alt="AI Community Illustration"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent z-20" />
            </div>
          </div>
        </div>
      </section>

      {/* AI Services Gallery */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border-0 px-4 py-2 mb-6">
              <Brain className="w-4 h-4 mr-2" />
              크리에이터들의 AI 작품
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text text-transparent">
                AI로 만든 혁신적인
              </span>
              <br />
              <span className="text-slate-900">서비스들을 만나보세요</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              AIrang 커뮤니티 멤버들이 AI 기술을 활용해 직접 개발한 다양한 서비스들을 둘러보고 영감을 얻어보세요.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <Button
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  className={`${
                    index === 0
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "border-slate-300 hover:border-blue-500 hover:bg-blue-50"
                  } transition-all duration-300`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              )
            })}
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiServices.map((service, index) => (
              <Card
                key={service.id}
                className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 shadow-lg overflow-hidden ${
                  hoveredCard === index ? "scale-105" : ""
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {service.trending && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white border-0">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      트렌딩
                    </Badge>
                  )}

                  <Badge className="absolute top-3 right-3 bg-white/90 text-slate-700 border-0">
                    {service.category}
                  </Badge>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className="text-xs bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center space-x-1 text-sm text-slate-500">
                        <span>by</span>
                        <span className="font-medium text-slate-700">{service.creator}</span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{service.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{service.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{service.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
            >
              더 많은 서비스 보기
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              AI 혁신의 여정을
              <br />
              함께 시작해보세요
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              AIrang에서 당신의 AI 아이디어를 현실로 만들고, 전 세계 크리에이터들과 함께 성장하세요.
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              지금 시작하기
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
