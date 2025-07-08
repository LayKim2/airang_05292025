"use client"

import { useState, useEffect, useLayoutEffect, Suspense } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Sparkles, Menu, X, Grid, Users, HeartHandshake, TrendingUp, Wrench, User, ChevronRight, Award } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher"
import { useTranslation } from "@/app/i18n/useTranslation"
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs"

// 모바일 하단 메뉴 높이 상수 (예: 48px)
export const MOBILE_HEADER_TAB_HEIGHT = 56;

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)
  const pathname = usePathname()
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { user, isLoaded } = useUser();
  const [showScrollRight, setShowScrollRight] = useState(false);

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

  useLayoutEffect(() => {
    const el = document.getElementById('mobile-menu-scroll');
    if (!el) return;
    const checkScroll = () => {
      setShowScrollRight(el.scrollWidth > el.clientWidth && el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    };
    checkScroll();
    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const isServicesPage = pathname === "/services"
  const isAIToolsPage = pathname === "/ai-tools"
  const isMatchPage = pathname === "/match"
  const isCommunityPage = pathname === "/community"
  const isMyPage = pathname === "/mypage";

  // [MCP] 메뉴 항목: 데스크탑/모바일 분기용, 마이페이지는 모바일에서만 노출
  // [다국어] 메뉴 이름은 i18n 번역 키 사용
  const baseMenuItems = [
    { name: t('header.aiServices'), path: "/services", icon: <Grid className="w-5 h-5 mb-0.5" /> },
    { name: t('header.match'), path: "/match", icon: <HeartHandshake className="w-5 h-5 mb-0.5" /> },
    { name: t('header.community'), path: "/community", icon: <Users className="w-5 h-5 mb-0.5" /> },
    { name: t('header.aiTools'), path: "/ai-tools", icon: <Wrench className="w-5 h-5 mb-0.5" /> }
  ];
  // [MCP] 마이페이지 메뉴 별도 분리
  const myPageMenu = { name: t('header.myPage'), path: "/mypage", icon: <User className="w-5 h-5 mb-0.5" /> };

  // [MCP] 마이페이지 사이드바 메뉴(모바일용) - mypage에서만 사용
  const myPageMenuItems = [
    { name: t('mypage.menu.profile'), path: "/mypage", icon: <User className="w-5 h-5 mb-0.5" /> },
    { name: t('mypage.menu.expertStatus'), path: "/mypage?tab=expert-status", icon: <Award className="w-5 h-5 mb-0.5" /> }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isMyPage
            ? "bg-white border-b border-gray-100 shadow"
            : isServicesPage || isAIToolsPage || isMatchPage || isCommunityPage || scrollY > 50
              ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100"
              : "bg-transparent"
        }`}
      >
        <div className={isMyPage ? "w-full px-4 sm:px-6 py-2 sm:py-4" : "container mx-auto px-4 sm:px-6 py-2 sm:py-4"}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3 sm:space-x-4">
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
                    {t('headerCommunity')}
                  </p>
                </div>
              </Link>
            </div>
            {/* [MCP] 데스크탑 nav는 마이페이지에서만 숨김, 모바일 메뉴(햄버거/하단탭)는 항상 노출 */}
            {(!isMyPage) && (
              <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
                {/* [MCP] 데스크탑 메뉴: 마이페이지 제외 */}
                {baseMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`transition-colors font-semibold relative group ${
                      isServicesPage || isAIToolsPage || isMatchPage || isCommunityPage || scrollY > 50
                        ? "text-gray-700 hover:text-violet-600"
                        : "text-gray-200 hover:text-white"
                    } ${
                      pathname === item.path
                        ? isServicesPage || isAIToolsPage || isMatchPage || isCommunityPage || scrollY > 50
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
            )}
            <div className="hidden sm:flex items-center space-x-4">
              <LanguageSwitcher />
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-gradient-to-r from-violet-500 to-blue-500 text-white font-medium px-4 py-2 rounded-lg shadow-sm hover:from-violet-600 hover:to-blue-600 hover:shadow-md hover:scale-105 transition-all duration-200 border-none"
                  >
                    {t('signIn')}
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/">
                  <UserButton.MenuItems>
                    <UserButton.Link label={t('header.myPage')} href="/mypage" labelIcon={<User className="w-4 h-4" />} />
                  </UserButton.MenuItems>
                </UserButton>
              </SignedIn>
            </div>
            {/* [MCP] 모바일 메뉴(햄버거/하단탭)는 항상 노출 */}
            <div className="flex items-center space-x-2 sm:hidden">
              <LanguageSwitcher />
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="sm:hidden bg-gradient-to-r from-violet-500 to-blue-500 text-white font-medium px-3 py-2 rounded-lg shadow-sm hover:from-violet-600 hover:to-blue-600 hover:shadow-md hover:scale-105 transition-all duration-200 border-none"
                  >
                    {t('signIn')}
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/">
                  <UserButton.MenuItems>
                    <UserButton.Link label={t('header.myPage')} href="/mypage" labelIcon={<User className="w-4 h-4" />} />
                  </UserButton.MenuItems>
                </UserButton>
              </SignedIn>
              <Button 
                variant="ghost" 
                size="sm" 
                className="sm:hidden z-50 text-gray-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {/* [MCP] 햄버거 메뉴: 항상 Menu 아이콘만 보이고, 색상도 항상 text-gray-200으로 고정 */}
                <Menu className="w-6 h-6" />
              </Button>
            </div>
            {isMenuOpen && (
              <>
                {/* [MCP] 오버레이: 클릭 시 메뉴 닫힘, 더 진한 gray */}
                <div className="fixed inset-0 z-40 bg-gray-900/80" onClick={() => setIsMenuOpen(false)} />
                {/* [MCP] 왼쪽에서 슬라이드 인되는 드로어 메뉴 */}
                <motion.aside
                  initial={{ x: -320, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -320, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed top-0 left-0 bottom-0 w-72 max-w-full bg-white/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col p-6 gap-8"
                  style={{ height: '100dvh' }}
                >
                  {/* [MCP] 드로어 상단 X(닫기) 버튼 */}
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 focus:outline-none"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="w-7 h-7" />
                  </button>
                  {/* [MCP] 프로필/이름/역할 뱃지 */}
                  <div className="flex items-center gap-2 mb-6 mt-2">
                    <User className="w-6 h-6 text-blue-500" />
                    <span className="text-lg font-bold text-gray-800">{user?.fullName || user?.username || "Profile"}</span>
                    {user && (
                      <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-blue-500 text-white">Expert</span>
                    )}
                  </div>
                  {/* [MCP] 메뉴 리스트: 메인 메뉴/마이페이지 2개 카테고리로 구분 */}
                  <nav className="flex-1 flex flex-col gap-6">
                    <div>
                      <div className="text-xs font-bold text-gray-400 mb-2 px-2">{t('header.mainMenu')}</div>
                      <div className="flex flex-col gap-1">
                        {baseMenuItems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-gray-700 hover:bg-blue-50 ${pathname === item.path ? 'bg-blue-100 text-blue-700' : ''}`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.icon}
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-400 mb-2 px-2">{t('header.myPage')}</div>
                      <Link
                        key={myPageMenu.name}
                        href={myPageMenu.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-gray-700 hover:bg-blue-50 ${pathname === myPageMenu.path ? 'bg-blue-100 text-blue-700' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {myPageMenu.icon}
                        <span>{t('header.myPage')}</span>
                      </Link>
                    </div>
                  </nav>
                </motion.aside>
              </>
            )}
          </div>
        </div>
        {/* [MCP] 모바일 상단 고정 메뉴바: header 태그 바로 아래 한 줄로, 아이콘+텍스트 가로 배치, 부족하면 가로 스크롤, 배경 흰색 */}
        <nav className="lg:hidden w-full px-0 pt-1 pb-2 sticky top-[56px] z-40 relative" id="mobile-menu-bar">
          <div className="w-full px-2">
            <div
              className="flex flex-nowrap gap-1 bg-white rounded-2xl shadow-lg py-2 px-1 relative overflow-x-auto w-full"
              id="mobile-menu-scroll"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {(isMyPage ? myPageMenuItems : [...baseMenuItems, myPageMenu]).map((item) => {
                // [MCP] 쿼리스트링(tab=...)까지 반영한 활성화 조건 (명확히 분리)
                let isActive = false;
                if (isMyPage) {
                  if (item.path === "/mypage" && pathname === "/mypage" && !searchParams.get('tab')) {
                    isActive = true;
                  } else if (item.path.includes('tab=expert-status') && searchParams.get('tab') === 'expert-status') {
                    isActive = true;
                  }
                } else {
                  isActive = pathname === item.path;
                }
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`flex flex-row items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 font-semibold text-xs gap-1 whitespace-nowrap
                      ${isActive ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-md ring-2 ring-violet-300" : "bg-white text-gray-700 hover:bg-violet-50"}
                    `}
                    style={{ boxShadow: isActive ? '0 2px 12px 0 rgba(124,58,237,0.15)' : undefined }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-1">{item.name}</span>
                  </Link>
                );
              })}
              {/* [MCP] 오른쪽 화살표 버튼: 메뉴가 넘칠 때만, 스크롤 오른쪽 끝이면 숨김, absolute로 고정 */}
              {showScrollRight && (
                <button
                  type="button"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-50 bg-white/80 rounded-full shadow p-1 flex items-center justify-center pointer-events-auto"
                  style={{ marginRight: '2px' }}
                  onClick={() => {
                    const el = document.getElementById('mobile-menu-scroll');
                    if (el) el.scrollBy({ left: 120, behavior: 'smooth' });
                  }}
                >
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>
      
    </>
  )
}

// Suspense 래퍼 컴포넌트
export function HeaderWrapper() {
  return (
    <Suspense fallback={
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-2 sm:py-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 rounded-2xl animate-pulse"></div>
              <div className="text-xl sm:text-3xl font-black text-gray-300">AIrang</div>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    }>
      <Header />
    </Suspense>
  )
}