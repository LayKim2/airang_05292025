"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Brain, ChevronRight, Heart, Eye, MessageCircle, Search } from "lucide-react"
import { useTranslation } from "@/app/i18n/useTranslation"

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

  const categories = [
    { name: "All", count: 42, category: "all" },
    { name: "Image Generation", count: 15, category: "image" },
    { name: "Text Generation", count: 12, category: "text" },
    { name: "Voice Conversion", count: 8, category: "voice" },
    { name: "Code Generation", count: 5, category: "code" },
    { name: "Data Analysis", count: 2, category: "data" }
  ]

  const services = [
    {
      id: 1,
      title: "AI Image Generator",
      description: "An AI service that generates high-quality images from text prompts. Supports various styles and resolutions.",
      image: "/images/services/image-generator.svg",
      tags: ["Image Generation", "AI", "Design"],
      author: "AIrang",
      likes: 128,
      views: 1200,
      comments: 32,
      category: "image"
    },
    {
      id: 2,
      title: "AI Code Assistant",
      description: "An AI coding helper that assists with code writing and debugging. Provides real-time code suggestions and optimization.",
      image: "/images/services/code-assistant.svg",
      tags: ["Code Generation", "Development", "AI"],
      author: "AIrang",
      likes: 256,
      views: 2100,
      comments: 45,
      category: "code"
    },
    {
      id: 3,
      title: "AI Voice Converter",
      description: "A service that converts text into natural-sounding speech. Supports various voices and languages.",
      image: "/images/services/voice-converter.svg",
      tags: ["Voice Conversion", "AI", "Content"],
      author: "AIrang",
      likes: 189,
      views: 1500,
      comments: 28,
      category: "voice"
    },
    {
      id: 4,
      title: "AI Document Summarizer",
      description: "An AI service that automatically summarizes long documents. Quickly grasp key content.",
      image: "/images/services/document-summarizer.svg",
      tags: ["Text Generation", "AI", "Productivity"],
      author: "AIrang",
      likes: 145,
      views: 1800,
      comments: 36,
      category: "text"
    },
    {
      id: 5,
      title: "AI Data Analysis Tool",
      description: "An AI tool that automatically analyzes complex data and provides insights.",
      image: "/images/services/data-analysis.svg",
      tags: ["Data Analysis", "AI", "Business"],
      author: "AIrang",
      likes: 167,
      views: 1400,
      comments: 24,
      category: "data"
    },
    {
      id: 6,
      title: "AI Translation Service",
      description: "An AI translator that provides accurate real-time translation. Supports over 100 languages.",
      image: "/images/services/translator.svg",
      tags: ["Text Generation", "AI", "Translation"],
      author: "AIrang",
      likes: 198,
      views: 2300,
      comments: 42,
      category: "text"
    }
  ]

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
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t('servicesSearchPlaceholder')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="max-w-7xl mx-auto">
                <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide justify-center">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      className="flex-shrink-0 group relative px-4 py-2.5 text-sm font-medium bg-white rounded-lg border border-gray-200 hover:border-violet-500 hover:bg-violet-50 text-gray-700 hover:text-violet-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {category.name}
                      <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-violet-100 text-violet-700 group-hover:bg-violet-200 transition-colors duration-200">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-0 shadow-lg overflow-hidden rounded-2xl sm:rounded-3xl bg-white">
                <motion.div
                  className="relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={service.image}
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

                  <Badge className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/95 text-gray-700 border-0 font-semibold text-xs sm:text-sm">
                    {t('aiService')}
                  </Badge>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-3 sm:bottom-4 left-3 sm:right-4 right-3 sm:right-4"
                  >
                    <Button className="w-full bg-white/90 text-gray-900 hover:bg-white font-semibold text-sm sm:text-base">
                      {t('viewDetails')}
                    </Button>
                  </motion.div>
                </motion.div>

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
                        <span className="font-semibold text-gray-700">{service.author}</span>
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
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
