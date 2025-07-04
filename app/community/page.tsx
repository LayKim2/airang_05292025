"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Sparkles, Search, TrendingUp, Share2, BookText, MessageCircleQuestion, Archive, Heart, Eye, Plus, Clock, FileText, MessageCircle, Filter } from "lucide-react"
import Image from "next/image"
import { useTranslation } from "@/app/i18n/useTranslation"
import { postsApi } from "@/app/lib/api"
import { Post } from "@/app/types"
import { useUser, useClerk } from "@clerk/nextjs"
import PostCreateModal from "@/app/components/community/PostCreateModal"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select"
import { supabase } from "@/lib/supabase"
import SiteLoader from "@/app/components/ui/SiteLoader";

export default function CommunityPage() {
  const { t } = useTranslation()

  const categories = [
    { id: "all", name: t('aiTools.category.all'), icon: TrendingUp },
    { id: "PromptSharing", name: t('community.categories.promptSharing'), icon: Share2 },
    { id: "TipsAndKnowHow", name: t('community.categories.tipsAndKnowHow'), icon: BookText },
    { id: "QAndAAndFeedback", name: t('community.categories.qAndAAndFeedback'), icon: MessageCircleQuestion },
    { id: "General", name: t('community.categories.general'), icon: Archive },
  ]

  const sortOptions = [
    { id: "latest", name: t('community.sort.latest') },
    { id: "popular", name: t('community.sort.popular') },
  ]

  // 하드코딩 댓글 수 (임시)
  const hardcodedCommentCounts = [32, 24, 45, 23, 67, 12, 8, 19, 5, 14]

  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("latest")
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { user, isSignedIn } = useUser()
  const { openSignIn } = useClerk()
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState(selectedCategory)
  const [filterSort, setFilterSort] = useState(sortBy)
  const [filterSearch, setFilterSearch] = useState(searchQuery)
  const [postModalOpen, setPostModalOpen] = useState(false)

  // [MCP] 게시글 목록 조회 - Supabase 직접 호출 (API Route 미사용)
  const fetchPosts = async (page: number = 1, reset: boolean = false) => {
    try {
      setLoading(true)
      setError(null)

      // [MCP] 쿼리 파라미터 준비
      const limit = 10
      const from = (page - 1) * limit
      const to = from + limit - 1

      // [MCP] posts + 작성자(users) + 좋아요(post_likes) join (post_likes는 전체 컬럼)
      let query = supabase
        .from('posts')
        .select(`*, users:author_id(*), post_likes(*)`, { count: 'exact' })
        .range(from, to)

      // [MCP] 정렬 옵션
      query = query.order('created_at', { ascending: false })
      // [MCP] 카테고리 필터
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }
      // [MCP] 검색 필터 (본문 기준)
      if (searchQuery.trim()) {
        query = query.ilike('content', `%${searchQuery.trim()}%`)
      }

      const { data, error, count } = await query
      if (error) throw new Error(error.message || t('community.errorFetch'))

      // [MCP] 현재 로그인 유저 id (Clerk)
      const userId = user?.id
      // [MCP] 각 post별로 liked_by_user, like_count 계산
      let postsWithLike = (data || []).map((post: any) => ({
        ...post,
        liked_by_user: userId ? Array.isArray(post.post_likes) && post.post_likes.some((like: any) => like.user_id === userId) : false,
        like_count: Array.isArray(post.post_likes) ? post.post_likes.length : 0,
        users: post.users,
      }))
      // [MCP] 인기순 정렬은 프론트에서 like_count 내림차순
      if (sortBy === 'popular') {
        postsWithLike = postsWithLike.sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
      }

      if (reset) {
        setPosts(postsWithLike)
      } else {
        setPosts(prev => [...prev, ...postsWithLike])
      }
      setHasMore((count || 0) > page * limit)
      setCurrentPage(page)
    } catch (err: any) {
      setError(err.message || t('community.errorFetch'))
    } finally {
      setLoading(false)
    }
  }

  // 카테고리 변경
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
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

  // 초기 로드 또는 카테고리/검색어 변경 시 데이터 리프레시
  useEffect(() => {
    fetchPosts(1, true)
    // eslint-disable-next-line
  }, [selectedCategory, sortBy, searchQuery])

  // 좋아요 토글 핸들러
  const handleLike = async (postId: number) => {
    const originalPosts = [...posts];
    
    // Optimistic UI update
    setPosts(currentPosts =>
      currentPosts.map(p => {
        if (p.id === postId) {
          const wasLiked = p.liked_by_user;
          return {
            ...p,
            liked_by_user: !wasLiked,
            like_count: wasLiked
              ? (p.like_count || 1) - 1
              : (p.like_count || 0) + 1,
          };
        }
        return p;
      })
    );

    try {
      await postsApi.togglePostLike(postId.toString());
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setPosts(originalPosts);
    }
  };

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

  const extractImageUrl = (htmlContent: string) => {
    if (!htmlContent) return null;
    const match = htmlContent.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : null;
  };

  // 필터 팝업 열릴 때 임시 상태로 복사
  const openFilter = () => {
    setFilterCategory(selectedCategory);
    setFilterSort(sortBy);
    setFilterSearch(searchQuery);
    setFilterOpen(true);
  };

  // 필터 적용 함수
  const applyFilter = () => {
    setSelectedCategory(filterCategory);
    setSortBy(filterSort);
    setSearchQuery(filterSearch);
    setFilterOpen(false);
    setCurrentPage(1);
    fetchPosts(1, true);
  };

  // [MCP] content 내 이미지에 rounded-xl 클래스 자동 추가 함수 ( 모서리 둥글게 )
  function formatContentWithRoundedImages(content: string): string {
    if (!content) return '';
    // <img ...> 태그에 class="rounded-xl ..." 추가 (이미 class 있으면 병합)
    return content.replace(/<img([^>]*?)class=["']([^"'>]*)["']([^>]*)>/gi, (match, before, cls, after) => {
      // 이미 rounded-xl이 있으면 중복 추가 방지
      if (cls.includes('rounded-xl')) return match;
      return `<img${before}class="rounded-xl ${cls}"${after}>`;
    }).replace(/<img((?!class=)[^>])*?>/gi, (match, before) => {
      // class 속성이 없는 img 태그에 추가
      return match.replace('<img', '<img class="rounded-xl"');
    });
  }

  return (
    <main className="min-h-screen pt-14 sm:pt-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="relative">
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
        
        {/* Hero Section */}
        <section className="py-8 md:py-12 lg:py-16">
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
              <div className="flex flex-col gap-4">
                {/* Search Bar + Filter Button */}
                <div className="w-full flex items-center gap-2">
                  {/* 검색 input + 왼쪽 아이콘 */}
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder={t('community.searchPlaceholder')}
                      value={filterSearch}
                      onChange={(e) => setFilterSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setSearchQuery(filterSearch);
                        }
                      }}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                  {/* 검색 실행 버튼 (돋보기) */}
                  <button
                    type="button"
                    className="flex items-center justify-center px-4 py-2 bg-white/80 border border-gray-200 rounded-xl shadow-sm hover:bg-violet-50 transition-colors whitespace-nowrap"
                    onClick={() => setSearchQuery(filterSearch)}
                    aria-label={t('community.filter.search')}
                  >
                    <Search className="w-5 h-5 text-violet-600" />
                  </button>
                  {/* 필터 버튼 */}
                  <button
                    type="button"
                    className="flex items-center gap-1 px-4 py-2 bg-white/80 border border-gray-200 rounded-xl shadow-sm hover:bg-violet-50 transition-colors whitespace-nowrap"
                    onClick={openFilter}
                  >
                    <Filter className="w-5 h-5 text-violet-600" />
                  </button>
                </div>
                {/* 적용된 필터 Chip UI */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {/* 카테고리 Chip */}
                  {selectedCategory !== "all" && (
                    <span className="inline-flex items-center bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium">
                      {t('community.filter.category')}: {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}
                      <button
                        className="ml-2 text-violet-400 hover:text-violet-700 focus:outline-none"
                        onClick={() => {
                          setSelectedCategory("all");
                          setCurrentPage(1);
                          fetchPosts(1, true);
                        }}
                        aria-label="카테고리 필터 해제"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {/* 정렬 Chip */}
                  {sortBy !== "latest" && (
                    <span className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {t('community.filter.sort')}: {sortOptions.find(o => o.id === sortBy)?.name || sortBy}
                      <button
                        className="ml-2 text-blue-400 hover:text-blue-700 focus:outline-none"
                        onClick={() => {
                          setSortBy("latest");
                          setCurrentPage(1);
                          fetchPosts(1, true);
                        }}
                        aria-label="정렬 필터 해제"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {/* 검색어 Chip */}
                  {searchQuery.trim() !== "" && (
                    <span className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                      {t('community.filter.search')}: {searchQuery}
                      <button
                        className="ml-2 text-gray-400 hover:text-gray-700 focus:outline-none"
                        onClick={() => {
                          setSearchQuery("");
                          setCurrentPage(1);
                          fetchPosts(1, true);
                        }}
                        aria-label="검색어 필터 해제"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {/* 전체 초기화 버튼 */}
                  {(selectedCategory !== "all" || sortBy !== "latest" || searchQuery.trim() !== "") && (
                    <button
                      className="inline-flex items-center bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-300 ml-2"
                      onClick={() => {
                        setSelectedCategory("all");
                        setSortBy("latest");
                        setSearchQuery("");
                        setCurrentPage(1);
                        fetchPosts(1, true);
                      }}
                    >
                      {t('community.filter.reset')}
                    </button>
                  )}
                </div>
              </div>
              {/* 필터 팝업(모달) */}
              {filterOpen && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center">
                  {/* 완전한 회색 오버레이, 클릭 방지, 모든 컨텐츠 위에 덮기 */}
                  <div className="fixed inset-0 bg-gray-900 opacity-60 pointer-events-auto z-[1100]" />
                  <div className="fixed top-1/2 left-1/2 z-[1110] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                      onClick={() => setFilterOpen(false)}
                    >
                      <span className="text-xl">×</span>
                    </button>
                    <div className="mb-4 text-lg font-bold text-gray-900">{t('community.filter.title')}</div>
                    <div className="flex flex-col gap-4">
                      {/* Sort By Filter */}
                      <div>
                        <div className="mb-1 text-sm font-medium text-gray-700">{t('community.filter.sort')}</div>
                        <Select value={filterSort} onValueChange={setFilterSort}>
                          <SelectTrigger className="w-full h-[46px] bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl truncate">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            {sortOptions.map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                {option.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Category Filter Dropdown */}
                      <div>
                        <div className="mb-1 text-sm font-medium text-gray-700">{t('community.filter.category')}</div>
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                          <SelectTrigger className="w-full h-[46px] bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl truncate">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center gap-2">
                                  <category.icon className="w-4 h-4" />
                                  {category.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <Button onClick={applyFilter} variant="default" className="px-6 py-2 rounded-xl">
                        {t('community.filter.apply')}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Posts Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-0">
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
            <div className="space-y-8">
              {posts.map((post, index) => {
                // 카테고리 정보 추출
                const categoryObj = categories.find(c => c.id === post.category);
                const CategoryIcon = categoryObj?.icon;

                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    {/* 본문 영역 */}
                    <div className="flex-1 flex flex-col justify-between p-6">
                      {/* 상단: 유저 정보 & 카테고리 */}
                      <div className="flex flex-col items-start gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* 유저/날짜 */}
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
                            <div className="text-xs text-gray-400 flex items-center gap-2">
                              <span>{post.users?.role || 'Member'}</span>
                              <span>·</span>
                              <Clock className="w-3 h-3" />
                              {formatDate(post.created_at)}
                            </div>
                          </div>
                        </div>
                        {/* 카테고리 */}
                        <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 self-end sm:self-auto">
                          {CategoryIcon && <CategoryIcon className="w-4 h-4" />}
                          {categoryObj?.name || post.category}
                        </span>
                      </div>
                      
                      {/* 내용 */}
                      {/* [MCP] 이미지가 포함된 content는 img에 rounded-xl 적용 */}
                      <div 
                        className="prose prose-sm max-w-none text-gray-700 mb-4"
                        dangerouslySetInnerHTML={{ __html: formatContentWithRoundedImages(post.content) }}
                      />

                      {/* 태그/액션 하단 고정 */}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2">
                          {post.tags && post.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {post.tags && post.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{post.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-sm text-gray-500 flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Heart
                                className={`w-4 h-4 cursor-pointer transition-colors ${
                                  post.liked_by_user
                                    ? 'text-red-500 fill-current'
                                    : 'text-gray-400 hover:text-red-500'
                                }`}
                                onClick={(e) => {
                                  e.preventDefault(); // Stop propagation to the link
                                  e.stopPropagation();
                                  if (!isSignedIn) {
                                    openSignIn();
                                    return;
                                  }
                                  handleLike(post.id);
                                }}
                              />
                              <span>{post.like_count || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4 text-gray-400" />
                              {/* Using hardcoded values for now */}
                              <span>{hardcodedCommentCounts[index % hardcodedCommentCounts.length]}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span className="text-sm">{post.view_count || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Loading State */}
            {loading && <SiteLoader text={t('community.loading')} />}

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
              </motion.div>
            )}
          </div>
        </section>

        {/* [MCP] 플로팅 버튼: 로그인 안 했으면 Clerk 로그인, 했으면 Post 작성 모달 */}
        <button
          className="fixed bottom-8 right-8 z-0 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-xl hover:scale-105 transition-all duration-300"
          aria-label={t('community.createPost')}
          onClick={() => {
            if (!isSignedIn) {
              openSignIn();
            } else {
              setPostModalOpen(true);
            }
          }}
        >
          <Plus className="w-8 h-8" />
        </button>
        <PostCreateModal
          open={postModalOpen}
          onOpenChange={setPostModalOpen}
          onPostCreated={() => {
            setPostModalOpen(false);
            fetchPosts(1, true);
          }}
        />
      </div>
    </main>
  )
} 