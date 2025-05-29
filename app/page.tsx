"use client"

import { Hero } from "@/app/components/home/Hero"
import { CommunityConnection } from "@/app/components/home/CommunityConnection"
import { ServicesGallery } from "@/app/components/home/ServicesGallery"
import { FinalCTA } from "@/app/components/home/FinalCTA"
import { services } from "@/app/data/services"
import { members } from "@/app/data/members"
import { categories } from "@/app/data/categories"

export default function AIrangLanding() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Hero services={services} />
      <CommunityConnection members={members} />
      <ServicesGallery services={services} categories={categories} />
      <FinalCTA />
    </div>
  )
}
