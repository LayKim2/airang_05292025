"use client"

import { Hero } from "@/app/components/home/Hero"
import { CommunityConnection } from "@/app/components/home/CommunityConnection"
import ServicesGallery from "@/app/components/home/ServicesGallery"
import { Footer } from "@/app/components/home/FinalCTA"
import { services } from "@/app/data/services"
import { members } from "@/app/data/members"
import { categories } from "@/app/data/categories"
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";

export default function AIrangLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-x-hidden pt-[48px] sm:pt-0">
      <div className="absolute right-8 top-8 z-20">
        <LanguageSwitcher />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <Hero services={services} />
      <CommunityConnection members={members} />
      <ServicesGallery services={services} categories={categories} />
      <Footer />
    </div>
  )
}
