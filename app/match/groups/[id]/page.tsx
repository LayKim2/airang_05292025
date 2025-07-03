"use client"
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/app/components/ui/badge";
import { Sparkles, CheckCircle, Users, Calendar, BookOpen, User, Zap, Bookmark, Share2 } from "lucide-react";
import { useUserProfile } from '@/app/lib/useUserProfile';

// [MCP] 그룹 상세 페이지: 그룹 id로 데이터 fetch, 주요 정보 표시 scaffold
export default function GroupDetailPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params?.id;
  const [group, setGroup] = useState<any>(null);
  const { profile } = useUserProfile();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isClosed = group && (group.status === 'recruited' || (group.recruit_count && members.length >= group.recruit_count));

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
      setMembers(memberList);
      setLoading(false);
    };
    fetchGroup();
  }, [groupId]);

  // 이미 참여한 유저인지 확인
  const isJoined = profile && members.some((m: any) => m.user_id === profile.clerk_user_id);

  // 참여하기 버튼 핸들러
  const handleJoin = async () => {
    if (!profile?.clerk_user_id || !groupId) return;
    if (isJoined) return;
    await supabase.from('group_members').insert({
      group_id: groupId,
      user_id: profile.clerk_user_id,
      role: 'member',
    });
    // 새로고침 또는 멤버 refetch
    const { data: gm } = await supabase.from('group_members').select('user_id, role').eq('group_id', groupId);
    setMembers(gm || []);
  };

  if (loading) return <div className="p-10 text-center text-gray-400">로딩 중...</div>;
  if (!group) return <div className="p-10 text-center text-gray-400">그룹 정보를 찾을 수 없습니다.</div>;

  // [MCP] 카테고리/상태/아이콘 맵 (간단 버전)
  const categoryIconMap: Record<string, React.ReactNode> = {
    study: <BookOpen className="w-4 h-4 mr-1" />, networking: <Users className="w-4 h-4 mr-1" />, meetup: <Calendar className="w-4 h-4 mr-1" />, free: <User className="w-4 h-4 mr-1" />
  };

  return (
    <main className="mt-16 flex justify-center items-start min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-2 sm:px-6">
      <section className="w-full max-w-md">
        {/* 상단 gradient, 카테고리/모집중/모집인원 뱃지 */}
        <div className="relative rounded-t-3xl overflow-hidden" style={group.image_url ? {minHeight: 180, background: `url(${group.image_url}) center/cover no-repeat`} : {background: 'linear-gradient(135deg, #ffb86b 0%, #ff6bcb 100%)', minHeight: 180}}>
          {/* 이미지 오버레이: 이미지가 있을 때만 어두운 gradient */}
          {group.image_url && (
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10 z-0" />
          )}
          <div className="absolute top-4 left-4 z-10">
            <Badge className="flex items-center gap-1 px-4 py-2 text-base font-semibold border border-gray-200 rounded-full shadow-sm bg-white/80 text-gray-700">
              {categoryIconMap[group.category]}
              {group.category}
            </Badge>
          </div>
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button type="button" className="p-2 rounded-full hover:bg-white/30 transition-colors cursor-pointer">
              <Bookmark className="w-6 h-6 text-white/80 hover:text-white" />
            </button>
            <button type="button" className="p-2 rounded-full hover:bg-white/30 transition-colors cursor-pointer">
              <Share2 className="w-6 h-6 text-white/80 hover:text-white" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center pt-10 pb-6 relative z-10">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2">
              
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-1 drop-shadow-lg">{group.title}</h1>
          </div>
        </div>
        {/* 주요 정보 카드 */}
        <div className="bg-white rounded-b-3xl shadow-xl -mt-6 p-6 pt-10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="주최자" className="w-12 h-12 rounded-full object-cover border bg-gray-100" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-violet-500">
                {profile?.first_name?.[0] || 'U'}
              </div>
            )}
            <div>
              <div className="text-sm text-gray-500 font-semibold">주최자: {profile ? `${profile.first_name || ''}${profile.last_name ? ' ' + profile.last_name : ''}` : group.user_id}</div>
              <div className="text-xs text-gray-400">등록일: {group.created_at ? new Date(group.created_at).toLocaleDateString() : '-'}</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1"><Users className="w-4 h-4 text-violet-400" /> {members.length}/{group.recruit_count || '-'}명</div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />
              {group.location
                ? group.location
                : group.location_type === 'online'
                  ? '온라인'
                  : group.location_type === 'offline'
                    ? '오프라인'
                    : group.location_type === 'both'
                      ? '온/오프라인'
                      : '-'}
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
              {typeof group.cost === 'number'
                ? group.cost === 0
                  ? '무료'
                  : (group.currency ? `${group.cost.toLocaleString()} ${group.currency}` : group.cost.toLocaleString())
                : (group.cost ? group.cost : '-')}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <div className="flex-1 bg-violet-50 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">모임 일정</div>
              <div className="text-base font-bold text-violet-700">매주 토요일</div>
            </div>
            <div className="flex-1 bg-blue-50 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">모집 기간</div>
              <div className="text-base font-bold text-blue-700">~{group.deadline ? new Date(group.deadline).toLocaleDateString() : '-'}</div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 mt-2">
            <div className="text-sm font-bold mb-1">모임 소개</div>
            <div className="text-sm text-gray-700 whitespace-pre-line">{group.description?.replace(/<[^>]+>/g, '')}</div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              className={`flex-1 bg-violet-500 hover:bg-violet-600 text-white font-bold py-3 rounded-xl transition-colors ${(isJoined || isClosed) ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleJoin}
              disabled={!!isJoined || isClosed}
            >
              {isClosed ? '모집 마감' : isJoined ? '이미 참여 중' : '참여하기'}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
} 