"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { ChevronRight, Heart, Eye, MessageCircle, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { categories } from "@/app/data/categories"

interface Service {
  id: number
  title: string
  description: string
  creator: string
  category: string
  likes: number
  views: number
  comments: number
  image: string
  tags: string[]
  trending?: boolean
  featured?: boolean
}

interface ServiceCarouselProps {
  services: Service[]
}

export function ServiceCarousel({ services }: ServiceCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    if (!isAutoPlaying) return

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

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  }

  return (
    <div className="relative max-w-lg lg:max-w-xl mx-auto">
      {/* Main Service Card */}
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
          className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden group"
        >
          <div className="relative overflow-hidden">
            <Image
              src={currentService.image || "/placeholder.svg"}
              alt={currentService.title}
              width={600}
              height={360}
              className="w-full h-64 lg:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {currentService.trending && (
              <Badge className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white border-0 text-sm font-medium shadow-lg z-10">
                <TrendingUp className="w-4 h-4 mr-1" />
                트렌딩
              </Badge>
            )}

            {(() => {
              const category = categories.find(cat => cat.name === currentService.category)
              return (
                <Badge 
                  className={`absolute top-4 right-4 bg-gradient-to-r ${category?.color || 'from-gray-500 to-gray-600'} text-white border-0 text-sm font-medium shadow-lg z-10 backdrop-blur-sm`}
                >
                  {currentService.category}
                </Badge>
              )
            })()}

            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="sm"
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {currentService.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {currentService.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {currentService.tags.map((tag: string, tagIndex: number) => (
                  <Badge key={tagIndex} variant="secondary" className="bg-gray-100 text-gray-600 text-sm font-medium">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-gray-500">
                  <span className="text-sm">by</span>
                  <span className="font-semibold text-gray-700">{currentService.creator}</span>
                </div>

                <div className="flex items-center space-x-4 text-gray-500">
                  <div className="flex items-center space-x-1 transition-transform hover:scale-105">
                    <Heart className="w-4 h-4" />
                    <span className="font-medium text-sm">{currentService.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1 transition-transform hover:scale-105">
                    <Eye className="w-4 h-4" />
                    <span className="font-medium text-sm">{currentService.views}</span>
                  </div>
                  <div className="flex items-center space-x-1 transition-transform hover:scale-105">
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-medium text-sm">{currentService.comments}</span>
                  </div>
                </div>
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
              index === currentIndex ? "bg-violet-600 w-8" : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Service Counter */}
      <div className="text-center mt-4">
        <span className="text-sm text-gray-500">
          {currentIndex + 1} / {services.length}
        </span>
      </div>
    </div>
  )
} 