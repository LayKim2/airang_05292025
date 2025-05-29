"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Brain, ChevronRight, Heart, Eye, MessageCircle } from "lucide-react"

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-24">
      {/* Hero Section */}
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
          </motion.div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-0 shadow-lg overflow-hidden rounded-2xl sm:rounded-3xl bg-white">
                <motion.div
                  className="relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/placeholder.svg"
                    alt={`AI 서비스 ${item}`}
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
                    AI 서비스
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
                        AI 서비스 {item}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        AI 기술을 활용한 혁신적인 서비스입니다. 다양한 기능을 경험해보세요.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {["AI", "인공지능", "자동화"].map((tag, tagIndex) => (
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
                        <span className="font-semibold text-gray-700">AIrang</span>
                      </div>

                      <div className="flex items-center space-x-3 sm:space-x-4 text-gray-500 text-sm">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="flex items-center space-x-1"
                        >
                          <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="font-medium">128</span>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="font-medium">1.2k</span>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="flex items-center space-x-1"
                        >
                          <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="font-medium">32</span>
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
