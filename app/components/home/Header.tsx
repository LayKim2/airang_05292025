"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Sparkles, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 50 ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-bounce" />
            </div>
            <div>
              <AnimatePresence>
                {isAnimating && (
                  <motion.h1 
                    className="text-3xl font-black"
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
              <p className="text-sm text-gray-500 font-medium">AI 공동 작업실</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            {["서비스 갤러리", "커뮤니티", "AI 트렌드", "협업 찾기", "이벤트"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-gray-700 hover:text-violet-600 transition-colors font-semibold relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-600 to-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-700 hover:text-violet-600 font-semibold">
              로그인
            </Button>
            <Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              시작하기
            </Button>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 