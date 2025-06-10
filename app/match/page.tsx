"use client"

import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { Sparkles, Search, Filter, ArrowRight, Users, UserCheck, Plus } from "lucide-react"
import { useTranslation } from "@/app/i18n/useTranslation"

const categories = [
  "전체",
  "이미지 생성",
  "텍스트 생성",
  "음성 변환",
  "코드 생성",
  "데이터 분석",
  "번역",
  "기타"
]

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
    duration: 20,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

export default function MatchPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen pt-[112px] sm:pt-16 bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-8 md:py-12 lg:py-16">
        {/* Modern Background Elements */}
        <div className="absolute inset-0">
          {/* Animated Gradient Orbs */}
          <motion.div className="absolute top-32 left-32 w-64 h-64 bg-gradient-to-r from-violet-200/20 to-purple-200/20 rounded-full blur-3xl" {...orbAnimation} />
          <motion.div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl" {...orb2Animation} />

          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

          {/* Radial Gradients */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.05),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.05),transparent_50%)]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-4 md:mb-6 lg:mb-8"
          >
            <div className="mb-4 sm:mb-6" />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Badge className="bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700 border-0 px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 text-base sm:text-lg font-semibold">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {t('headerMatch')}
              </Badge>
            </motion.div>
          </motion.div>

          {/* Match Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative group h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                <div className="flex items-center justify-center w-16 h-16 bg-violet-100 rounded-xl mb-6 mx-auto">
                  <Users className="w-8 h-8 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold text-center mb-4">{t('matchTeamProject')}</h3>
                <p className="text-gray-600 text-center mb-6 flex-grow">
                  {t('matchTeamProjectDesc')}
                </p>
                <button className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors">
                  {t('matchFindTeam')}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative group h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6 mx-auto">
                  <UserCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-center mb-4">{t('matchExpert')}</h3>
                <p className="text-gray-600 text-center mb-6 flex-grow">
                  {t('matchExpertDesc')}
                </p>
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
                  {t('matchFindExpert')}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Search Section */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder={t('matchSearchPlaceholder')}
                className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-0 rounded-xl shadow-lg focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all duration-300"
              />
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 text-gray-700 hover:text-violet-600 font-medium"
              >
                {t(`matchCategory${index}`)}
              </motion.button>
            ))}
          </div>

          {/* Filter Section */}
          <div className="flex justify-center gap-4 mb-12">
            <button className="flex items-center space-x-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
              <Filter className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700 font-medium">{t('matchFilter')}</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
              <Plus className="w-5 h-5" />
              <span className="font-medium">{t('matchNewProject')}</span>
            </button>
          </div>

          {/* Match Results Placeholder */}
          <div className="text-center text-gray-600">
            <p className="mb-4">{t('matchNoResults')}</p>
            <button className="inline-flex items-center space-x-2 text-violet-600 hover:text-violet-700 font-medium transition-colors">
              <span>{t('matchRegisterProject')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </main>
  )
} 