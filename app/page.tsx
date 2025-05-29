"use client"

import { useState } from "react"
import { Header } from "@/app/components/home/Header"
import { Hero } from "@/app/components/home/Hero"
import { CommunityConnection } from "@/app/components/home/CommunityConnection"
import { ServicesGallery } from "@/app/components/home/ServicesGallery"
import { FinalCTA } from "@/app/components/home/FinalCTA"
import { services } from "@/app/data/services"
import { members } from "@/app/data/members"
import { categories } from "@/app/data/categories"
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
import { Card, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import Link from "next/link"
import { Service, CommunityMember, Category } from "@/app/types"

export default function AIrangLanding() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  // 무한 스크롤을 위한 서비스 배열 복제
  const infiniteServices = [...services, ...services, ...services]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <Hero services={services} />
      <CommunityConnection members={members} />
      <ServicesGallery services={services} categories={categories} />
      <FinalCTA />
    </div>
  )
}
