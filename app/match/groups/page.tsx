"use client"
// AI 크리에이터 모임(그룹) 리스트/등록/모집 메인 페이지
// 추후 카드형 리스트, 필터, 등록 버튼 등 UI 추가 예정

import { useState } from "react";
import { Sparkles, Users, Bookmark, Eye, Plus, Search } from "lucide-react";
import { GROUP_CATEGORIES } from "@/app/types";
import { useRouter } from "next/navigation";

// [데모] 모임 리스트 최소 데이터 구조
const demoGroups = [
  {
    id: 1,
    title: "AI 서비스 기획 스터디",
    category: "스터디",
    tags: ["AI", "기획", "스터디"],
    status: "모집중",
    deadline: "2025.07.15",
    description: "AI 서비스 기획에 관심 있는 분들과 함께하는 스터디 모임입니다.",
    leader: "홍길동",
    techStack: ["Python", "Figma"],
    views: 24,
    bookmarks: 3,
  },
  {
    id: 2,
    title: "AI 개발 프로젝트 팀원 모집",
    category: "프로젝트",
    tags: ["AI", "개발", "프로젝트"],
    status: "모집중",
    deadline: "2025.07.20",
    description: "AI 기반 서비스 개발에 함께할 팀원을 찾습니다.",
    leader: "김개발",
    techStack: ["React", "Node.js", "AWS"],
    views: 41,
    bookmarks: 7,
  },
  {
    id: 3,
    title: "AI 논문 리뷰 모임",
    category: "스터디",
    tags: ["AI", "논문", "리뷰"],
    status: "모집완료",
    deadline: "2025.07.10",
    description: "최신 AI 논문을 함께 읽고 토론하는 모임입니다.",
    leader: "이리더",
    techStack: ["Python"],
    views: 12,
    bookmarks: 1,
  },
];

export default function GroupsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("전체");
  const router = useRouter();

  // [필터/검색 적용된 리스트]
  const filteredGroups = demoGroups.filter(
    (g) =>
      (filter === "전체" || g.category === filter) &&
      (search === "" || g.title.includes(search) || g.description.includes(search))
  );

  return (
    <main className="min-h-screen pt-14 sm:pt-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">AI 크리에이터 모임</h1>
        {/* 상단 필터/검색/등록 버튼 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex gap-2 items-center">
            {/* [AI 모임] 1차 카테고리(GROUP_CATEGORIES) + 전체 */}
            {[{ id: 'all', name: '전체' }, ...GROUP_CATEGORIES].map((cat) => (
              <button
                key={cat.id}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all border ${filter === cat.name ? 'bg-violet-600 text-white border-violet-600 shadow' : 'bg-white text-gray-600 border-gray-200 hover:bg-violet-50'}`}
                onClick={() => setFilter(cat.name)}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-center w-full sm:w-auto">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="모임명, 설명 검색..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button
              className="flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold shadow hover:from-violet-600 hover:to-blue-600 transition-all"
              onClick={() => router.push("/match/groups/register")}
            >
              <Plus className="w-4 h-4" />
              모임 등록
            </button>
          </div>
        </div>

        {/* 모임 리스트 카드형 UI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredGroups.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-16 text-lg">검색 결과가 없습니다.</div>
          ) : (
            filteredGroups.map(group => (
              <div key={group.id} className="relative rounded-3xl bg-white shadow-xl border border-gray-100 hover:shadow-2xl transition-all p-8 flex flex-col gap-4 group min-h-[320px]">
                {/* 모집상태/카테고리/마감일 */}
                <div className="flex gap-2 items-center mb-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${group.status === '모집중' ? 'bg-violet-100 text-violet-700' : 'bg-gray-200 text-gray-500'}`}>{group.status}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{group.category}</span>
                  <span className="text-xs text-gray-400 ml-auto">마감 {group.deadline}</span>
                </div>
                {/* 모임명 */}
                <h2 className="text-xl font-bold text-gray-900 truncate group-hover:text-violet-700 transition-colors">{group.title}</h2>
                {/* 태그 */}
                <div className="flex flex-wrap gap-2 mb-1">
                  {group.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500 font-medium">#{tag}</span>
                  ))}
                </div>
                {/* 설명 */}
                <p className="text-base text-gray-600 line-clamp-2 mb-2">{group.description}</p>
                {/* 리더/기술스택 */}
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <Users className="w-4 h-4 mr-1 text-violet-400" /> {group.leader}
                  <span className="mx-2">·</span>
                  {group.techStack.map(tech => (
                    <span key={tech} className="px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-100 to-blue-100 text-violet-700 font-semibold mr-1">{tech}</span>
                  ))}
                </div>
                {/* 조회/북마크 */}
                <div className="flex items-center gap-4 text-xs text-gray-400 mt-auto">
                  <Eye className="w-4 h-4" /> {group.views}
                  <Bookmark className="w-4 h-4 ml-2" /> {group.bookmarks}
                </div>
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