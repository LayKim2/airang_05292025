"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Sparkles, Search, Filter, MessageCircle, Heart, Eye, TrendingUp, Users, Lightbulb, Code, Mic, Image as ImageIcon, FileText, Plus, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "@/app/i18n/useTranslation"
import { postsApi, Post } from "@/app/lib/api"
import { useUser } from "@clerk/nextjs"
import PostCreateModal from "@/app/components/community/PostCreateModal"

const categories = [
  { id: "all", name: "All", icon: TrendingUp },
  { id: "AI", name: "AI", icon: Sparkles },
  { id: "Development", name: "Development", icon: Code },
  { id: "Design", name: "Design", icon: ImageIcon },
  { id: "Ideas", name: "Ideas", icon: Lightbulb },
  { id: "Questions", name: "Questions", icon: MessageCircle },
]

// 하드코딩 댓글 수 (임시)
const hardcodedCommentCounts = [32, 24, 45, 23, 67, 12, 8, 19, 5, 14]

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { t } = useTranslation()
  const { user, isSignedIn } = useUser()

  // 게시글 목록 조회
  const fetchPosts = async (page: number = 1, reset: boolean = false) => {
    try {
      setLoading(true)
      setError(null)
      
      const params: any = {
        page,
        limit: 10
      }
      
      if (selectedCategory !== "all") {
        params.category = selectedCategory
      }
      
      if (searchQuery.trim()) {
        params.search = searchQuery.trim()
      }

      const response = await postsApi.getPosts(params)
      
      if (reset) {
        setPosts(response.posts || [])
      } else {
        setPosts(prev => [...prev, ...(response.posts || [])])
      }
      
      setHasMore(response.pagination?.totalPages > page)
      setCurrentPage(page)
      
    } catch (err: any) {
      setError(err.message || '게시글을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 카테고리 변경
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
    fetchPosts(1, true)
  }

  // 검색
  const handleSearch = () => {
    setCurrentPage(1)
    fetchPosts(1, true)
  }

  // 더보기
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(currentPage + 1, false)
    }
  }

  // 초기 로드
  useEffect(() => {
    fetchPosts(1, true)
    // eslint-disable-next-line
  }, [])

  // 검색어 변경 시 자동 검색 (디바운스)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== "") {
        handleSearch()
      }
    }, 500)

    return () => clearTimeout(timer)
    // eslint-disable-next-line
  }, [searchQuery])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return '방금 전'
    if (diffInHours < 24) return `${diffInHours}시간 전`
    if (diffInHours < 48) return '어제'
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <main className="min-h-screen pt-[128px] sm:pt-20 bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-8 md:py-12 lg:py-16">
        {/* Modern Background Elements */}
        <div className="absolute inset-0">
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
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('community.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg"
                        : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-violet-50 border border-gray-200"
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Post Create Button (모달) */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-end mb-6">
            {isSignedIn && <PostCreateModal />}
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          {/* Posts Grid */}
          <div className="space-y-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* 이미지 */}
                {post.image_url && (
                  <div className="w-full h-64 relative bg-gray-100">
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover object-center rounded-t-2xl"
                      sizes="(max-width: 768px) 100vw, 700px"
                    />
                  </div>
                )}
                <div className="p-6">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center text-white font-semibold overflow-hidden">
                        {post.users?.avatar_url ? (
                          <Image src={post.users.avatar_url} alt="avatar" width={40} height={40} className="rounded-full object-cover" />
                        ) : (
                          (post.users?.first_name?.[0] || 'U')
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {post.users?.first_name} {post.users?.last_name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <span>{post.users?.role || 'Member'}</span>
                          <span>·</span>
                          <Clock className="w-3 h-3" />
                          {formatDate(post.created_at)}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                  </div>

                  {/* Post Content */}
                  <Link href={`/community/${post.id}`}>
                    <div className="cursor-pointer">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-violet-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.content}
                      </p>
                    </div>
                  </Link>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{post.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-gray-500 hover:text-violet-600 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{hardcodedCommentCounts[index % hardcodedCommentCounts.length]}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{post.like_count || 0}</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">{post.view_count || 0}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
              <p className="mt-2 text-gray-600">{t('community.loading')}</p>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-8"
            >
              <Button
                onClick={handleLoadMore}
                variant="outline"
                className="px-6 py-3 rounded-xl"
              >
                {t('community.loadMore')}
              </Button>
            </motion.div>
          )}

          {/* No Posts */}
          {!loading && posts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('community.noPostsTitle')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('community.noPostsDesc')}
              </p>
              {isSignedIn && (
                <Link href="/community/write">
                  <Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('community.writeButton')}
                  </Button>
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  )
} 