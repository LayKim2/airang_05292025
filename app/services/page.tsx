"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Brain, ChevronRight, Heart, Eye, MessageCircle, Search, Plus, ArrowLeft, X, Filter, Image as ImageIcon, FileText, Video, Globe, Users, Mic, Box, Zap, Sparkles, Grid } from "lucide-react"
import { useTranslation } from "@/app/i18n/useTranslation"
import { useState, useEffect } from "react"
import { Modal } from "@/app/components/ui/modal"
import { useRouter } from "next/navigation"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select"

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

export default function ServicesPage() {
  const { t } = useTranslation()
  const router = useRouter()

  // 카테고리 옵션 (아이콘 매핑 추가)
  const categories = [
    { id: "all", name: t("categoryAll"), icon: <Grid className="w-4 h-4" /> },
    { id: "image", name: t("categoryImage"), icon: <ImageIcon className="w-4 h-4" /> },
    { id: "text", name: t("categoryText"), icon: <FileText className="w-4 h-4" /> },
    { id: "video", name: t("categoryVideo"), icon: <Video className="w-4 h-4" /> },
    { id: "webapp", name: t("categoryWebApp"), icon: <Globe className="w-4 h-4" /> },
    { id: "social", name: t("categorySocial"), icon: <Users className="w-4 h-4" /> },
    { id: "voice", name: t("categoryVoice"), icon: <Mic className="w-4 h-4" /> },
    { id: "3d", name: t("category3D"), icon: <Box className="w-4 h-4" /> },
    { id: "automation", name: t("categoryAutomation"), icon: <Zap className="w-4 h-4" /> },
    { id: "etc", name: t("categoryEtc"), icon: <Sparkles className="w-4 h-4" /> },
  ]

  // 서비스 리스트 상태 및 로딩/에러
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 정렬 옵션 (예시)
  const sortOptions = [
    { id: "latest", name: t('sortLatest') },
    { id: "popular", name: t('sortPopular') },
  ]
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("latest")
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterSort, setFilterSort] = useState(sortBy)
  const [filterSearch, setFilterSearch] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // 필터 팝업 열릴 때 임시 상태로 복사
  const openFilter = () => {
    setFilterCategory(selectedCategory)
    setFilterSort(sortBy)
    setFilterSearch(searchQuery)
    setFilterOpen(true)
  }
  // 필터 적용 함수
  const applyFilter = () => {
    setSelectedCategory(filterCategory)
    setSortBy(filterSort)
    setSearchQuery(filterSearch)
    setFilterOpen(false)
  }

  // 서비스 리스트 fetch
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (selectedCategory && selectedCategory !== "all") params.append("category", selectedCategory)
        if (searchQuery) params.append("search", searchQuery)
        if (sortBy) params.append("sortBy", sortBy)
        const res = await fetch(`/api/services?${params.toString()}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "서비스 목록을 불러오지 못했습니다.")
        // like_count를 likes로 매핑
        setServices((data.services || []).map((s: any) => ({ ...s, likes: s.like_count ?? 0 })))
      } catch (e: any) {
        setError(e.message || "서비스 목록을 불러오지 못했습니다.")
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [selectedCategory, searchQuery, sortBy])

  // --- 카테고리별 연한 배경색/텍스트색 매핑 ---
  const categoryBgMap: Record<string, string> = {
    image: 'bg-blue-50',
    text: 'bg-yellow-50',
    video: 'bg-pink-50',
    webapp: 'bg-green-50',
    social: 'bg-indigo-50',
    voice: 'bg-purple-50',
    '3d': 'bg-orange-50',
    automation: 'bg-teal-50',
    etc: 'bg-gray-50',
    all: 'bg-gray-100',
  }
  const categoryTextMap: Record<string, string> = {
    image: 'text-blue-700',
    text: 'text-yellow-800',
    video: 'text-pink-700',
    webapp: 'text-green-700',
    social: 'text-indigo-700',
    voice: 'text-purple-700',
    '3d': 'text-orange-700',
    automation: 'text-teal-700',
    etc: 'text-gray-700',
    all: 'text-gray-700',
  }

  // [서비스 좋아요 토글 함수] (CommunityPage와 동일한 Optimistic UI)
  const handleToggleLike = async (serviceId: number) => {
    const originalServices = [...services];
    // Optimistic UI update
    setServices(currentServices =>
      currentServices.map(s => {
        if (s.id === serviceId) {
          const wasLiked = s.liked_by_user;
          return {
            ...s,
            liked_by_user: !wasLiked,
            like_count: wasLiked
              ? (s.like_count || 1) - 1
              : (s.like_count || 0) + 1,
          };
        }
        return s;
      })
    );
    try {
      await fetch(`/api/services/${serviceId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      setServices(originalServices);
    }
  };

  return (
    <main className="min-h-screen pt-[128px] sm:pt-16">
      {/* Hero Section */}
      <section className="relative py-8 md:py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-white">
        {/* Modern Background Elements */}
        <div className="absolute inset-0">
          {/* Animated Gradient Orbs */}
          <motion.div className="absolute top-32 left-32 w-64 h-64 bg-gradient-to-r from-violet-200/20 to-purple-200/20 rounded-full blur-3xl" {...orbAnimation} />
          <motion.div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl" {...orb2Animation} />

          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

          {/* Floating Elements */}
          <motion.div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-violet-100/40 to-purple-100/40 rounded-2xl blur-xl" {...float1} />
          <motion.div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-100/40 to-cyan-100/40 rounded-2xl blur-xl" {...float2} />

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
              <Badge className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-0 px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 text-base sm:text-lg font-semibold">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {t('servicesTitle')}
              </Badge>
            </motion.div>

            {/* Search and Filter Section */}
            <div className="space-y-6">
              {/* Search Bar + Filter Button */}
              <div className="max-w-2xl mx-auto">
                <div className="w-full flex items-center gap-2">
                  {/* 검색 input + 왼쪽 아이콘 */}
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder={t('servicesSearchPlaceholder')}
                      value={filterSearch}
                      onChange={e => setFilterSearch(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          setSearchQuery(filterSearch)
                        }
                      }}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                  {/* 검색 실행 버튼 (돋보기) */}
                  <button
                    type="button"
                    className="flex items-center justify-center px-4 py-2 bg-white/80 border border-gray-200 rounded-xl shadow-sm hover:bg-violet-50 transition-colors whitespace-nowrap"
                    onClick={() => setSearchQuery(filterSearch)}
                    aria-label={t('servicesSearchPlaceholder')}
                  >
                    <Search className="w-5 h-5 text-violet-600" />
                  </button>
                  {/* 필터 버튼 */}
                  <button
                    type="button"
                    className="flex items-center gap-1 px-4 py-2 bg-white/80 border border-gray-200 rounded-xl shadow-sm hover:bg-violet-50 transition-colors whitespace-nowrap"
                    onClick={openFilter}
                  >
                    <Filter className="w-5 h-5 text-violet-600" />
                    <span className="font-medium text-violet-700">{t('filterLabel')}</span>
                  </button>
                </div>
                {/* 적용된 필터 Chip UI */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {/* 카테고리 Chip */}
                  {selectedCategory !== "all" && (
                    <span className="inline-flex items-center bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium">
                      {t('categoryLabel')}: {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}
                      <button
                        className="ml-2 text-violet-400 hover:text-violet-700 focus:outline-none"
                        onClick={() => {
                          setSelectedCategory("all")
                        }}
                        aria-label="category filter reset"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {/* 정렬 Chip */}
                  {sortBy !== "latest" && (
                    <span className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {t('sortLabel')}: {sortOptions.find(o => o.id === sortBy)?.name || sortBy}
                      <button
                        className="ml-2 text-blue-400 hover:text-blue-700 focus:outline-none"
                        onClick={() => {
                          setSortBy("latest")
                        }}
                        aria-label="sort filter reset"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {/* 검색어 Chip */}
                  {searchQuery.trim() !== "" && (
                    <span className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                      {t('searchKeyword')}: {searchQuery}
                      <button
                        className="ml-2 text-gray-400 hover:text-gray-700 focus:outline-none"
                        onClick={() => {
                          setSearchQuery("")
                        }}
                        aria-label="search filter reset"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {/* 전체 초기화 버튼 */}
                  {(selectedCategory !== "all" || sortBy !== "latest" || searchQuery.trim() !== "") && (
                    <button
                      className="inline-flex items-center bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-300 ml-2"
                      onClick={() => {
                        setSelectedCategory("all")
                        setSortBy("latest")
                        setSearchQuery("")
                      }}
                    >
                      {t('reset')}
                    </button>
                  )}
                </div>
                {/* 필터 팝업(모달) */}
                {filterOpen && (
                  <div className="fixed inset-0 z-[1100] flex items-center justify-center">
                    {/* 완전한 회색 오버레이, 클릭 방지, 모든 컨텐츠 위에 덮기 */}
                    <div className="fixed inset-0 bg-gray-900 opacity-60 pointer-events-auto z-[1100]" />
                    <div className="fixed top-1/2 left-1/2 z-[1110] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                      <button
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                        onClick={() => setFilterOpen(false)}
                      >
                        <span className="text-xl">×</span>
                      </button>
                      <div className="mb-4 text-lg font-bold text-gray-900">{t('filterLabel')}</div>
                      <div className="flex flex-col gap-4">
                        {/* Sort By Filter */}
                        <div>
                          <div className="mb-1 text-sm font-medium text-gray-700">{t('sortLabel')}</div>
                          <Select value={filterSort} onValueChange={setFilterSort}>
                            <SelectTrigger className="w-full h-[46px] bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl truncate">
                              <SelectValue placeholder={t('sortLabel')} />
                            </SelectTrigger>
                            <SelectContent>
                              {sortOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {/* Category Filter Dropdown */}
                        <div>
                          <div className="mb-1 text-sm font-medium text-gray-700">{t('categoryLabel')}</div>
                          <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-full h-[46px] bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl truncate">
                              <SelectValue placeholder={t('categoryLabel')} />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  <span className="flex items-center gap-2">{category.icon}{category.name}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end mt-6">
                        <Button onClick={applyFilter} variant="default" className="px-6 py-2 rounded-xl">
                          {t('apply')}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* 로딩/에러/빈 상태 처리 */}
          {loading && (
            <div className="text-center py-12 text-gray-500">{t('loading')}</div>
          )}
          {error && (
            <div className="text-center py-12 text-red-500">{error}</div>
          )}
          {!loading && !error && services.length === 0 && (
            <div className="text-center py-12 text-gray-400">{t('noServices')}</div>
          )}

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <motion.div
                key={service.id}
              >
                <Card className="group cursor-pointer transition-all duration-500 hover:shadow-lg hover:-translate-y-1 border-0 shadow-md overflow-hidden rounded-2xl sm:rounded-3xl bg-white">
                  <div className="relative overflow-hidden">
                    <Image
                      src={service.image_url || ""}
                      alt={service.title}
                      width={400}
                      height={240}
                      className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={75}
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                    />

                    <Badge className={`absolute top-3 sm:top-4 right-3 sm:right-4 ${categoryBgMap[service.category] || 'bg-gray-50'} ${categoryTextMap[service.category] || 'text-gray-700'} border border-gray-200 rounded-full px-3 py-1 flex items-center gap-2 shadow-sm font-medium text-xs sm:text-sm transition-colors duration-200 hover:bg-gray-100 hover:border-gray-300`}>
                    {(() => {
                      const cat = categories.find(c => c.id === service.category)
                      if (!cat) return null
                      return (
                        <span className="flex items-center gap-2">
                          {/* 카테고리 아이콘과 이름을 한 줄에 배치, 아이콘 크기 강조 */}
                          <span className="text-base">{cat.icon}</span>
                          <span className="font-semibold">{cat.name}</span>
                        </span>
                      )
                    })()}
                    </Badge>
                  </div>

                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-violet-600 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* --- 태그 부분 완전히 제거, ai_tools만 세련되게 표시 --- */}
                      {Array.isArray(service.ai_tools) && service.ai_tools.length > 0 && (
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="inline-flex items-center text-xs text-violet-500 font-semibold mr-1">
                            <Sparkles className="w-4 h-4 mr-1" />AI Tools
                          </span>
                          {service.ai_tools.map((tool: string, toolIdx: number) => (
                            <span
                              key={toolIdx}
                              className="inline-flex items-center bg-white/80 border border-violet-100 text-violet-700 font-medium px-2.5 py-1 rounded-full shadow-sm hover:bg-violet-50 transition-colors text-xs gap-1"
                            >
                              <Zap className="w-3 h-3 mr-1 text-violet-400" />
                              {tool}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-100">
                        <div className="flex items-center space-x-2 text-gray-500 text-sm">
                          <span>by</span>
                          <span className="font-semibold text-gray-700 flex items-center gap-2">
                            {service.users?.avatar_url && (
                              <Image
                                src={service.users.avatar_url}
                                alt={(service.users?.first_name || '') + (service.users?.last_name ? ' ' + service.users.last_name : '')}
                                width={24}
                                height={24}
                                className="rounded-full object-cover border border-gray-200"
                              />
                            )}
                            {service.users?.first_name || ''}{service.users?.last_name ? ' ' + service.users.last_name : ''}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 sm:space-x-4 text-gray-500 text-sm">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="flex items-center space-x-1 cursor-pointer"
                            onClick={() => handleToggleLike(service.id)}
                          >
                            <Heart
                              className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors ${service.liked_by_user ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'}`}
                            />
                            <span className="font-medium">{service.like_count || 0}</span>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="flex items-center space-x-1"
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="font-medium">{service.views}</span>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="flex items-center space-x-1"
                          >
                            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="font-medium">{service.comments}</span>
                          </motion.div>
                        </div>
                      </div>

                      {/* --- demo_url이 있으면 하단에 '체험하기' 버튼 추가 (완전히 새 창에서 열기) --- */}
                      {service.demo_url && (
                        <div className="w-full mt-4">
                          <Button
                            className="w-full bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors font-semibold text-base py-3"
                            onClick={() => {
                              let url = service.demo_url;
                              if (url && !/^https?:\/\//i.test(url)) {
                                url = 'https://' + url;
                              }
                              window.open(url, '_blank', 'noopener,noreferrer,width=1200,height=800');
                            }}
                          >
                            {t('tryDemo')}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* 플로팅 액션 버튼 - AI 서비스 등록 (페이지 이동) */}
      <button
        className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-xl hover:scale-105 transition-all duration-300"
        style={{ boxShadow: '0 4px 24px 0 rgba(59,130,246,0.15)' }}
        aria-label={t('serviceRegisterTitle')}
        onClick={() => router.push('/services/register')}
      >
        <Plus className="w-8 h-8" />
      </button>
    </main>
  )
}
