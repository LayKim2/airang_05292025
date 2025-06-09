"use client"

import { memo, useCallback } from "react"
import Image from "next/image"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { motion } from "framer-motion"
import {
  Network,
  UserPlus,
  MessageSquare,
  Handshake,
  MapPin,
  Briefcase,
  Rocket,
  Users,
  Clock,
} from "lucide-react"
import { CommunityMember, Feature } from "@/app/types"
import { useTranslation } from "@/app/i18n/useTranslation"

interface CommunityConnectionProps {
  members: CommunityMember[]
}

// 메모이제이션된 피처 카드 컴포넌트
const FeatureCard = memo(({ feature }: { feature: Feature }) => {
  const Icon = feature.icon
  return (
    <Card className="p-6 sm:p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl sm:rounded-3xl group bg-white/80 backdrop-blur-sm">
      <div
        className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{feature.title}</h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
    </Card>
  )
})
FeatureCard.displayName = "FeatureCard"

// 메모이제이션된 멤버 카드 컴포넌트
const MemberCard = memo(({ member }: { member: CommunityMember }) => {
  const { t } = useTranslation();
  return (
    <Card className="p-4 sm:p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl sm:rounded-2xl group bg-white hover:-translate-y-1">
      <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
        <div className="relative">
          <Image
            src={member.avatar || "/placeholder.svg"}
            alt={member.name}
            width={80}
            height={80}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
            loading="lazy"
            sizes="(max-width: 640px) 48px, 64px"
            quality={75}
          />
          <div
            className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white ${
              member.status === t('statusOnline') ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 text-base sm:text-lg">{member.name}</h4>
          <p className="text-gray-600 text-xs sm:text-sm">{member.role}</p>
          <div className="flex items-center space-x-3 sm:space-x-4 mt-2 text-xs text-gray-500">
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

        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center space-x-1">
              <Rocket className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{`${member.projects}${t('projectsCount')}`}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{`${member.connections}${t('connectionsCount')}`}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-green-600">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{member.status}</span>
          </div>
        </div>

        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg sm:rounded-xl text-sm sm:text-base">
          {t('connect')}
        </Button>
      </div>
    </Card>
  )
})
MemberCard.displayName = "MemberCard"

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

export function CommunityConnection({ members }: CommunityConnectionProps) {
  const { t } = useTranslation();
  const features: Feature[] = [
    {
      icon: UserPlus,
      title: t('communityFeatureSmartMatching'),
      description: t('communityFeatureSmartMatchingDesc'),
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: MessageSquare,
      title: t('communityFeatureRealtimeInsight'),
      description: t('communityFeatureRealtimeInsightDesc'),
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Handshake,
      title: t('communityFeatureProjectMatching'),
      description: t('communityFeatureProjectMatchingDesc'),
      color: "from-green-500 to-emerald-500",
    },
  ]

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
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
            <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0 px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 text-base sm:text-lg font-semibold">
              <Network className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {t('communityBadge')}
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 sm:mb-8 leading-tight"
          >
            <span className="text-gray-900">{t('communityTitleAlone')}</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('communityTitleHighlight')}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4"
          >
            {t('communityDesc')}
          </motion.p>
        </motion.div>

        {/* Connection Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <FeatureCard feature={feature} />
            </motion.div>
          ))}
        </motion.div>

        {/* Community Members Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">{t('communityActiveCreators')}</h3>
            <p className="text-sm sm:text-base text-gray-600">{t('communityActiveCreatorsDesc')}</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {members.map((member) => (
              <motion.div key={member.id} variants={itemVariants}>
                <MemberCard member={member} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center mt-8 sm:mt-12"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-base sm:text-lg"
            >
              <Network className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              {t('communityMoreCreators')}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 