"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Sparkles, Menu, X, Grid, Users, HeartHandshake, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher"

// 모바일 하단 메뉴 높이 상수 (예: 48px)
export const MOBILE_HEADER_TAB_HEIGHT = 56;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(false)
      setTimeout(() => setIsAnimating(true), 100)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const isServicesPage = pathname === "/services"
  const isTrendsPage = pathname === "/trends"
  const isMatchPage = pathname === "/match"
  const isCommunityPage = pathname === "/community"
  const isLandingPage = pathname === "/landing"

  const menuItems = [
    { name: "AI Services", path: "/services", icon: <Grid className="w-5 h-5 mb-0.5" /> },
    { name: "Community", path: "/community", icon: <Users className="w-5 h-5 mb-0.5" /> },
    { name: "Match", path: "/match", icon: <HeartHandshake className="w-5 h-5 mb-0.5" /> },
    { name: "Trends", path: "/trends", icon: <TrendingUp className="w-5 h-5 mb-0.5" /> }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isLandingPage 
          ? "bg-transparent" 
          : isServicesPage || isTrendsPage || isMatchPage || isCommunityPage || scrollY > 50 
            ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100" 
            : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-2 sm:py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3 sm:space-x-4">
            {isLandingPage ? (
              <div className="flex items-center space-x-3 sm:space-x-4 group">
                <div className="relative group">
                  <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-bounce" />
                </div>
                <div>
                  <AnimatePresence>
                    {isAnimating && (
                      <motion.h1 
                        className="text-xl sm:text-3xl font-black text-white"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.span 
                          className="bg-clip-text text-transparent"
                          animate={{
                            backgroundImage: [
                              "linear-gradient(to right, #2563eb, #7c3aed, #db2777)",
                              "linear-gradient(to right, #7c3aed, #db2777, #2563eb)",
                              "linear-gradient(to right, #db2777, #2563eb, #7c3aed)",
                              "linear-gradient(to right, #2563eb, #7c3aed, #db2777)",
                            ]
                          }}
                          transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        >
                          AIrang
                        </motion.span>
                      </motion.h1>
                    )}
                  </AnimatePresence>
                  <p className="text-xs sm:text-sm font-medium text-gray-300">
                    AI 크리에이터 커뮤니티
                  </p>
                </div>
              </div>
            ) : (
              <Link href="/" className="flex items-center space-x-3 sm:space-x-4 group">
                <div className="relative group">
                  <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-bounce" />
                </div>
                <div>
                  <AnimatePresence>
                    {isAnimating && (
                      <motion.h1 
                        className="text-xl sm:text-3xl font-black"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.span 
                          className="bg-clip-text text-transparent"
                          animate={{
                            backgroundImage: [
                              "linear-gradient(to right, #2563eb, #7c3aed, #db2777)",
                              "linear-gradient(to right, #7c3aed, #db2777, #2563eb)",
                              "linear-gradient(to right, #db2777, #2563eb, #7c3aed)",
                              "linear-gradient(to right, #2563eb, #7c3aed, #db2777)",
                            ]
                          }}
                          transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        >
                          AIrang
                        </motion.span>
                      </motion.h1>
                    )}
                  </AnimatePresence>
                  <p className="text-xs sm:text-sm font-medium text-gray-500">
                    AI 크리에이터 커뮤니티
                  </p>
                </div>
              </Link>
            )}
          </div>

          {!isLandingPage && (
            <>
              <nav className="hidden lg:flex items-center space-x-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`transition-colors font-semibold relative group ${
                      isServicesPage || isTrendsPage || isMatchPage || isCommunityPage || scrollY > 50
                        ? "text-gray-700 hover:text-violet-600"
                        : "text-gray-200 hover:text-white"
                    } ${
                      pathname === item.path
                        ? isServicesPage || isTrendsPage || isMatchPage || isCommunityPage || scrollY > 50
                          ? "text-violet-600"
                          : "text-white"
                        : ""
                    }`}
                  >
                    {item.name}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-violet-600 to-blue-600 transition-all duration-300 ${
                      pathname === item.path ? "w-full" : "w-0 group-hover:w-full"
                    }`} />
                  </Link>
                ))}
              </nav>

              <div className="hidden sm:flex items-center space-x-4">
                {/* 로그인/시작하기 버튼 - 현재 비활성화
                <Button variant="ghost" className="text-gray-700 hover:text-violet-600 font-semibold">
                  로그인
                </Button>
                <Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  시작하기
                </Button>
                */}
                <LanguageSwitcher />
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className={`sm:hidden z-50 ml-2 ${
                  isServicesPage || isTrendsPage || isMatchPage || isCommunityPage || scrollY > 50
                    ? "text-gray-700 hover:text-violet-600"
                    : "text-gray-200 hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {!isLandingPage && isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="lg:hidden fixed inset-0 top-[72px] bg-white/95 backdrop-blur-xl z-40"
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span className="text-gray-700 font-semibold">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </motion.div>
      )}

      {/* Mobile Bottom Navigation */}
      {!isLandingPage && (
        <nav className="lg:hidden w-full px-0 pt-1 pb-2 sticky top-[56px] z-40">
          <div className="flex w-full px-2">
            <div className="flex w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-lg py-2 px-1 gap-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex flex-col items-center justify-center flex-1 min-w-0 px-0 py-1.5 rounded-xl transition-all duration-200 font-semibold text-xs gap-0.5
                    ${pathname === item.path ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-md ring-2 ring-violet-300" : "bg-white/60 text-gray-700 hover:bg-violet-50"
                    }`}
                  style={{ boxShadow: pathname === item.path ? '0 2px 12px 0 rgba(124,58,237,0.15)' : undefined }}
                >
                  {item.icon}
                  <span>{item.name.replace('AI ', '')}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  )
} 