"use client"
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/app/components/ui/badge";
import { Sparkles, CheckCircle, Users, Calendar, BookOpen, User, Zap, Bookmark } from "lucide-react";

// [MCP] 그룹 상세 페이지: 그룹 id로 데이터 fetch, 주요 정보 표시 scaffold
export default function GroupDetailPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params?.id;
  const [group, setGroup] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) return;
    const fetchGroup = async () => {
      setLoading(true);
      // 그룹 정보 + 유저 정보 조인
      const { data: groupData, error: groupError } = await supabase.from('groups').select('*').eq('id', groupId).single();
      let userData = null;
      if (groupData && groupData.user_id) {
        const { data: u, error: userError } = await supabase.from('users').select('first_name, last_name, email, avatar_url').eq('clerk_user_id', groupData.user_id).single();
        if (!userError && u) userData = u;
      }
      // group_members + users 조인: 참여자 전체(리더/멤버) avatar_url 등
      let memberList: any[] = [];
      if (groupData && groupData.id) {
        const { data: gm, error: gmError } = await supabase.from('group_members').select('user_id, role').eq('group_id', groupData.id);
        if (!gmError && gm && gm.length > 0) {
          // 모든 참여자 user_id로 users 테이블에서 avatar_url 등 조회
          const userIds = gm.map((m: any) => m.user_id);
          const { data: usersData, error: usersError } = await supabase.from('users').select('clerk_user_id, avatar_url').in('clerk_user_id', userIds);
          if (!usersError && usersData) {
            // role, user_id, avatar_url을 합침
            memberList = gm.map((m: any) => ({
              ...m,
              avatar_url: usersData.find((u: any) => u.clerk_user_id === m.user_id)?.avatar_url || null
            }));
          }
        }
      }
      if (!groupError && groupData) setGroup(groupData);
      if (userData) setUser(userData);
      setMembers(memberList);
      setLoading(false);
    };
    fetchGroup();
  }, [groupId]);

  if (loading) return <div className="p-10 text-center text-gray-400">로딩 중...</div>;
  if (!group) return <div className="p-10 text-center text-gray-400">그룹 정보를 찾을 수 없습니다.</div>;

  // [MCP] 카테고리/상태/아이콘 맵 (간단 버전)
  const categoryIconMap: Record<string, React.ReactNode> = {
    study: <BookOpen className="w-4 h-4 mr-1" />, networking: <Users className="w-4 h-4 mr-1" />, meetup: <Calendar className="w-4 h-4 mr-1" />, free: <User className="w-4 h-4 mr-1" />
  };

  return (
    <main className="flex justify-center items-start min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-2 sm:px-6">
      <section className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-gray-100 p-0 sm:p-0 overflow-hidden flex flex-col min-h-[900px]">
        {/* 대표 이미지: 리스트 카드처럼 가로로, 높이 제한, 내용 중심 */}
        {group.image_url ? (
          <div className="w-full flex justify-center items-center bg-gray-100 pt-12 pb-6 relative h-[400px]">
            {/* 카테고리 뱃지: 이미지 왼쪽 상단, 리스트 카드와 동일 */}
            <div className="absolute top-4 left-4 z-10">
              <Badge className="flex items-center gap-1 px-4 py-2 text-base font-semibold border border-gray-200 rounded-full shadow-sm bg-blue-50 text-blue-700">
                {categoryIconMap[group.category]}
                {group.category}
              </Badge>
            </div>
            <img src={group.image_url} alt="대표 이미지" className="mx-auto max-w-2xl w-full h-[400px] rounded-2xl border bg-gray-100 object-cover object-center shadow" />
          </div>
        ) : (
          <div className="w-full flex justify-center items-center bg-violet-50 pt-8 pb-2 relative h-[400px]">
            {/* 카테고리 뱃지: 이미지 왼쪽 상단, 리스트 카드와 동일 */}
            <div className="absolute top-4 left-4 z-10">
              <Badge className="flex items-center gap-1 px-4 py-2 text-base font-semibold border border-gray-200 rounded-full shadow-sm bg-blue-50 text-blue-700">
                {categoryIconMap[group.category]}
                {group.category}
              </Badge>
            </div>
            <Sparkles className="w-32 h-32 text-violet-400" />
          </div>
        )}
        {/* 상단 뱃지/북마크/마감일 */}
        <div className="flex items-center justify-between px-12 pt-8 pb-4">
          <div className="flex items-center gap-3 flex-wrap">
          <Badge className={`flex items-center gap-1 px-4 py-2 text-base font-bold border border-gray-200 rounded-full shadow-sm ${group.status === 'recruiting' ? 'bg-violet-50 text-violet-700' : 'bg-gray-100 text-gray-400'}`}>
              {group.status === 'recruiting' ? <Sparkles className="w-5 h-5 mr-1 text-violet-400" /> : <CheckCircle className="w-5 h-5 mr-1 text-gray-400" />}
              {group.status === 'recruiting'
                ? `모집중${group.deadline ? ` (~${new Date(group.deadline).toLocaleDateString()})` : ''}`
                : group.deadline
                    ? `마감일: ${new Date(group.deadline).toLocaleDateString()}`
                    : '마감일: 미정'}
              </Badge>
            <span className="flex items-center px-4 py-2 text-base font-bold rounded-full bg-blue-50 text-blue-700 shadow border border-blue-100">
              <Users className="w-5 h-5 mr-2 text-blue-400" />
              {group.current_count}/{group.recruit_count || '-'}
              {/* 참여자(리더/멤버) 아바타: pill 바로 오른쪽에 flex-row로 나란히, 리더 먼저 */}
              {members && members.length > 0 && (
                <div className="flex items-center ml-3">
                  {members
                    .sort((a, b) => (a.role === 'leader' ? -1 : 1))
                    .map((m, idx) => m.avatar_url ? (
                      <img
                        key={m.user_id}
                        src={m.avatar_url}
                        alt={m.role === 'leader' ? '리더' : '멤버'}
                        className={`w-8 h-8 rounded-full border-2 border-white shadow -mr-2 bg-gray-100 object-cover`}
                        title={m.role === 'leader' ? '리더' : '멤버'}
                      />
                    ) : null)
                  }
                </div>
              )}
            </span>
          </div>
          {/* [MCP] 모집 마감일(deadline) badge: 모집중이면 '모집중 (~날짜)'로 표시 */}
          
          <button type="button" className="p-2 rounded-full hover:bg-violet-50 focus:bg-violet-100 transition-colors cursor-pointer">
            <Bookmark className="w-7 h-7 text-gray-300 hover:text-violet-500 transition-colors" />
          </button>
        </div>
        {/* 제목/생성자/생성일/북마크 */}
        <div className="px-12 pt-2 pb-4 flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1 truncate">{group.title}</h1>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Users className="w-4 h-4 mr-1 text-violet-400" />
            <span>주최자: {user ? `${user.first_name || ''}${user.last_name ? ' ' + user.last_name : ''}` : group.user_id}</span>
            <span className="mx-2">·</span>
            <span>등록일: {group.created_at ? new Date(group.created_at).toLocaleDateString() : '-'}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {group.tags && group.tags.map((tag: any) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500 font-medium">#{tag}</span>
            ))}
          </div>
        </div>
        {/* AI Tools: 항상 노출 */}
        <div className="flex items-center gap-2 flex-wrap px-12 mb-6">
          <span className="inline-flex items-center text-xs text-violet-500 font-semibold mr-1">
            <Sparkles className="w-4 h-4 mr-1" />AI Tools
          </span>
          {Array.isArray(group.ai_tools) && group.ai_tools.length > 0 ? (
            group.ai_tools.map((tool: string, toolIdx: number) => (
              <span
                key={toolIdx}
                className="inline-flex items-center bg-white/80 border border-violet-100 text-violet-700 font-medium px-2.5 py-1 rounded-full shadow-sm hover:bg-violet-50 transition-colors text-xs gap-1"
              >
                <Zap className="w-3 h-3 mr-1 text-violet-400" />
                {tool}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">-</span>
          )}
        </div>
        {/* 상세 설명 */}
        <div className="prose max-w-none text-gray-800 px-12 pb-12" dangerouslySetInnerHTML={{ __html: group.description }} />
      </section>
    </main>
  );
} 