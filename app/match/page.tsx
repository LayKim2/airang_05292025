"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { Sparkles, Search, Filter, ArrowRight, UserCheck, Users, Plus } from "lucide-react"
import { useTranslation } from "@/app/i18n/useTranslation"
import { useUser, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { supabase } from '@/lib/supabase'


// 애니메이션 config 재사용
const orbAnimation = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.2, 0.3, 0.2],
    x: [0, 20, 0],
    y: [0, -20, 0],
  },
  transition: {
    duration: 16,
    repeat: Infinity,
    ease: 'linear' as const
  }
}
const orb2Animation = {
  animate: {
    scale: [1, 1.3, 1],
    opacity: [0.2, 0.4, 0.2],
    x: [0, -20, 0],
    y: [0, 20, 0],
  },
  transition: {
    duration: 20,
    repeat: Infinity,
    ease: 'linear' as const
  }
}

export default function MatchPage() {
  const { t } = useTranslation();
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  // [MCP] 전문가 등록 알림 팝업 상태 (canRegisterExpert 조건과 연동)
  const [showAlert, setShowAlert] = useState(false);
  const [dontShowForWeek, setDontShowForWeek] = useState(false);

  // 검색 상태 관리
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // 서비스 등록 안내 모달 상태
  const [showServiceAlert, setShowServiceAlert] = useState(false);

  // [서비스 준비중 알림 팝업 상태]
  const [showComingSoon, setShowComingSoon] = useState(false);

  // [MCP] 전문가 중복 등록 방지 상태 (null: 로딩중, true: 보임, false: 숨김)
  const [canRegisterExpert, setCanRegisterExpert] = useState<null | boolean>(null);

  // [MCP] 전문가 신청 여부 확인 (로그인/비로그인 모두 UX 반영)
  useEffect(() => {
    if (user?.id) {
      // [MCP] 전문가 중복 등록 여부 supabase 직접 호출로 체크
      supabase
        .from('expert_applications')
        .select('id')
        .eq('user_id', user.id)
        .in('status', ['pending', 'approved'])
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) throw error;
          setCanRegisterExpert(!data); // data가 있으면 이미 신청함
        }, () => setCanRegisterExpert(true)); // 에러 시 보이게
    } else {
      // 로그인하지 않은 경우 무조건 보이게
      setCanRegisterExpert(true);
    }
  }, [user?.id]);

  // 화면 진입 시 localStorage 확인 후 팝업 노출 여부 결정 (canRegisterExpert 조건과 연동)
  useEffect(() => {
    const lastHide = localStorage.getItem('matchAlertHideUntil');
    if (canRegisterExpert && (!lastHide || new Date(lastHide) < new Date())) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [canRegisterExpert]);

  // 팝업 닫기 핸들러
  const handleCloseAlert = () => {
    if (dontShowForWeek) {
      const until = new Date();
      until.setDate(until.getDate() + 7);
      localStorage.setItem('matchAlertHideUntil', until.toISOString());
    }
    setShowAlert(false);
  };

  // [전문가 등록하러 가기 버튼 핸들러]
  const handleExpertRegister = async () => {
    // 1. 로그인 체크
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    // 2. 서비스 등록 여부 체크 (supabase 직접 호출)
    try {
      // [MCP] 서비스 등록 여부: 1개만 limit(1)로 빠르게 조회
      const { data, error } = await supabase
        .from('services')
        .select('id')
        .eq('author_id', user?.id)
        .limit(1);
      // [AI 서비스 미등록 시에만 안내 모달 노출]
      if (!Array.isArray(data) || data.length === 0) {
        setShowAlert(false); // 기존 팝업 닫기
        setShowServiceAlert(true); // 안내 모달 열기
      } else {
        // 하나라도 있으면 전문가 등록 페이지로 이동
        router.push("/match/register");
      }
    } catch {
      // 에러 시에도 안내 모달 노출
      setShowAlert(false);
      setShowServiceAlert(true);
    }
  };

  // [서비스 준비중 알림 핸들러]
  const handleComingSoon = () => setShowComingSoon(true);

  // [MCP] AI 크리에이터 모임 버튼 핸들러: 로그인 안 했으면 Clerk 로그인 팝업
  const handleGroupButton = () => {
    router.push("/match/groups");
  };

  return (
    <main className="min-h-screen pt-[104px] sm:pt-16 bg-gradient-to-b from-gray-50 to-white">
      {/* 전문가 등록 알림 팝업 (canRegisterExpert가 true일 때만, null(로딩중)일 때는 렌더링 안함) */}
      {canRegisterExpert === true && showAlert && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative border border-gray-200">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={handleCloseAlert}
              aria-label="팝업 닫기"
            >
              ×
            </button>
            <div className="flex flex-col items-center gap-4">
              <Sparkles className="w-10 h-10 text-violet-500 mb-2" />
              <h2 className="text-xl font-bold text-gray-900 text-center">전문가 등록하고 수익을 얻으세요!</h2>
              <p className="text-gray-600 text-center text-base mb-2">
                AI 전문가로 등록하면 강의와 의뢰를 받아<br />
                지식과 경험을 수익으로 연결할 수 있습니다.<br />
                지금 바로 전문가로 등록해보세요.
              </p>
              <div className="flex items-center gap-2 mt-2 mb-2">
                <input
                  type="checkbox"
                  id="dontShowForWeek"
                  checked={dontShowForWeek}
                  onChange={e => setDontShowForWeek(e.target.checked)}
                  className="w-4 h-4 accent-violet-600"
                />
                <label htmlFor="dontShowForWeek" className="text-sm text-gray-600 select-none cursor-pointer">
                  일주일간 보지 않음
                </label>
              </div>
              <button
                className="mt-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-semibold text-base hover:scale-105 transition-all"
                onClick={handleExpertRegister}
              >
                전문가 등록하러 가기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 서비스 등록 안내 모달 */}
      {showServiceAlert && (
        <div className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative border border-gray-200">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowServiceAlert(false)}
              aria-label="팝업 닫기"
            >
              ×
            </button>
            <div className="flex flex-col items-center gap-4">
              <Sparkles className="w-10 h-10 text-violet-500 mb-2" />
              <h2 className="text-xl font-bold text-gray-900 text-center">서비스를 먼저 등록해 주세요</h2>
              <p className="text-gray-600 text-center text-base mb-2">
                전문가로 활동하려면 AI 서비스를 1개 이상 등록해야 합니다.<br />
                서비스 등록 후 강의 등록 및 의뢰를 받을 수 있습니다.
              </p>
              <button
                className="mt-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-semibold text-base hover:scale-105 transition-all"
                onClick={() => { setShowServiceAlert(false); router.push("/services/register"); }}
              >
                AI 서비스 등록하러 가기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 서비스 준비중 알림 팝업 */}
      {showComingSoon && (
        <div className="fixed inset-0 z-[2200] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full relative border border-gray-200 text-center">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowComingSoon(false)}
              aria-label="팝업 닫기"
            >
              ×
            </button>
            <Sparkles className="w-10 h-10 text-violet-500 mb-2 mx-auto" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">서비스 준비중입니다</h2>
            <p className="text-gray-600 text-base">빠른 시일 내에 오픈될 예정입니다.</p>
            <button
              className="mt-6 px-6 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-semibold text-base hover:scale-105 transition-all"
              onClick={() => setShowComingSoon(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-8 md:py-12 lg:py-16">
        {/* Modern Background Elements */}
        <div className="absolute inset-0">
          {/* Animated Gradient Orbs */}
          <motion.div className="absolute top-32 left-32 w-64 h-64 bg-gradient-to-r from-violet-200/20 to-purple-200/20 rounded-full blur-3xl" {...orbAnimation} />
          <motion.div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl" {...orb2Animation} />

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
            <div className="mb-4 sm:mb-6" />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Badge className="bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700 border-0 px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 text-base sm:text-lg font-semibold">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {t('headerMatch')}
              </Badge>
            </motion.div>
          </motion.div>

          {/*  Search Section */}
          {/*
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center gap-2 w-full">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('matchSearchPlaceholder')}
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') setSearchQuery(searchInput);
                  }}
                  className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border-0 rounded-xl shadow-lg focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all duration-300"
                />
              </div>
              <button
                type="button"
                className="flex items-center justify-center px-4 py-2 bg-white/80 border border-gray-200 rounded-xl shadow-sm hover:bg-violet-50 transition-colors whitespace-nowrap"
                onClick={handleComingSoon}
                aria-label={t('community.filter.search')}
              >
                <Search className="w-5 h-5 text-violet-600" />
              </button>
            </div>
          </div>
          */}

          {/* Match Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">

            {/* [카드1] AI 크리에이터 모임 카드 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative group h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-300 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-xl mb-6 mx-auto">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-center mb-4">{t('matchGroupCardTitle')}</h3>
                <p className="text-gray-600 text-center mb-6 flex-grow">
                  {t('matchGroupCardDesc')}
                </p>
                <button className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
                  onClick={handleGroupButton}
                >
                  {t('matchGroupCardButton')}
                </button>
              </div>
            </motion.div>

            {/* [카드2] 전문가 조회 카드 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative group h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                <div className="flex items-center justify-center w-16 h-16 bg-violet-100 rounded-xl mb-6 mx-auto">
                  <Users className="w-8 h-8 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold text-center mb-4">{t('matchExpertCardTitle')}</h3>
                <p className="text-gray-600 text-center mb-6 flex-grow">
                  {t('matchExpertCardDesc')}
                </p>
                <button className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors"
                  onClick={handleComingSoon}
                >
                  {t('matchExpertCardButton')}
                </button>
              </div>
            </motion.div>

            {/* [카드3] 요청글 등록 카드 */}
            {/*
            <motion.div
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative group h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6 mx-auto">
                  <UserCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-center mb-4">{t('matchRequestCardTitle')}</h3>
                <p className="text-gray-600 text-center mb-6 flex-grow">
                  {t('matchRequestCardDesc')}
                </p>
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                  onClick={handleComingSoon}
                >
                  {t('matchRequestCardButton')}
                </button>
              </div>
            </motion.div>
            */}
          </div>

        </div>

        {/* 전문가 등록 플로팅 버튼 (중복 신청 불가 시 숨김, 로딩중(null)일 때는 렌더링 안함) */}
        {canRegisterExpert === true && (
          <button
            className="fixed bottom-8 right-8 z-50 flex items-center gap-2 sm:px-6 sm:py-3 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-full shadow-xl hover:scale-105 transition-all duration-300 font-semibold sm:text-lg text-base"
            style={{ boxShadow: '0 4px 24px 0 rgba(59,130,246,0.15)' }}
            aria-label="전문가 등록"
            onClick={handleExpertRegister}
          >
            <Plus className="sm:w-6 sm:h-6 w-5 h-5" />
            <span className="sm:inline inline">{t('matchExpertFab')}</span>
          </button>
        )}
      </section>
    </main>
  )
} 