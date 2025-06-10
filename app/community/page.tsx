"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { Sparkles, Search, Filter, MessageCircle, Heart, Share2, Bookmark, TrendingUp, Users, Lightbulb, Code, Mic, Image as ImageIcon, FileText } from "lucide-react"
import Image from "next/image"
import { useTranslation } from "@/app/i18n/useTranslation"

const categories = [
  { id: "all", name: "All", icon: TrendingUp },
  { id: "image", name: "Image Generation", icon: ImageIcon },
  { id: "voice", name: "Voice Conversion", icon: Mic },
  { id: "text", name: "Text Generation", icon: FileText },
  { id: "code", name: "Code Generation", icon: Code },
  { id: "idea", name: "Ideas", icon: Lightbulb },
]

const hotTopics = [
  {
    id: 1,
    title: "Stable Diffusion 3.0 Release",
    category: "Image Generation",
    categoryId: "image",
    comments: 128,
    likes: 256
  },
  {
    id: 2,
    title: "ChatGPT API Usage Tips",
    category: "Text Generation",
    categoryId: "text",
    comments: 95,
    likes: 189
  },
  {
    id: 3,
    title: "AI Voice Conversion Quality Improvement",
    category: "Voice Conversion",
    categoryId: "voice",
    comments: 76,
    likes: 145
  }
]

const recommendedCreators = [
  {
    id: 1,
    name: "Kim AI",
    role: "AI Image Creator",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    followers: 1234,
    projects: 15
  },
  {
    id: 2,
    name: "Lee Coding",
    role: "AI Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    followers: 856,
    projects: 8
  },
  {
    id: 3,
    name: "Park Voice",
    role: "AI Voice Creator",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    followers: 2345,
    projects: 23
  }
]

const posts = [
  {
    id: 1,
    author: "Kim AI",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    role: "AI Image Creator",
    content: "Here's my new artwork created with Stable Diffusion. Sharing the prompt!",
    image: "https://picsum.photos/800/400?random=1",
    likes: 128,
    comments: 32,
    shares: 15,
    tags: ["Image Generation", "Stable Diffusion", "Prompt"],
    category: "image"
  },
  {
    id: 2,
    author: "Lee Coding",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    role: "AI Developer",
    content: "Starting a new project using ChatGPT API. Looking for collaborators!",
    image: "https://picsum.photos/800/400?random=2",
    likes: 95,
    comments: 24,
    shares: 8,
    tags: ["Project", "ChatGPT", "Collaboration"],
    category: "code"
  },
  {
    id: 3,
    author: "Park Voice",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    role: "AI Voice Creator",
    content: "Tested a new AI voice conversion model. The results are amazing!",
    image: "https://picsum.photos/800/400?random=3",
    likes: 156,
    comments: 45,
    shares: 23,
    tags: ["Voice Conversion", "AI Model", "Test"],
    category: "voice"
  }
]

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [chatMessage, setChatMessage] = useState("")
  const { t } = useTranslation()

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    const matchesSearch = searchQuery === "" || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const chatMessages = [
    {
      user: "Kim AI",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
      message: "Hello! Have a great day 😊",
      time: "10:30"
    },
    {
      user: "Lee Coding",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
      message: "Has anyone tried Stable Diffusion 3.0?",
      time: "10:32"
    },
    {
      user: "Park Voice",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
      message: "Yes, I'm using it. What would you like to know?",
      time: "10:33"
    }
  ]

  return (
    <main className="min-h-screen pt-[128px] sm:pt-20 bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-8 md:py-12 lg:py-16">
        {/* Modern Background Elements */}
        <div className="absolute inset-0">
          {/* Animated Gradient Orbs */}
          <motion.div 
            className="absolute top-32 left-32 w-64 h-64 bg-gradient-to-r from-violet-200/20 to-purple-200/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -20, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

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
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Badge className="bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700 border-0 px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 text-base sm:text-lg font-semibold">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {t('headerCommunity')}
              </Badge>
            </motion.div>
          </motion.div>

          {/* Search and Filter Section */}
          <div className="max-w-7xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={t('communitySearchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-0 rounded-xl shadow-lg focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all duration-300"
                />
                <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "bg-violet-600 text-white shadow-lg"
                        : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-violet-50"
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Posts */}
            <div className="lg:col-span-2 space-y-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {/* Post Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={post.avatar}
                        alt={post.author}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full"
                        unoptimized
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{post.author}</h3>
                        <p className="text-sm text-gray-500">{post.role}</p>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-6">
                    <p className="text-gray-700 mb-4">{post.content}</p>
                    <Image
                      src={post.image}
                      alt="Post content"
                      width={800}
                      height={400}
                      className="w-full h-64 object-cover rounded-xl mb-4"
                      unoptimized
                    />
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-violet-100 text-violet-700 border-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="px-6 py-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-violet-600 transition-colors">
                          <Heart className="w-5 h-5" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-violet-600 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-violet-600 transition-colors">
                          <Share2 className="w-5 h-5" />
                          <span>{post.shares}</span>
                        </button>
                      </div>
                      <button className="text-gray-500 hover:text-violet-600 transition-colors">
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Real-time Chat */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Chat</h3>
                <div className="space-y-4">
                  {/* Chat Messages */}
                  <div className="h-[300px] overflow-y-auto space-y-4 mb-4">
                    {chatMessages.map((chat, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Image
                          src={chat.avatar}
                          alt={chat.user}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full"
                          unoptimized
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{chat.user}</span>
                            <span className="text-xs text-gray-500">{chat.time}</span>
                          </div>
                          <p className="text-gray-700 text-sm mt-1">{chat.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Chat Input */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                    <button className="p-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Hot Topics */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hot Topics</h3>
                <div className="space-y-4">
                  {hotTopics.map((topic) => (
                    <div key={topic.id} className="flex items-start space-x-4">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{topic.title}</h4>
                        <p className="text-sm text-gray-500">{topic.category}</p>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{topic.comments} comments</span>
                        <span>•</span>
                        <span>{topic.likes} likes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Creators */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Creators</h3>
                <div className="space-y-4">
                  {recommendedCreators.map((creator) => (
                    <div key={creator.id} className="flex items-center space-x-4">
                      <Image
                        src={creator.avatar}
                        alt={creator.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full"
                        unoptimized
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{creator.name}</h4>
                        <p className="text-sm text-gray-500">{creator.role}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">{creator.followers} followers</span>
                          <span className="text-sm text-gray-500">{creator.projects} projects</span>
                        </div>
                      </div>
                      <button className="px-3 py-1 text-sm font-medium text-violet-600 hover:text-violet-700">
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('quickActions')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex flex-col items-center justify-center p-4 bg-violet-50 rounded-xl hover:bg-violet-100 transition-colors">
                    <MessageCircle className="w-6 h-6 text-violet-600 mb-2" />
                    <span className="text-sm font-medium text-violet-600">{t('quickActionChat')}</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                    <Users className="w-6 h-6 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-blue-600">{t('quickActionCollaboration')}</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors">
                    <Lightbulb className="w-6 h-6 text-pink-600 mb-2" />
                    <span className="text-sm font-medium text-pink-600">{t('quickActionQA')}</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
                    <Code className="w-6 h-6 text-orange-600 mb-2" />
                    <span className="text-sm font-medium text-orange-600">{t('quickActionProject')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 