"use client"

import { useState, useCallback, memo } from "react"
import Image from "next/image"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brain,
  Globe,
  Code,
  Palette,
  ChevronRight,
  Heart,
  Eye,
  MessageCircle,
  TrendingUp,
} from "lucide-react"
import { Service, Category } from "@/app/types"

interface ServicesGalleryProps {
  services: Service[]
  categories: Category[]
}

// 메모이제이션된 카테고리 버튼 컴포넌트
const CategoryButton = memo(({ category, isSelected, onClick }: { 
  category: Category; 
  isSelected: boolean; 
  onClick: () => void;
}) => {
  const Icon = category.icon
  return (
    <motion.div variants={itemVariants}>
      <Button
        variant={isSelected ? "default" : "outline"}
        onClick={onClick}
        className={`${
          isSelected
            ? `bg-gradient-to-r ${category.color} text-white shadow-xl hover:shadow-2xl`
            : "border-2 border-gray-300 hover:border-violet-500 hover:bg-violet-50"
        } transition-all duration-300 px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-lg`}
      >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        <span className="hidden sm:inline">{category.name}</span>
        <Badge variant="secondary" className="ml-2 sm:ml-3 text-xs sm:text-sm font-bold">
          {category.count}
        </Badge>
      </Button>
    </motion.div>
  )
})
CategoryButton.displayName = "CategoryButton"

// 메모이제이션된 서비스 카드 컴포넌트
const ServiceCard = memo(({ service, index, hoveredCard, onHover }: {
  service: Service;
  index: number;
  hoveredCard: number | null;
  onHover: (index: number | null) => void;
}) => (
  <motion.div
    key={service.id}
    variants={itemVariants}
    whileHover="hover"
    initial="initial"
    animate="initial"
  >
    <Card
      className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-0 shadow-lg overflow-hidden rounded-2xl sm:rounded-3xl bg-white ${
        hoveredCard === index ? "scale-105" : ""
      }`}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    >
      <motion.div
        className="relative overflow-hidden"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={service.image || "/placeholder.svg"}
          alt={service.title}
          width={400}
          height={240}
          className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={75}
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
        />

        {service.trending && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Badge className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white border-0 font-bold text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              트렌딩
            </Badge>
          </motion.div>
        )}

        <Badge className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/95 text-gray-700 border-0 font-semibold text-xs sm:text-sm">
          {service.category}
        </Badge>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-3 sm:bottom-4 left-3 sm:right-4 right-3 sm:right-4"
        >
          <Button className="w-full bg-white/90 text-gray-900 hover:bg-white font-semibold text-sm sm:text-base">
            자세히 보기
          </Button>
        </motion.div>
      </motion.div>

      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-violet-600 transition-colors">
              {service.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{service.description}</p>
          </div>

          <div className="flex flex-wrap gap-1 sm:gap-2">
            {service.tags.map((tag, tagIndex) => (
              <motion.div
                key={tagIndex}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: tagIndex * 0.1 }}
              >
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-600 hover:bg-violet-100 hover:text-violet-700 transition-colors font-medium text-xs sm:text-sm"
                >
                  {tag}
                </Badge>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
              <span>by</span>
              <span className="font-semibold text-gray-700">{service.creator}</span>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4 text-gray-500 text-sm">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-1"
              >
                <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium">{service.likes}</span>
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
        </div>
      </CardContent>
    </Card>
  </motion.div>
))
ServiceCard.displayName = "ServiceCard"

// 애니메이션 variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

export function ServicesGallery({ services, categories }: ServicesGalleryProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("전체")

  const handleCategoryClick = useCallback((categoryName: string) => {
    setSelectedCategory(categoryName)
  }, [])

  const handleCardHover = useCallback((index: number | null) => {
    setHoveredCard(index)
  }, [])

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Badge className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-0 px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 text-base sm:text-lg font-semibold">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              크리에이터들의 AI 작품
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 sm:mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              AI로 만든 혁신적인
            </span>
            <br />
            <span className="text-gray-900">서비스들을 만나보세요</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4"
          >
            AIrang 커뮤니티 멤버들이 AI 기술을 활용해 직접 개발한 다양한 서비스들을 둘러보고 영감을 얻어보세요.
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 lg:mb-16 px-2"
        >
          {categories.map((category) => (
            <CategoryButton
              key={category.name}
              category={category}
              isSelected={selectedCategory === category.name}
              onClick={() => handleCategoryClick(category.name)}
            />
          ))}
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              hoveredCard={hoveredCard}
              onHover={handleCardHover}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-8 sm:mt-12 lg:mt-16"
        >
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-gray-300 hover:border-violet-500 hover:bg-violet-50 font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 text-base sm:text-lg"
          >
            더 많은 서비스 보기
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
} 