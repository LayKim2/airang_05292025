"use client"

import { Button } from "@/app/components/ui/button"
import { Users, UserPlus, ChevronRight, Heart, Eye, MessageCircle, TrendingUp, Grid } from "lucide-react"
import { motion, easeInOut } from "framer-motion"
import { useRouter } from 'next/navigation'
import { useTranslation } from "@/app/i18n/useTranslation"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/app/components/ui/badge"
import { AnimatePresence } from "framer-motion"
import Image from "next/image"
import { categories, categoryIconMap, categoryBgMap, categoryTextMap } from "@/app/data/categories"
import React from "react"

export function Hero() {
  const router = useRouter();
  const { t } = useTranslation();
  // MCP: 실제 서비스 테이블 데이터 상태
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase.from('services').select('*, users:author_id(*)')
        if (error) throw error
        setServices(data || [])
      } catch (e: any) {
        setError(e.message || '서비스 데이터를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || services.length === 0) return;
    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % services.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [services.length, isAutoPlaying])

  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % services.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const currentService = services[currentIndex]
  const category = currentService ? categories.find(cat => cat.id === currentService.category) : undefined;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 600 : -600,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 600 : -600,
      opacity: 0,
      scale: 0.95
    })
  }

  // 애니메이션 config 재사용
  const orbAnimation = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.3, 0.2],
      x: [0, 20, 0],
      y: [0, -20, 0],
    },
    transition: {
      duration: 16, 
      repeat: Infinity,
      ease: easeInOut,
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
      duration: 20, 
      repeat: Infinity,
      ease: easeInOut,
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
      ease: easeInOut,
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
      ease: easeInOut,
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Gradient Orbs */}
        <motion.div 
          className="absolute top-32 left-32 w-64 h-64 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-3xl"
          {...orbAnimation}
        />
        <motion.div 
          className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
          {...orb2Animation}
        />

        {/* Floating Elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl"
          {...float1}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl"
          {...float2}
        />
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
              <h2 className="text-3xl font-bold text-white mb-2">{t('heroServiceTitle')}</h2>
              <p className="text-gray-300">{t('heroServiceDesc')}</p>
            </motion.div>
            {services.length > 0 && (
              <div className="relative max-w-lg lg:max-w-xl mx-auto">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 200, damping: 25 },
                      opacity: { duration: 0.2 }
                    }}
                    className="relative bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/10 overflow-hidden group"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.35}
                    whileDrag={{ scale: 0.96, boxShadow: "0 8px 32px 0 rgba(80, 80, 160, 0.18)" }}
                    onDragEnd={(event, info) => {
                      if (info.offset.x < -80) {
                        nextSlide();
                      } else if (info.offset.x > 80) {
                        prevSlide();
                      }
                    }}
                  >
                    <div className="relative overflow-hidden">
                      {currentService ? (
                        <Image
                          src={currentService.image_url || "/placeholder.svg"}
                          alt={currentService.title}
                          width={600}
                          height={360}
                          className="w-full h-64 lg:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-64 lg:h-80 bg-gray-200" />
                      )}
                      {category && (
                        <Badge className={
                          `absolute top-3 sm:top-4 right-3 sm:right-4 ${categoryBgMap[category.id] || 'bg-gray-50'} ${categoryTextMap[category.id] || 'text-gray-700'} border-0 font-semibold text-xs sm:text-sm border border-gray-200 rounded-full px-3 py-1 flex items-center gap-2 shadow-sm transition-colors duration-200 hover:bg-gray-100 hover:border-gray-300 z-10`
                        }>
                          {categoryIconMap[category.id] && React.createElement(categoryIconMap[category.id], { className: "w-3 h-3" })}
                          <span className="font-semibold">{category.name}</span>
                        </Badge>
                      )}
                      {/* Navigation Buttons */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-gray-800/80 hover:bg-gray-800 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-gray-800/80 hover:bg-gray-800 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="p-3">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-3">
                            {currentService.title}
                          </h3>
                          <p className="text-gray-300 leading-relaxed">
                            {currentService.description}
                          </p>
                        </div>
                        {/* [MCP] 데모 URL 버튼: 서비스 데모 체험 */}
                        <div className="w-full mt-4">
                          <Button
                            className="w-full bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors font-semibold text-base py-3"
                            onClick={() => {
                              if (!currentService.demo_url) return;
                              let url = currentService.demo_url;
                              if (url && !/^https?:\/\//i.test(url)) {
                                url = 'https://' + url;
                              }
                              window.open(url, '_blank', 'noopener,noreferrer,width=1200,height=800');
                            }}
                            disabled={!currentService.demo_url}
                          >
                            {t('tryDemo')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                {/* Dots Indicator */}
                <div className="flex justify-center space-x-2 mt-6">
                  {services.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setDirection(index > currentIndex ? 1 : -1)
                        setCurrentIndex(index)
                        setIsAutoPlaying(false)
                        setTimeout(() => setIsAutoPlaying(true), 10000)
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex ? "bg-violet-500 w-8" : "bg-gray-600 hover:bg-gray-500"
                      }`}
                    />
                  ))}
                </div>
                {/* Service Counter */}
                <div className="text-center mt-4">
                  <span className="text-sm text-gray-400">
                    {currentIndex + 1} / {services.length}
                  </span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Content - Text Content */}
          <div className="space-y-12">
            {/* Subtle Badge */}
            <motion.div 
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
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
              <span className="text-gray-300 text-sm font-medium">{t('headerCommunity')}</span>
            </motion.div>

            {/* Speech Bubbles */}
            <div className="space-y-6">
              {/* First Speech Bubble */}
              <motion.div 
                className="relative bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 max-w-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="absolute -right-2 top-6 w-4 h-4 bg-white/10 rotate-45" />
                <h2 className="text-2xl font-bold text-white mb-2">{t('heroBubble1Title')}</h2>
                <p className="text-gray-300">{t('heroBubble1Desc')}</p>
              </motion.div>

              {/* Second Speech Bubble */}
              <motion.div 
                className="relative bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 max-w-lg mr-12"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="absolute -right-2 top-6 w-4 h-4 bg-white/10 rotate-45" />
                <p className="text-gray-300 leading-relaxed">
                  {t('heroBubble2Desc1')}
                  <br />
                  {t('heroBubble2Desc2')}
                </p>
              </motion.div>

              {/* Third Speech Bubble */}
              <motion.div 
                className="relative bg-gradient-to-r from-violet-500/20 to-blue-500/20 backdrop-blur-sm p-6 rounded-2xl border border-white/20 max-w-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="absolute -right-2 top-6 w-4 h-4 bg-gradient-to-r from-violet-500/20 to-blue-500/20 rotate-45" />
                <h2 className="text-2xl font-bold text-white mb-2">{t('heroBubble3Title')}</h2>
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
                  {t('heroBubble3Highlight')}
                </motion.span>
              </motion.div>

              {/* Description */}
              <motion.p 
                className="text-gray-300 leading-relaxed max-w-lg mr-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                {t('heroDescLong')}
              </motion.p>
            </div>

            {/* Refined CTA */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mr-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              {/* [MCP] 'AI 크리에이터 모임' 버튼: 그룹 리스트로 이동 */}
              <Button
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 group shadow-lg hover:shadow-xl"
                onClick={() => router.push('/match/groups')}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                </motion.div>
                {t('heroGroupsBtn')}
              </Button>
              {/* [MCP] '더 많은 AI 서비스 둘러보기' 버튼: 서비스 리스트로 이동 */}
              <Button
                size="lg"
                variant="outline"
                className="border border-gray-300 hover:border-gray-400 hover:bg-gray-50 font-medium px-6 py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                onClick={() => router.push('/services')}
              >
                <Grid className="w-5 h-5 mr-2" />
                {t('heroServicesBtn')}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
} 