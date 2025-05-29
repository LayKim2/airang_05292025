"use client"

import { useState, useEffect } from "react"
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
  Globe,
  Code,
  Palette,
  ArrowRight,
  Play,
  Coffee,
  Menu,
  X,
  UserPlus,
  MessageSquare,
  Handshake,
  Network,
  Clock,
  MapPin,
  Briefcase,
} from "lucide-react"
import { ServiceCarousel } from "@/components/home/ServiceCarousel"

export default function AIrangLanding() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
      image: "/placeholder.svg?height=160&width=280",
      tags: ["GPT-4", "노코드", "비즈니스"],
      trending: true,
      featured: true,
    },
    {
      id: 2,
      title: "스마트 이미지 편집기",
      description: "AI가 자동으로 배경을 제거하고 스타일을 변환",
      creator: "박디자인",
      category: "이미지",
      likes: 189,
      views: 980,
      comments: 32,
      image: "/placeholder.svg?height=160&width=280",
      tags: ["Stable Diffusion", "이미지 처리"],
    },
    {
      id: 3,
      title: "코드 리뷰 AI",
      description: "실시간으로 코드를 분석하고 개선점을 제안",
      creator: "이개발자",
      category: "개발도구",
      likes: 312,
      views: 2100,
      comments: 67,
      image: "/placeholder.svg?height=160&width=280",
      tags: ["Claude", "코드분석"],
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
      image: "/placeholder.svg?height=160&width=280",
      tags: ["GPT-4", "마케팅"],
    },
    {
      id: 5,
      title: "음성 번역 앱",
      description: "실시간 음성 인식과 다국어 번역을 제공",
      creator: "정언어학",
      category: "번역",
      likes: 278,
      views: 1340,
      comments: 51,
      image: "/placeholder.svg?height=160&width=280",
      tags: ["Whisper", "번역"],
    },
    {
      id: 6,
      title: "AI 학습 도우미",
      description: "개인 맞춤형 학습 계획과 퀴즈를 생성",
      creator: "한교육자",
      category: "교육",
      likes: 203,
      views: 1120,
      comments: 39,
      image: "/placeholder.svg?height=160&width=280",
      tags: ["교육", "개인화"],
    },
    {
      id: 7,
      title: "AI 데이터 분석기",
      description: "복잡한 데이터를 시각화하고 인사이트 도출",
      creator: "김분석가",
      category: "데이터",
      likes: 145,
      views: 890,
      comments: 23,
      image: "/placeholder.svg?height=160&width=280",
      tags: ["데이터분석", "시각화"],
    },
    {
      id: 8,
      title: "스마트 일정 관리",
      description: "AI가 최적의 일정을 자동으로 조정",
      creator: "박효율",
      category: "생산성",
      likes: 167,
      views: 654,
      comments: 19,
      image: "/placeholder.svg?height=160&width=280",
      tags: ["일정관리", "자동화"],
    },
  ]

  const communityMembers = [
    {
      id: 1,
      name: "김개발",
      role: "풀스택 개발자",
      interests: ["GPT-4", "웹개발", "스타트업"],
      location: "서울",
      experience: "3년",
      avatar: "/placeholder.svg?height=80&width=80",
      status: "온라인",
      projects: 12,
      connections: 45,
    },
    {
      id: 2,
      name: "박디자인",
      role: "UX/UI 디자이너",
      interests: ["AI 디자인", "프로토타이핑", "사용자 경험"],
      location: "부산",
      experience: "5년",
      avatar: "/placeholder.svg?height=80&width=80",
      status: "온라인",
      projects: 8,
      connections: 67,
    },
    {
      id: 3,
      name: "이기획자",
      role: "프로덕트 매니저",
      interests: ["AI 전략", "비즈니스 모델", "데이터 분석"],
      location: "대구",
      experience: "4년",
      avatar: "/placeholder.svg?height=80&width=80",
      status: "방금 전",
      projects: 15,
      connections: 89,
    },
    {
      id: 4,
      name: "최마케터",
      role: "그로스 마케터",
      interests: ["AI 마케팅", "콘텐츠", "성장 해킹"],
      location: "인천",
      experience: "2년",
      avatar: "/placeholder.svg?height=80&width=80",
      status: "온라인",
      projects: 6,
      connections: 34,
    },
    {
      id: 5,
      name: "정데이터",
      role: "데이터 사이언티스트",
      interests: ["머신러닝", "딥러닝", "데이터 시각화"],
      location: "광주",
      experience: "6년",
      avatar: "/placeholder.svg?height=80&width=80",
      status: "온라인",
      projects: 20,
      connections: 112,
    },
    {
      id: 6,
      name: "한창업자",
      role: "스타트업 CEO",
      interests: ["AI 비즈니스", "투자", "팀 빌딩"],
      location: "대전",
      experience: "7년",
      avatar: "/placeholder.svg?height=80&width=80",
      status: "방금 전",
      projects: 3,
      connections: 156,
    },
  ]

  // 무한 스크롤을 위한 서비스 배열 복제
  const infiniteServices = [...aiServices, ...aiServices, ...aiServices]

  const categories = [
    { name: "전체", icon: Globe, count: 156, color: "from-blue-500 to-cyan-500" },
    { name: "챗봇", icon: MessageCircle, count: 42, color: "from-green-500 to-emerald-500" },
    { name: "이미지", icon: Palette, count: 38, color: "from-purple-500 to-pink-500" },
    { name: "개발도구", icon: Code, count: 29, color: "from-orange-500 to-red-500" },
    { name: "마케팅", icon: TrendingUp, count: 25, color: "from-indigo-500 to-blue-500" },
    { name: "교육", icon: Brain, count: 22, color: "from-teal-500 to-green-500" },
  ]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Floating Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 50 ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-bounce" />
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  AIrang
                </h1>
                <p className="text-sm text-gray-500 font-medium">AI 공동 작업실</p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-8">
              {["서비스 갤러리", "커뮤니티", "AI 트렌드", "협업 찾기", "이벤트"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-gray-700 hover:text-violet-600 transition-colors font-semibold relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-600 to-blue-600 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-700 hover:text-violet-600 font-semibold">
                로그인
              </Button>
              <Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                시작하기
              </Button>
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Service Carousel */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Subtle Background */}
        <div className="absolute inset-0">
          <div className="absolute top-32 left-32 w-64 h-64 bg-gradient-to-r from-violet-200/20 to-purple-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left Content - Minimized */}
            <div className="space-y-8">
              {/* Subtle Badge */}
              <div className="inline-flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                <span className="text-gray-600 text-sm font-medium">AI 크리에이터 커뮤니티</span>
              </div>

              {/* Refined Heading */}
              <div className="space-y-4">
                <h1 className="text-3xl lg:text-4xl font-bold leading-tight text-gray-800">
                  혼자 AI 서비스 만들기
                  <br />
                  <span className="text-gray-500">막막하셨죠?</span>
                </h1>

                <div className="text-lg text-gray-600 leading-relaxed space-y-2">
                  <p>실전 사례부터 아이디어, MVP, 출시까지 함께 공유하고</p>
                  <p>협업 파트너도 만날 수 있는</p>
                </div>

                <div className="text-2xl lg:text-3xl font-bold leading-tight">
                  <span className="text-gray-700">기획자·개발자·디자이너의</span>
                  <br />
                  <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                    AI 공동 작업실, AIrang
                  </span>
                </div>
              </div>

              {/* Subtle Description */}
              <p className="text-gray-500 leading-relaxed max-w-lg">
                더 이상 혼자 고민하지 마세요. AIrang에서 당신의 AI 프로젝트를 현실로 만들어보세요.
              </p>

              {/* Refined CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 group"
                >
                  <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  커뮤니티 참여하기
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border border-gray-300 hover:border-gray-400 hover:bg-gray-50 font-medium px-6 py-3 rounded-xl transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2" />
                  둘러보기
                </Button>
              </div>

              {/* Minimal Stats */}
              <div className="flex items-center space-x-8 pt-6">
                {[
                  { number: "2.5K+", label: "크리에이터" },
                  { number: "850+", label: "AI 서비스" },
                  { number: "15K+", label: "사용자" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Service Carousel */}
            <div className="relative">
              <ServiceCarousel services={aiServices} />
            </div>
          </div>
        </div>
      </section>

      {/* Community Connection Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0 px-6 py-3 mb-8 text-lg font-semibold">
              <Network className="w-5 h-5 mr-2" />
              같은 관심사를 가진 사람들과의 연결
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-black mb-8 leading-tight">
              <span className="text-gray-900">혼자가 아닌</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                함께 만들어가는 AI
              </span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              비슷한 관심사와 목표를 가진 크리에이터들과 연결되어 협업하고, 인사이트를 교환하며 함께 성장하세요.
            </p>
          </div>

          {/* Connection Features */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: UserPlus,
                title: "스마트 매칭",
                description: "AI가 당신의 관심사와 스킬을 분석해 최적의 협업 파트너를 추천합니다",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: MessageSquare,
                title: "실시간 인사이트 교환",
                description: "프로젝트 경험과 노하우를 실시간으로 공유하고 피드백을 받아보세요",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Handshake,
                title: "협업 프로젝트 매칭",
                description: "아이디어는 있지만 팀이 필요한 프로젝트와 참여하고 싶은 크리에이터를 연결합니다",
                color: "from-green-500 to-emerald-500",
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl group bg-white/80 backdrop-blur-sm"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </Card>
              )
            })}
          </div>

          {/* Community Members Grid */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">지금 활동 중인 크리에이터들</h3>
              <p className="text-gray-600">실시간으로 연결되어 협업하고 있는 AIrang 멤버들을 만나보세요</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityMembers.map((member, index) => (
                <Card
                  key={member.id}
                  className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl group bg-white hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="relative">
                      <Image
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                        width={80}
                        height={80}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                          member.status === "온라인" ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg">{member.name}</h4>
                      <p className="text-gray-600 text-sm">{member.role}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{member.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Briefcase className="w-3 h-3" />
                          <span>{member.experience}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {member.interests.slice(0, 3).map((interest, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Rocket className="w-4 h-4" />
                          <span>{member.projects}개 프로젝트</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{member.connections}명 연결</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-green-600">
                        <Clock className="w-4 h-4" />
                        <span>{member.status}</span>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl">
                      연결하기
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Network className="w-6 h-6 mr-3" />더 많은 크리에이터 만나기
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Services Gallery */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-0 px-6 py-3 mb-8 text-lg font-semibold">
              <Brain className="w-5 h-5 mr-2" />
              크리에이터들의 AI 작품
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                AI로 만든 혁신적인
              </span>
              <br />
              <span className="text-gray-900">서비스들을 만나보세요</span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              AIrang 커뮤니티 멤버들이 AI 기술을 활용해 직접 개발한 다양한 서비스들을 둘러보고 영감을 얻어보세요.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <Button
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  className={`${
                    index === 0
                      ? `bg-gradient-to-r ${category.color} text-white shadow-xl hover:shadow-2xl`
                      : "border-2 border-gray-300 hover:border-violet-500 hover:bg-violet-50"
                  } transition-all duration-300 px-6 py-3 rounded-xl font-semibold text-lg`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {category.name}
                  <Badge variant="secondary" className="ml-3 text-sm font-bold">
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
                className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-0 shadow-lg overflow-hidden rounded-3xl bg-white ${
                  hoveredCard === index ? "scale-105" : ""
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    width={400}
                    height={240}
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {service.trending && (
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white border-0 font-bold">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      트렌딩
                    </Badge>
                  )}

                  <Badge className="absolute top-4 right-4 bg-white/95 text-gray-700 border-0 font-semibold">
                    {service.category}
                  </Badge>

                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button className="w-full bg-white/90 text-gray-900 hover:bg-white font-semibold">
                      자세히 보기
                    </Button>
                  </div>
                </div>

                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-violet-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{service.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className="bg-gray-100 text-gray-600 hover:bg-violet-100 hover:text-violet-700 transition-colors font-medium"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <div className="flex items-center space-x-2 text-gray-500">
                        <span>by</span>
                        <span className="font-semibold text-gray-700">{service.creator}</span>
                      </div>

                      <div className="flex items-center space-x-4 text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span className="font-medium">{service.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span className="font-medium">{service.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span className="font-medium">{service.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-gray-300 hover:border-violet-500 hover:bg-violet-50 font-bold px-8 py-4 rounded-2xl transition-all duration-300 text-lg"
            >
              더 많은 서비스 보기
              <ChevronRight className="w-6 h-6 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
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
    </div>
  )
}
