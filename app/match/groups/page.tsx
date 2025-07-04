"use client"
// AI 크리에이터 모임(그룹) 리스트/등록/모집 메인 페이지
// 추후 카드형 리스트, 필터, 등록 버튼 등 UI 추가 예정

import { useEffect, useState } from "react";
import { Sparkles, Users, Bookmark, Eye, Plus, Search, CheckCircle, Calendar, BookOpen, User, Zap } from "lucide-react";
import { GROUP_CATEGORIES } from "@/app/types";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/app/components/ui/badge";
import { useUserProfile } from '@/app/lib/useUserProfile';
import { useClerk } from '@clerk/nextjs';
import SiteLoader from "@/app/components/ui/SiteLoader";
import { useTranslation } from "@/app/i18n/useTranslation";

// 그룹 카테고리별 배경/텍스트/아이콘 맵
const categoryBgMap: Record<string, string> = {
  study: 'bg-blue-50',
  networking: 'bg-green-50',
  meetup: 'bg-pink-50',
  free: 'bg-yellow-50',
};
const categoryTextMap: Record<string, string> = {
  study: 'text-blue-700',
  networking: 'text-green-700',
  meetup: 'text-pink-700',
  free: 'text-yellow-800',
};
const categoryIconMap: Record<string, React.ReactNode> = {
  study: <BookOpen className="w-4 h-4 mr-1" />, // 스터디
  networking: <Users className="w-4 h-4 mr-1" />, // 네트워킹
  meetup: <Calendar className="w-4 h-4 mr-1" />, // 밋업/세미나
  free: <User className="w-4 h-4 mr-1" />, // 자유모임
};

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { profile } = useUserProfile();
  const [bookmarkedGroupIds, setBookmarkedGroupIds] = useState<number[]>([]);
  const { openSignIn } = useClerk();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('groups').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setGroups(data);
      }
      setLoading(false);
    };
    fetchGroups();
  }, []);

  // 현재 유저의 북마크 그룹 fetch
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!profile?.clerk_user_id) return;
      const { data, error } = await supabase.from('group_bookmarks').select('group_id').eq('user_id', profile.clerk_user_id);
      if (!error && data) {
        setBookmarkedGroupIds(data.map((b: any) => b.group_id));
      }
    };
    fetchBookmarks();
  }, [profile?.clerk_user_id]);

  // 북마크 토글 핸들러
  const handleBookmark = async (groupId: number, isBookmarked: boolean) => {
    if (!profile?.clerk_user_id) {
      openSignIn();
      return;
    }
    if (isBookmarked) {
      await supabase.from('group_bookmarks').delete().eq('group_id', groupId).eq('user_id', profile.clerk_user_id);
    } else {
      await supabase.from('group_bookmarks').insert({ group_id: groupId, user_id: profile.clerk_user_id });
    }
    // 상태 갱신
    const { data } = await supabase.from('group_bookmarks').select('group_id').eq('user_id', profile.clerk_user_id);
    setBookmarkedGroupIds(data ? data.map((b: any) => b.group_id) : []);
  };

  // [필터/검색 적용된 리스트]
  const filteredGroups = groups.filter(
    (g) =>
      (filter === "all" || g.category === filter) &&
      (search === "" || g.title.includes(search) || g.description.includes(search))
  );

  return (
    <main className="min-h-screen pt-14 sm:pt-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1
            className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-violet-500 via-blue-400 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(139,92,246,0.15)] flex items-center gap-2 mb-2"
          >
            <Sparkles className="w-8 h-8 text-violet-400 drop-shadow" />
            {t('groups.title')}
          </h1>
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
            onClick={() => router.push("/services")}
          >
            <Sparkles className="w-5 h-5" />
            {t('groups.goToServices')}
          </button>
        </div>
        {/* 상단 필터/검색/등록 버튼 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex gap-2 items-center overflow-x-auto scrollbar-hide pb-2">
            {/* [AI 모임] 1차 카테고리(GROUP_CATEGORIES) + 전체 */}
            {[{ id: 'all', name: t('groups.categoryAll') }, ...GROUP_CATEGORIES.map(cat => ({...cat, name: t(`groups.category.${cat.id}`)}))].map((cat) => (
              <button
                key={cat.id}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all border whitespace-nowrap flex-shrink-0 ${filter === cat.id ? 'bg-violet-600 text-white border-violet-600 shadow' : 'bg-white text-gray-600 border-gray-200 hover:bg-violet-50'}`}
                onClick={() => setFilter(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-center w-full sm:w-auto">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t('groups.searchPlaceholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button
              className="flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold shadow hover:from-violet-600 hover:to-blue-600 transition-all"
              onClick={() => {
                if (!profile?.clerk_user_id) {
                  openSignIn();
                  return;
                }
                router.push("/match/groups/register");
              }}
            >
              <Plus className="w-4 h-4" />
              {t('groups.registerButton')}
            </button>
          </div>
        </div>

        {/* 모임 리스트 카드형 UI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <SiteLoader text={t('groups.loading')} />
          ) : filteredGroups.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-16 text-lg">{t('groups.noResults')}</div>
          ) : (
            filteredGroups.map(group => (
              <div
                key={group.id}
                className="relative rounded-3xl bg-white shadow-xl border border-gray-100 hover:shadow-2xl transition-all p-8 flex flex-col gap-4 group min-h-[320px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-400"
                onClick={() => router.push(`/match/groups/${group.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') router.push(`/match/groups/${group.id}`); }}
              >
                {/* 카테고리 뱃지: 상단 왼쪽 */}
                <div className="absolute top-6 left-6 z-10">
                  <Badge className={`flex items-center gap-1 px-4 py-2 text-base font-semibold border border-gray-200 rounded-full shadow-sm transition-colors duration-200
                    ${categoryBgMap[group.category] || 'bg-gray-50'} ${categoryTextMap[group.category] || 'text-gray-700'}
                    hover:bg-gray-100 hover:border-gray-300`}
                  >
                    {categoryIconMap[group.category]}
                    {t(`groups.category.${group.category}`)}
                  </Badge>
                </div>
                {/* 모집상태 뱃지: 상단 오른쪽 */}
                <div className="absolute top-6 right-6 z-10">
                  <Badge className={`flex items-center gap-1 px-4 py-2 text-base font-bold border border-gray-200 rounded-full shadow-sm transition-colors duration-200
                    ${group.status === 'recruiting' ? 'bg-violet-50 text-violet-700' : 'bg-gray-100 text-gray-400'}
                    hover:bg-violet-100 hover:border-violet-300`}
                  >
                    {group.status === 'recruiting' ? <Sparkles className="w-5 h-5 mr-1 text-violet-400" /> : <CheckCircle className="w-5 h-5 mr-1 text-gray-400" />}
                    {t(`groups.status.${group.status}`)}
                  </Badge>
                </div>
                {/* 대표 이미지 썸네일 */}
                {group.image_url ? (
                  <div className="w-full max-h-48 h-48 mb-2">
                    <img src={group.image_url} alt={t('groups.imageAlt')} className="w-full h-48 max-h-48 object-cover rounded-xl border bg-gray-100" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full max-h-48 h-48 bg-violet-50 mb-2 rounded-xl border bg-gray-100">
                    <Sparkles className="w-10 h-10 text-violet-500 mb-2 mx-auto" />
                  </div>
                )}
                {/* 모임명 + 북마크 아이콘: 한 줄에 배치 */}
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-bold text-gray-900 truncate group-hover:text-violet-700 transition-colors flex-1">{group.title}</h2>
                  <button
                    type="button"
                    className="ml-2 p-1 rounded-full hover:bg-violet-50 focus:bg-violet-100 transition-colors cursor-pointer"
                    onClick={e => { e.stopPropagation(); handleBookmark(group.id, bookmarkedGroupIds.includes(group.id)); }}
                  >
                    <Bookmark 
                      className={`w-6 h-6 transition-colors ${bookmarkedGroupIds.includes(group.id) ? 'text-violet-500' : 'text-gray-300 hover:text-violet-500'}`}
                      fill={bookmarkedGroupIds.includes(group.id) ? '#8b5cf6' : 'none'}
                      stroke={bookmarkedGroupIds.includes(group.id) ? '#8b5cf6' : 'currentColor'}
                    />
                  </button>
                </div>
                {/* meeting_date + count pill 한 줄에 배치 (count는 오른쪽 끝) */}
                <div className="flex items-center justify-between mb-1 w-full">
                  <div className="flex items-center gap-2">
                    {group.meeting_date && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold border border-violet-100">
                        <Calendar className="w-4 h-4 mr-1 text-violet-400" />
                        <span className="font-bold">{t(`groups.meetingType.${group.meeting_type}`)}</span>
                        {new Date(group.meeting_date).toLocaleDateString(t('groups.dateLocale'), { year: 'numeric', month: '2-digit', day: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <span className="flex items-center px-3 py-1 text-sm font-bold rounded-full bg-blue-50 text-blue-700 shadow border border-blue-100">
                    <Users className="w-4 h-4 mr-1 text-blue-400" />
                    {group.member_count ?? group.current_count}/{group.recruit_count || '-'}
                  </span>
                </div>
                {/* description은 다음 줄에 단독 배치 */}
                <div className="text-xs text-gray-400 mb-1 w-full truncate">
                  {group.description ? group.description.replace(/<[^>]+>/g, '').slice(0, 40) + (group.description.replace(/<[^>]+>/g, '').length > 40 ? '...' : '') : ''}
                </div>
                {/* AI Tools: services와 동일한 태그 뱃지 디자인, 별도 flex-row로 분리 */}
                {group.ai_tools && Array.isArray(group.ai_tools) && group.ai_tools.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="inline-flex items-center text-xs text-violet-500 font-semibold mr-1">
                      <Sparkles className="w-4 h-4 mr-1" />{t('groups.aiTools')}
                    </span>
                    {group.ai_tools.map((tool: string, toolIdx: number) => (
                      <span
                        key={toolIdx}
                        className="inline-flex items-center bg-white/80 border border-violet-100 text-violet-700 font-medium px-2.5 py-1 rounded-full shadow-sm hover:bg-violet-50 transition-colors text-xs gap-1"
                      >
                        <Zap className="w-3 h-3 mr-1 text-violet-400" />
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
                {/* 트랜디 효과: 호버시 테두리/텍스트 컬러 변화, 그림자 강조 */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-violet-400 transition-all pointer-events-none" />
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
} 