// /mypage 라우트: 로그인된 사용자의 프로필(이름, 이메일, 이미지 등)을 보여주는 페이지
"use client";
import { useState, useEffect, Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import { Award, Star, CheckCircle, Clock, X, FileText, Bot, Heart, ChevronRight, User, Sparkles, Brain, Eye, MessageCircle, Zap, Pencil, Trash2, TrendingUp, Share2, BookText, MessageCircleQuestion, Archive, Users, Bookmark, Crown, MessagesSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import Image from "next/image";
import { Badge } from "@/app/components/ui/badge";
import PostCreateModal from "@/app/components/community/PostCreateModal";
import { useTranslation } from "@/app/i18n/useTranslation";
import { useChat } from "@/app/components/chat/ChatProvider";

function MyPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const { openChatWithGroup } = useChat();
  // [MCP] 데모용 역할/탭 상태
  const [userRole, setUserRole] = useState<'creator' | 'expert'>('expert');
  // [MCP] 기본 activeTab을 'services'(내 AI 서비스)로 변경, 타입 명시
  const [activeTab, setActiveTab] = useState<'services' | 'posts' | 'liked-posts' | 'liked-services' | 'expert-status' | 'groups' | 'bookmarked-groups'>('services');
  // [MCP] 현재 선택된 메뉴 상태 추가
  const [selectedMenu, setSelectedMenu] = useState<'ai-service' | 'group' | 'post' | 'expert-application'>('ai-service');
  const { user, isLoaded } = useUser();
  const router = useRouter();
  // [MCP] 전문가 신청 상태 관리
  const [expertApplication, setExpertApplication] = useState<any | null>(null);
  const [expertLoading, setExpertLoading] = useState(false);
  const [expertError, setExpertError] = useState<string | null>(null);
  // [MCP] 내 AI 서비스 리스트 상태
  const [myServices, setMyServices] = useState<any[]>([]);
  const [myServicesLoading, setMyServicesLoading] = useState(false);
  const [myServicesError, setMyServicesError] = useState<string | null>(null);
  // [MCP] 서비스 삭제 로딩 상태
  const [deletingId, setDeletingId] = useState<number | null>(null);
  // [MCP] 삭제 모달 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  // [MCP] 좋아요한 서비스 리스트 상태
  const [likedServices, setLikedServices] = useState<any[]>([]);
  const [likedServicesLoading, setLikedServicesLoading] = useState(false);
  const [likedServicesError, setLikedServicesError] = useState<string | null>(null);
  // [MCP] 내가 작성한 포스트 리스트 상태
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [myPostsLoading, setMyPostsLoading] = useState(false);
  const [myPostsError, setMyPostsError] = useState<string | null>(null);
  // [MCP] 삭제 모달 상태
  const [deletePostId, setDeletePostId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  // [MCP] 포스트 수정 모달 상태 및 데이터
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editPost, setEditPost] = useState<any | null>(null);
  // [MCP] 좋아요한 포스트 리스트 상태
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [likedPostsLoading, setLikedPostsLoading] = useState(false);
  const [likedPostsError, setLikedPostsError] = useState<string | null>(null);
  // [MCP] 내가 참여한 그룹 리스트 상태
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [myGroupsLoading, setMyGroupsLoading] = useState(false);
  const [myGroupsError, setMyGroupsError] = useState<string | null>(null);
  // [MCP] 북마크한 그룹 리스트 상태
  const [bookmarkedGroups, setBookmarkedGroups] = useState<any[]>([]);
  const [bookmarkedGroupsLoading, setBookmarkedGroupsLoading] = useState(false);
  const [bookmarkedGroupsError, setBookmarkedGroupsError] = useState<string | null>(null);
  // [MCP] 그룹별 멤버 수 상태 (group_id -> count)
  const [groupMemberCounts, setGroupMemberCounts] = useState<Record<number, number>>({});
  // [MCP] 그룹별 채팅 메시지 수 상태 (group_id -> count)
  const [groupChatCounts, setGroupChatCounts] = useState<Record<number, number>>({});

  // [MCP] 더미 데이터 (실제 fetch로 대체 예정)
  const userData = {
    name: user?.fullName || user?.username || "",
    profileImage: user?.imageUrl || "",
    role: userRole,
    joinDate: "",
    phone: "" // [MCP] 핸드폰번호 추가, 실제 데이터 없으므로 미등록
  };

  // [MCP] 전문가 신청 여부 및 데이터 fetch
  useEffect(() => {
    if (!user?.id) return;
    setExpertLoading(true);
    setExpertError(null);
    // [MCP] 즉시 실행 async 함수로 supabase 쿼리
    (async () => {
      const { data, error } = await supabase
        .from("expert_applications")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["pending", "approved"])
        .maybeSingle();
      if (error) {
        setExpertError("전문가 신청 정보를 불러오지 못했습니다.");
        setExpertApplication(null);
      } else {
        setExpertApplication(data);
      }
      setExpertLoading(false);
    })();
  }, [user?.id]);

  // [MCP] 모든 데이터 초기 로드 (페이지 진입 시 한 번만)
  useEffect(() => {
    if (!user?.id) return;
    
    const loadAllData = async () => {
      try {
        // [MCP] 1. 내 AI 서비스 리스트 fetch
        setMyServicesLoading(true);
        let query = supabase.from('services').select('*, users:author_id(*)').eq('author_id', user.id).order('created_at', { ascending: false });
        const { data: servicesData, error } = await query;
        if (error) throw new Error(error.message || "내 서비스 목록을 불러오지 못했습니다.");
        
        // [MCP] 각 서비스별로 좋아요 개수와 liked_by_user 상태를 service_likes에서 직접 집계
        const serviceIds = (servicesData || []).map((s: any) => s.id);
        let likesMap: Record<number, number> = {};
        let likedMap: Record<number, boolean> = {};
        if (serviceIds.length > 0) {
          const { data: likesCountData, error: likesCountError } = await supabase
            .from('service_likes')
            .select('service_id', { count: 'exact', head: false })
            .in('service_id', serviceIds);
          if (likesCountError) throw new Error(likesCountError.message);
          if (Array.isArray(likesCountData)) {
            likesCountData.forEach((row: any) => {
              likesMap[row.service_id] = (likesMap[row.service_id] || 0) + 1;
            });
          }
          if (user?.id) {
            const { data: likedRows } = await supabase
              .from('service_likes')
              .select('service_id')
              .eq('user_id', user.id)
              .in('service_id', serviceIds);
            if (Array.isArray(likedRows)) {
              likedRows.forEach((row: any) => {
                likedMap[row.service_id] = true;
              });
            }
          }
        }
        let servicesWithLike = (servicesData || []).map((s: any) => ({
          ...s,
          like_count: likesMap[s.id] || 0,
          liked_by_user: likedMap[s.id] || false,
        }));
        setMyServices(servicesWithLike);
        setMyServicesLoading(false);
      } catch (e: any) {
        setMyServicesError(e.message || "내 서비스 목록을 불러오지 못했습니다.");
        setMyServicesLoading(false);
      }
    };

    loadAllData();
  }, [user?.id]);

  // [MCP] 좋아요한 서비스 리스트 fetch (초기 로드에 포함)
  useEffect(() => {
    if (!user?.id) return;
    
    const loadLikedServices = async () => {
      try {
        setLikedServicesLoading(true);
        // 1. service_likes에서 내가 좋아요한 service_id 리스트 조회
        const { data: likeRows, error: likeRowsError } = await supabase
          .from('service_likes')
          .select('service_id')
          .eq('user_id', user.id);
        if (likeRowsError) throw new Error(likeRowsError.message);
        const serviceIds = (likeRows || []).map((row: any) => row.service_id);
        if (serviceIds.length === 0) {
          setLikedServices([]);
          setLikedServicesLoading(false);
          return;
        }
        // 2. services 테이블에서 해당 id들만 조회, users:author_id(*) join, 최신순
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*, users:author_id(*)')
          .in('id', serviceIds)
          .order('created_at', { ascending: false });
        if (servicesError) throw new Error(servicesError.message);
        // 3. 각 서비스별로 좋아요 개수와 liked_by_user 상태 집계
        let likesMap: Record<number, number> = {};
        let likedMap: Record<number, boolean> = {};
        if (serviceIds.length > 0) {
          const { data: likesCountData, error: likesCountError } = await supabase
            .from('service_likes')
            .select('service_id', { count: 'exact', head: false })
            .in('service_id', serviceIds);
          if (likesCountError) throw new Error(likesCountError.message);
          if (Array.isArray(likesCountData)) {
            likesCountData.forEach((row: any) => {
              likesMap[row.service_id] = (likesMap[row.service_id] || 0) + 1;
            });
          }
          if (user?.id) {
            const { data: likedRows } = await supabase
              .from('service_likes')
              .select('service_id')
              .eq('user_id', user.id)
              .in('service_id', serviceIds);
            if (Array.isArray(likedRows)) {
              likedRows.forEach((row: any) => {
                likedMap[row.service_id] = true;
              });
            }
          }
        }
        let servicesWithLike = (servicesData || []).map((s: any) => ({
          ...s,
          like_count: likesMap[s.id] || 0,
          liked_by_user: likedMap[s.id] || false,
        }));
        setLikedServices(servicesWithLike);
        setLikedServicesLoading(false);
      } catch (e: any) {
        setLikedServicesError(e.message || "좋아요한 서비스 목록을 불러오지 못했습니다.");
        setLikedServicesLoading(false);
      }
    };

    loadLikedServices();
  }, [user?.id]);

  // [MCP] 내가 작성한 포스트 리스트 fetch (초기 로드에 포함)
  useEffect(() => {
    if (!user?.id) return;
    
    const loadMyPosts = async () => {
      try {
        setMyPostsLoading(true);
        const { data: postsData, error } = await supabase
          .from('posts')
          .select('*, users:author_id(*), post_likes(*)')
          .eq('author_id', user.id)
          .order('created_at', { ascending: false });
        if (error) throw new Error(error.message || "내 포스트 목록을 불러오지 못했습니다.");
        // [MCP] 각 post별로 liked_by_user, like_count 계산
        let postsWithLike = (postsData || []).map((post: any) => ({
          ...post,
          liked_by_user: user?.id ? Array.isArray(post.post_likes) && post.post_likes.some((like: any) => like.user_id === user.id) : false,
          like_count: Array.isArray(post.post_likes) ? post.post_likes.length : 0,
          users: post.users,
        }));
        setMyPosts(postsWithLike);
        setMyPostsLoading(false);
      } catch (e: any) {
        setMyPostsError(e.message || "내 포스트 목록을 불러오지 못했습니다.");
        setMyPostsLoading(false);
      }
    };

    loadMyPosts();
  }, [user?.id]);

  // [MCP] 좋아요한 포스트 리스트 fetch (초기 로드에 포함)
  useEffect(() => {
    if (!user?.id) return;
    
    const loadLikedPosts = async () => {
      try {
        setLikedPostsLoading(true);
        // 1. post_likes에서 내가 좋아요한 post_id 리스트 가져오기
        const { data: likeRows, error: likeError } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id);
        if (likeError) throw new Error(likeError.message || '좋아요한 포스트를 불러오지 못했습니다.');
        const postIds = (likeRows || []).map((row: any) => row.post_id);
        if (postIds.length === 0) {
          setLikedPosts([]);
          setLikedPostsLoading(false);
          return;
        }
        // 2. posts에서 해당 id들만 가져오기 (작성자, 좋아요 join)
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*, users:author_id(*), post_likes(*)')
          .in('id', postIds)
          .order('created_at', { ascending: false });
        if (postsError) throw new Error(postsError.message || '좋아요한 포스트를 불러오지 못했습니다.');
        // [MCP] 각 post별로 liked_by_user, like_count 계산
        let postsWithLike = (postsData || []).map((post: any) => ({
          ...post,
          liked_by_user: true, // 무조건 true
          like_count: Array.isArray(post.post_likes) ? post.post_likes.length : 0,
          users: post.users,
        }));
        setLikedPosts(postsWithLike);
        setLikedPostsLoading(false);
      } catch (e: any) {
        setLikedPostsError(e.message || '좋아요한 포스트를 불러오지 못했습니다.');
        setLikedPostsLoading(false);
      }
    };

    loadLikedPosts();
  }, [user?.id]);

  // [MCP] 내가 참여한 그룹 리스트 fetch (초기 로드에 포함)
  useEffect(() => {
    if (!user?.id) return;
    
    const loadMyGroups = async () => {
      try {
        setMyGroupsLoading(true);
        // [MCP] 그룹 멤버십에서 내가 참여한 그룹 조회
        const { data: groupMemberships, error: membershipError } = await supabase
          .from('group_members')
          .select('*, groups(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (membershipError) throw new Error(membershipError.message || "내 그룹 목록을 불러오지 못했습니다.");
        
        // [MCP] 그룹 정보 정리
        const groups = (groupMemberships || []).map((membership: any) => ({
          ...membership.groups,
          membership_id: membership.id,
          joined_at: membership.created_at,
          role: membership.role || 'member'
        }));
        setMyGroups(groups);
        setMyGroupsLoading(false);
      } catch (e: any) {
        setMyGroupsError(e.message || "내 그룹 목록을 불러오지 못했습니다.");
        setMyGroupsLoading(false);
      }
    };

    loadMyGroups();
  }, [user?.id]);

  // [MCP] 북마크한 그룹 리스트 fetch (초기 로드에 포함)
  useEffect(() => {
    if (!user?.id) return;
    
    const loadBookmarkedGroups = async () => {
      try {
        setBookmarkedGroupsLoading(true);
        // [MCP] group_bookmarks에서 내가 북마크한 그룹 조회
        const { data: bookmarks, error: bookmarksError } = await supabase
          .from('group_bookmarks')
          .select('*, groups(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (bookmarksError) throw new Error(bookmarksError.message || "북마크한 그룹 목록을 불러오지 못했습니다.");
        
        // [MCP] 그룹 정보 정리
        const groups = (bookmarks || []).map((bookmark: any) => ({
          ...bookmark.groups,
          bookmarked_at: bookmark.created_at
        }));
        
        // [MCP] 각 그룹에 대해 사용자의 역할 정보 추가
        const groupIds = groups.map((group: any) => group.id);
        if (groupIds.length > 0) {
          const { data: memberships, error: membershipError } = await supabase
            .from('group_members')
            .select('group_id, role')
            .eq('user_id', user.id)
            .in('group_id', groupIds);
          
          if (!membershipError && memberships) {
            const roleMap: Record<number, string> = {};
            memberships.forEach((membership: any) => {
              roleMap[membership.group_id] = membership.role || 'member';
            });
            
            // 각 그룹에 역할 정보 추가
            const groupsWithRoles = groups.map((group: any) => ({
              ...group,
              role: roleMap[group.id] || 'member'
            }));
            setBookmarkedGroups(groupsWithRoles);
          } else {
            setBookmarkedGroups(groups);
          }
        } else {
          setBookmarkedGroups(groups);
        }
        setBookmarkedGroupsLoading(false);
      } catch (e: any) {
        setBookmarkedGroupsError(e.message || "북마크한 그룹 목록을 불러오지 못했습니다.");
        setBookmarkedGroupsLoading(false);
      }
    };

    loadBookmarkedGroups();
  }, [user?.id]);

  // [MCP] 그룹 id 배열로 group_members 테이블에서 count를 가져오는 함수
  const fetchGroupMemberCounts = async (groupIds: number[]) => {
    if (!groupIds.length) return {};
    // supabase에서 group_id별 row 전체를 가져와서 수동 집계
    const { data, error } = await supabase
      .from('group_members')
      .select('group_id')
      .in('group_id', groupIds);
    if (error) {
      console.error('멤버 수 조회 실패:', error.message);
      return {};
    }
    // data: [{ group_id: 1 }, ...] -> group_id별 count 집계
    const counts: Record<number, number> = {};
    (data || []).forEach((row: any) => {
      counts[row.group_id] = (counts[row.group_id] || 0) + 1;
    });
    return counts;
  };

  // [MCP] 내 그룹/북마크 그룹 리스트가 바뀔 때마다 멤버 수 동기화
  useEffect(() => {
    const allGroupIds = [
      ...myGroups.map(g => g.id),
      ...bookmarkedGroups.map(g => g.id)
    ].filter((v, i, arr) => arr.indexOf(v) === i && v != null);
    if (!allGroupIds.length) return;
    fetchGroupMemberCounts(allGroupIds).then(setGroupMemberCounts);
  }, [myGroups, bookmarkedGroups]);

  // [MCP] 카테고리 정보 (community와 동일하게)
  const postCategories = [
    { id: "all", name: "전체", icon: TrendingUp },
    { id: "PromptSharing", name: "프롬프트 공유", icon: Share2 },
    { id: "TipsAndKnowHow", name: "팁/노하우", icon: BookText },
    { id: "QAndAAndFeedback", name: "Q&A/피드백", icon: MessageCircleQuestion },
    { id: "General", name: "자유게시판", icon: Archive },
  ];

  // [MCP] 날짜 포맷 함수 - MM/DD/YYYY 형태
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // [MCP] 역할/상태 뱃지
  const getBadge = (role: string) => {
    if (role === 'expert') {
      return (
        <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          <Award size={14} />
          Expert
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
        <Star size={14} />
        Creator
      </div>
    );
  };
  // [MCP] 전문가 신청 상태 뱃지
  const getStatusBadge = (status: string) => {
    if (status === 'approved') {
      return (
        <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
          <CheckCircle size={14} />
          승인 완료
        </div>
      );
    } else if (status === 'pending') {
      return (
        <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-sm">
          <Clock size={14} />
          검토 중
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-sm">
          <X size={14} />
          반려
        </div>
      );
    }
  };
  // [MCP] 사이드 메뉴 항목 - PC/모바일 모두 동일하게 4개로 통일
  const menuItems = [
    { id: 'ai-service', label: t('mypage.menu.aiService'), icon: Bot },
    { id: 'group', label: t('mypage.menu.group'), icon: Users },
    { id: 'post', label: t('mypage.menu.post'), icon: FileText },
    { id: 'expert-status', label: t('mypage.menu.expertStatus'), icon: Award }
  ];
  // [MCP] 메뉴 클릭 시 해당 메뉴의 첫 번째 탭으로 이동
  const handleMenuItemClick = (id: string) => {
    setSelectedMenu(id as 'ai-service' | 'group' | 'post' | 'expert-application');
    
    // 각 메뉴별로 기본 탭 설정
    switch (id) {
      case 'ai-service':
        setActiveTab('services');
        break;
      case 'post':
        setActiveTab('posts');
        break;
      case 'group':
        setActiveTab('groups');
        break;
      case 'expert-status':
        setActiveTab('expert-status');
        break;
    }
  };
  const MenuItem = ({ item, isActive }: any) => (
    <button
      onClick={() => handleMenuItemClick(item.id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
        isActive 
          ? 'bg-blue-500 text-white shadow-lg' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <item.icon size={20} />
      <span className="font-medium">{item.label}</span>
    </button>
  );

  // [MCP] 서비스 삭제 함수 (모달용)
  const handleDeleteService = async (serviceId: number) => {
    setDeletingId(serviceId);
    try {
      const { error } = await supabase.from('services').delete().eq('id', serviceId);
      if (error) throw new Error(error.message || "삭제에 실패했습니다.");
      setMyServices(prev => prev.filter(s => s.id !== serviceId));
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    } catch (e: any) {
      alert(e.message || "삭제에 실패했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  // [MCP] 좋아요 취소(하트) 핸들러
  const handleUnlikeService = async (serviceId: number) => {
    if (!user?.id) return;
    const prev = likedServices;
    // Optimistic UI: 먼저 리스트에서 제거
    setLikedServices(likedServices.filter(s => s.id !== serviceId));
    try {
      const { error } = await supabase
        .from('service_likes')
        .delete()
        .eq('user_id', user.id)
        .eq('service_id', serviceId);
      if (error) throw new Error(error.message || '좋아요 취소에 실패했습니다.');
    } catch (e: any) {
      alert(e.message || '좋아요 취소에 실패했습니다.');
      setLikedServices(prev); // 롤백
    }
  };

  // [MCP] content 내 이미지에 rounded-xl 클래스 자동 추가 함수 (community와 동일)
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

  // [MCP] 포스트 삭제 함수
  const handleDeletePost = async () => {
    if (!deletePostId) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const { error } = await supabase.from('posts').delete().eq('id', deletePostId);
      if (error) throw new Error(error.message || '포스트 삭제에 실패했습니다.');
      setMyPosts(prev => prev.filter(p => p.id !== deletePostId));
      setDeletePostId(null);
    } catch (e: any) {
      setDeleteError(e.message || '포스트 삭제에 실패했습니다.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // [MCP] 포스트 수정 완료 시 리스트 갱신
  const handlePostUpdated = () => {
    setEditModalOpen(false);
    setEditPost(null);
    // 최신 데이터 fetch (간단히 다시 불러오기)
    if (user?.id) {
      (async () => {
        setMyPostsLoading(true);
        setMyPostsError(null);
        try {
          const { data: postsData, error } = await supabase
            .from('posts')
            .select('*, users:author_id(*), post_likes(*)')
            .eq('author_id', user.id)
            .order('created_at', { ascending: false });
          if (error) throw new Error(error.message || "내 포스트 목록을 불러오지 못했습니다.");
          let postsWithLike = (postsData || []).map((post: any) => ({
            ...post,
            liked_by_user: user?.id ? Array.isArray(post.post_likes) && post.post_likes.some((like: any) => like.user_id === user.id) : false,
            like_count: Array.isArray(post.post_likes) ? post.post_likes.length : 0,
            users: post.users,
          }));
          setMyPosts(postsWithLike);
        } catch (e: any) {
          setMyPostsError(e.message || "내 포스트 목록을 불러오지 못했습니다.");
        } finally {
          setMyPostsLoading(false);
        }
      })();
    }
  };

  // [MCP] 수정 버튼 클릭 시 모달 오픈
  const handleEditClick = (post: any) => {
    setEditPost(post);
    setEditModalOpen(true);
  };

  // [MCP] 좋아요한 포스트 unlike 핸들러
  const handleUnlikeLikedPost = async (postId: number) => {
    if (!user?.id) return;
    try {
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
      if (error) throw new Error(error.message);
      // [MCP] 로컬 상태 업데이트
      setLikedPosts(prev => prev.filter(post => post.id !== postId));
    } catch (e: any) {
      console.error('포스트 좋아요 취소 실패:', e.message);
    }
  };

  // [MCP] 북마크한 그룹 북마크 해제 핸들러
  const handleUnbookmarkGroup = async (groupId: number) => {
    if (!user?.id) return;
    try {
      const { error } = await supabase
        .from('group_bookmarks')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);
      if (error) throw new Error(error.message);
      // [MCP] 로컬 상태 업데이트
      setBookmarkedGroups(prev => prev.filter(group => group.id !== groupId));
    } catch (e: any) {
      console.error('그룹 북마크 해제 실패:', e.message);
    }
  };

  // [MCP] 그룹 채팅 열기 함수
  const handleOpenGroupChat = (group: any) => {
    // URL 파라미터로 채팅 모달 열기 신호 전달
    const url = new URL(window.location.href);
    url.searchParams.set('openChat', 'true');
    url.searchParams.set('selectedGroupId', group.id.toString());
    window.history.replaceState({}, '', url.toString());
    
    // 페이지 새로고침하여 ChatProvider가 채팅 모달을 열도록 함
    window.location.reload();
  };

  // [MCP] 쿼리스트링(tab=...) → activeTab 동기화
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'expert-status') setActiveTab('expert-status');
    else setActiveTab('services');
  }, [searchParams]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>로그인이 필요합니다.</div>;

  return (
    // [MYPAGE][MCP] 전체 배경 그라데이션, 카드 soft shadow+border+hover, 사이드 메뉴 blur/투명도 등으로 세련된 느낌 강화
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-[104px] sm:pt-20">
      {/* [MCP] 왼쪽 고정 사이드 메뉴: PC(데스크탑)에서는 기존 디자인, 모바일에서는 상단 고정 가로 탭 */}
      {/* 모바일: 상단 고정 가로 탭 메뉴 */}
      <aside className="flex sm:hidden w-full bg-white/90 backdrop-blur-md shadow-xl border-b border-gray-100 fixed top-0 left-0 z-30 rounded-b-2xl px-4 py-2 overflow-x-auto whitespace-nowrap max-w-full flex-nowrap flex-row justify-between items-center">
        <nav className="flex flex-row gap-2 w-auto">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleMenuItemClick(item.id)}
              className={`flex flex-row items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 font-semibold text-xs gap-1 whitespace-nowrap
                ${selectedMenu === item.id
                  ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-md ring-2 ring-violet-300'
                  : 'bg-white text-gray-700 hover:bg-violet-50'}
              `}
              style={{ boxShadow: selectedMenu === item.id ? '0 2px 12px 0 rgba(124,58,237,0.15)' : undefined }}
            >
              <item.icon size={18} />
              <span className="ml-1">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      {/* PC: 기존 세로 사이드바 */}
      <aside className="hidden sm:flex w-80 bg-white/90 backdrop-blur-md shadow-xl flex-col p-6 gap-8 border-r border-gray-100 min-h-screen">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-6 h-6 text-blue-500" />
          <span className="text-lg font-bold text-gray-800">{t('mypage.title')}</span>
        </div>
        <nav className="space-y-2">
          {menuItems.map(item => (
            <MenuItem 
              key={item.id}
              item={item}
              isActive={selectedMenu === item.id}
            />
          ))}
        </nav>
      </aside>
      {/* [MCP] 오른쪽 컨텐츠 영역: width 제한(max-w-3xl 등) 제거, w-full max-w-none로 카드가 화면 전체를 쓰게 함 */}
      <main className="flex-1 flex flex-col items-start justify-start w-full max-w-none pl-8 pr-8 pt-8 pb-8 bg-transparent">
        {/* [MCP] 마이페이지 서브헤더 */}

        <div className="w-full">
          {/* [MCP] 전문가 신청 메뉴에서는 전문가 카드/버튼 분기 렌더링 */}
          {activeTab === 'expert-status' ? (
            <div className="relative max-w-2xl mx-auto rounded-3xl shadow-2xl border border-blue-200/40 p-0 overflow-hidden bg-gradient-to-br from-white/80 via-blue-50/70 to-violet-50/60 backdrop-blur-md ring-1 ring-blue-100/40">
              {/* [MCP] 상단 상태/날짜 badge row */}
              <div className="flex items-center gap-3 px-8 pt-8 pb-2">
                {expertLoading && <div className="text-center text-gray-500">로딩 중...</div>}
                {expertError && <div className="text-center text-red-500">{expertError}</div>}
                {!expertLoading && !expertError && expertApplication && (
                  <>
                    {getStatusBadge(expertApplication.status)}
                    <span className="inline-block bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-xs font-semibold">{t('mypage.expert.applicationDate')}: {expertApplication.created_at ? expertApplication.created_at.split('T')[0] : '-'}</span>
                    {expertApplication.reviewed_at && (
                                              <span className="inline-block bg-green-100 text-green-600 rounded-full px-3 py-1 text-xs font-semibold">{t('mypage.expert.approvalDate')}: {expertApplication.reviewed_at.split('T')[0]}</span>
                    )}
                  </>
                )}
              </div>
              {/* [MCP] 구분선 */}
              <div className="h-px bg-gradient-to-r from-blue-200/40 via-violet-200/40 to-transparent mb-2 mx-8" />
              {/* [MCP] 프로필/기본 정보 row */}
              {!expertLoading && !expertError && expertApplication && (
                <div className="flex flex-col sm:flex-row items-center gap-6 px-8 pt-2 pb-4">
                  <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-blue-200 via-violet-200 to-white shadow-lg border-4 border-white overflow-hidden flex items-center justify-center">
                    <User className="w-10 h-10 text-blue-400" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1 items-center sm:items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900">{expertApplication.name || userData.name}</span>
                      <span className="text-base font-semibold text-blue-500">{expertApplication.ai_category || '-'}</span>
                    </div>
                    <div className="text-sm text-gray-700">{t('mypage.expert.jobTitle')}: <span className="font-medium">{expertApplication.job_title || t('mypage.expert.notEntered')}</span></div>
                    <div className="text-sm text-gray-500">{expertApplication.bio || t('mypage.expert.noBio')}</div>
                  </div>
                </div>
              )}
              {/* [MCP] 구분선 */}
              <div className="h-px bg-gradient-to-r from-violet-200/40 via-blue-200/40 to-transparent mb-2 mx-8" />
              {/* [MCP] AI 도구/모델 pill row */}
              {!expertLoading && !expertError && expertApplication && (
                <div className="px-8 pb-2">
                  <div className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Bot className="w-4 h-4 text-blue-400" />{t('mypage.expert.aiTools')}</div>
                  {/* [MCP] pill row: 모바일 가로 스크롤, 데스크탑 flex-wrap */}
                  <div className="overflow-x-auto flex-nowrap whitespace-nowrap gap-2 flex -mx-8 px-8 sm:flex-wrap sm:overflow-visible sm:whitespace-normal">
                    {(expertApplication.ai_tools || []).length > 0 ? (
                      expertApplication.ai_tools.map((tool: string) => (
                        <span key={tool} className="inline-block whitespace-nowrap bg-gradient-to-r from-blue-100 via-violet-100 to-white text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-blue-100/60">{tool}</span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400"></span>
                    )}
                  </div>
                </div>
              )}
              {/* [MCP] 구분선 */}
              <div className="h-px bg-gradient-to-r from-blue-200/40 via-violet-200/40 to-transparent mb-2 mx-8" />
              {/* [MCP] 외부 프로필/포트폴리오 링크 row */}
              {!expertLoading && !expertError && expertApplication && (
                <div className="px-8 pb-8">
                  <div className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" />{t('mypage.expert.externalProfiles')}</div>
                  <div className="flex flex-col gap-2">
                    {expertApplication.github_url && (
                      <a href={expertApplication.github_url} target="_blank" className="flex items-center gap-2 text-blue-600 hover:underline hover:scale-105 transition-transform group">
                        <Star className="w-4 h-4 group-hover:text-blue-700" /> GitHub <ChevronRight className="w-4 h-4 text-blue-300 group-hover:translate-x-1 transition-transform" />
                      </a>
                    )}
                    {expertApplication.linkedin_url && (
                      <a href={expertApplication.linkedin_url} target="_blank" className="flex items-center gap-2 text-blue-600 hover:underline hover:scale-105 transition-transform group">
                        <Star className="w-4 h-4 group-hover:text-blue-700" /> LinkedIn <ChevronRight className="w-4 h-4 text-blue-300 group-hover:translate-x-1 transition-transform" />
                      </a>
                    )}
                    {expertApplication.portfolio_url && (
                      <a href={expertApplication.portfolio_url} target="_blank" className="flex items-center gap-2 text-blue-600 hover:underline hover:scale-105 transition-transform group">
                        <Star className="w-4 h-4 group-hover:text-blue-700" /> {t('mypage.expert.portfolio')} <ChevronRight className="w-4 h-4 text-blue-300 group-hover:translate-x-1 transition-transform" />
                      </a>
                    )}
                    {expertApplication.etc_url && (
                      <a href={expertApplication.etc_url} target="_blank" className="flex items-center gap-2 text-blue-600 hover:underline hover:scale-105 transition-transform group">
                        <Star className="w-4 h-4 group-hover:text-blue-700" /> {t('mypage.expert.etc')} <ChevronRight className="w-4 h-4 text-blue-300 group-hover:translate-x-1 transition-transform" />
                      </a>
                    )}
                    {!(expertApplication.github_url || expertApplication.linkedin_url || expertApplication.portfolio_url || expertApplication.etc_url) && (
                      <span className="text-xs text-gray-400">{t('mypage.expert.noExternalProfiles')}</span>
                    )}
                  </div>
                </div>
              )}
              {/* [MCP] 신청 내역이 없을 때 신청 버튼만 렌더링 */}
              {!expertLoading && !expertError && !expertApplication && (
                <div className="flex flex-col items-center justify-center min-h-[300px] py-12 bg-gradient-to-br from-white/80 via-blue-50/70 to-violet-50/60">
                  <div className="text-gray-500 mb-8 text-lg font-medium">{t('mypage.expert.noApplication')}</div>
                  <Button onClick={() => router.push('/match/register')} className="px-10 py-4 text-xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-200">
                    <Sparkles className="w-6 h-6 mr-2 animate-bounce" /> {t('mypage.expert.applyNow')}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* [MCP] 탭 네비게이션: 모바일 한 줄 pill + 가로 스크롤, 데스크탑 flex-wrap */}
              <div className="flex flex-row flex-nowrap overflow-x-auto whitespace-nowrap gap-2 -mx-4 px-4 mt-6 w-full justify-start sm:flex-wrap sm:overflow-visible sm:whitespace-normal">
                {/* AI service 메뉴일 때만 services, liked-services 탭 보여주기 */}
                {selectedMenu === 'ai-service' && [
                  { id: 'services', label: t('mypage.tab.services'), icon: Bot },
                  { id: 'liked-services', label: t('mypage.tab.likedServices'), icon: Star }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as 'services' | 'liked-services')}
                    className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border transition-all text-base font-medium min-w-max
                      ${activeTab === item.id ? 'bg-blue-500 text-white shadow' : 'bg-gray-50 text-gray-700 hover:bg-blue-50 border-gray-200'}`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                ))}
                
                {/* post 메뉴일 때만 posts, liked-posts 탭 보여주기 */}
                {selectedMenu === 'post' && [
                  { id: 'posts', label: t('mypage.tab.posts'), icon: FileText },
                  { id: 'liked-posts', label: t('mypage.tab.likedPosts'), icon: Heart }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as 'posts' | 'liked-posts')}
                    className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border transition-all text-base font-medium min-w-max
                      ${activeTab === item.id ? 'bg-blue-500 text-white shadow' : 'bg-gray-50 text-gray-700 hover:bg-blue-50 border-gray-200'}`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                ))}
                
                {/* group 메뉴일 때만 groups, bookmarked-groups 탭 보여주기 */}
                {selectedMenu === 'group' && [
                  { id: 'groups', label: t('mypage.tab.groups'), icon: Users },
                  { id: 'bookmarked-groups', label: t('mypage.tab.bookmarkedGroups'), icon: Bookmark }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as 'groups' | 'bookmarked-groups')}
                    className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border transition-all text-base font-medium min-w-max
                      ${activeTab === item.id ? 'bg-blue-500 text-white shadow' : 'bg-gray-50 text-gray-700 hover:bg-blue-50 border-gray-200'}`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                ))}
              </div>
               {/* [MCP] 탭 아래에 각 리스트 조건부 렌더링 */}
              <div className="w-full mt-6">
                {activeTab === 'services' && (
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg shadow-gray-200/60 border border-gray-100 p-4 sm:p-6 lg:p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('mypage.section.myServices')}</h2>
                    {/* [MCP] 내 서비스 리스트 로딩/에러/빈 상태 처리 */}
                    {myServicesLoading && <div className="text-center py-8 text-gray-500">{t('common.loading')}</div>}
                    {myServicesError && <div className="text-center py-8 text-red-500">{myServicesError}</div>}
                    {!myServicesLoading && !myServicesError && myServices.length === 0 && (
                      <div className="text-center py-8 text-gray-400">{t('mypage.empty.myServices')}</div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6">
                      {myServices.map((service) => (
                        <div key={service.id} className="mb-4 sm:mb-0">
                          <Card className="group cursor-pointer transition-all duration-500 hover:shadow-xl hover:-translate-y-1 shadow-lg border border-gray-200 rounded-2xl sm:rounded-3xl bg-white">
                            <div className="relative overflow-hidden">
                              {/* [MCP] 수정/삭제 버튼 (이미지 우측 상단) */}
                              <div className="absolute bottom-3 right-3 z-10 flex gap-2">
                                <button
                                  className="bg-white/80 border border-gray-200 rounded-full p-2 shadow-sm hover:bg-violet-50 transition-colors"
                                  aria-label={t('mypage.service.editService')}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/services/register?id=${service.id}`);
                                  }}
                                  type="button"
                                >
                                  <Pencil className="w-5 h-5 text-violet-500" />
                                </button>
                                <button
                                  className="bg-white/80 border border-gray-200 rounded-full p-2 shadow-sm hover:bg-red-50 transition-colors"
                                  aria-label={t('mypage.service.deleteService')}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteModal(true);
                                    setDeleteTargetId(service.id);
                                  }}
                                  type="button"
                                  disabled={deletingId === service.id}
                                >
                                  {deletingId === service.id ? (
                                    <svg className="animate-spin w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                                  ) : (
                                    <Trash2 className="w-5 h-5 text-red-500" />
                                  )}
                                </button>
                              </div>
                              {service.image_url ? (
                                <Image
                                  src={service.image_url}
                                  alt={service.title}
                                  width={400}
                                  height={320}
                                  className="w-full h-64 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  quality={75}
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-64 sm:h-80 bg-violet-50">
                                  <Sparkles className="w-10 h-10 text-violet-500 mb-2 mx-auto" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
                              <span className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-blue-50 text-blue-700 border border-gray-200 rounded-full px-3 py-1 flex items-center gap-2 shadow-sm font-medium text-xs sm:text-sm transition-colors duration-200 hover:bg-gray-100 hover:border-gray-300">
                                <Brain className="w-4 h-4" /> {t('mypage.service.aiService')}
                              </span>
                            </div>
                            <CardContent className="p-3 sm:p-4 lg:p-5 text-sm sm:text-base lg:text-base">
                              <div className="space-y-3 sm:space-y-4 lg:space-y-5">
                                <div>
                                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-violet-600 transition-colors truncate whitespace-nowrap overflow-hidden max-w-full">
                                    {service.title}
                                  </h3>
                                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed truncate whitespace-nowrap overflow-hidden max-w-full">
                                    {service.description}
                                  </p>
                                </div>
                                {/* [MCP] ai_tools 영역은 항상 렌더링, min-h로 높이 고정 */}
                                <div className="flex items-center gap-2 mt-2 flex-wrap min-h-[28px]">
                                  {Array.isArray(service.ai_tools) && service.ai_tools.length > 0 ? (
                                    <>
                                      <span className="inline-flex items-center text-xs text-violet-500 font-semibold mr-1">
                                        <Sparkles className="w-4 h-4 mr-1" />AI Tools
                                      </span>
                                      {service.ai_tools.map((tool: string, toolIdx: number) => (
                                        <span
                                          key={toolIdx}
                                          className="inline-flex items-center bg-white/80 border border-violet-100 text-violet-700 font-medium px-2.5 py-1 rounded-full shadow-sm hover:bg-violet-50 transition-colors text-xs gap-1"
                                        >
                                          <Zap className="w-3 h-3 mr-1 text-violet-400" />
                                          {tool}
                                        </span>
                                      ))}
                                    </>
                                  ) : null}
                                </div>
                                {/* [MCP] 데모 URL 버튼은 항상 보이고, 값이 없으면 disabled */}
                                <div className="w-full mt-4">
                                  <Button
                                    className="w-full bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors font-semibold text-base py-3"
                                    onClick={() => {
                                      if (!service.demo_url) return;
                                      let url = service.demo_url;
                                      if (url && !/^https?:\/\//i.test(url)) {
                                        url = 'https://' + url;
                                      }
                                      window.open(url, '_blank', 'noopener,noreferrer,width=1200,height=800');
                                    }}
                                    disabled={!service.demo_url}
                                  >
                                    {t('mypage.service.tryDemo')}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'posts' && (
                  <div className="w-full">
                    <div className="max-w-4xl mx-auto">
                      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg shadow-gray-200/60 border border-gray-100 p-4 sm:p-6 lg:p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('mypage.section.myPosts')}</h2>
                        {/* [MCP] 내 포스트 리스트 로딩/에러/빈 상태 처리 */}
                        {myPostsLoading && <div className="text-center py-8 text-gray-500">{t('common.loading')}</div>}
                        {myPostsError && <div className="text-center py-8 text-red-500">{myPostsError}</div>}
                        {!myPostsLoading && !myPostsError && myPosts.length === 0 && (
                          <div className="text-center py-8 text-gray-400">{t('mypage.empty.myPosts')}</div>
                        )}
                        <div className="space-y-8">
                          {myPosts.map((post, index) => {
                            const categoryObj = postCategories.find(c => c.id === post.category);
                            const CategoryIcon = categoryObj?.icon;
                            return (
                              <div key={post.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="flex-1 flex flex-col justify-between p-6">
                                  {/* 상단: 유저 정보 & 카테고리 */}
                                  <div className="flex flex-col items-start gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                                    {/* 유저/날짜 */}
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center text-white font-semibold overflow-hidden">
                                        {user?.imageUrl ? (
                                          <Image src={user.imageUrl} alt="avatar" width={40} height={40} className="rounded-full object-cover" />
                                        ) : (
                                          (user?.firstName?.[0] || 'U')
                                        )}
                                      </div>
                                      <div>
                                        <div className="font-semibold text-gray-900">
                                          {user?.firstName} {user?.lastName}
                                        </div>
                                        <div className="text-xs text-gray-400 flex items-center gap-2">
                                          <span>{t('mypage.post.me')}</span>
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
                                  <div className="prose prose-sm max-w-none text-gray-700 mb-4"
                                    dangerouslySetInnerHTML={{ __html: formatContentWithRoundedImages(post.content) }}
                                  />
                                  {/* 태그/액션 하단 고정 */}
                                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                    <div className="flex flex-wrap gap-2">
                                      {post.tags && post.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
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
                                            className={`w-4 h-4 cursor-pointer transition-colors text-red-500 fill-current`}
                                            aria-label="좋아요 취소"
                                            onClick={() => handleUnlikeLikedPost(post.id)}
                                          />
                                          <span>{post.like_count || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <MessageCircle className="w-4 h-4 text-gray-400" />
                                          <span>{post.comments || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Eye className="w-4 h-4" />
                                          <span className="text-sm">{post.view_count || 0}</span>
                                        </div>
                                      </div>
                                      {/* [MCP] 수정/삭제 버튼 (서비스 카드와 동일 스타일) */}
                                      <div className="flex items-center gap-2 ml-4">
                                        <button
                                          aria-label={t('mypage.post.editPost')}
                                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                          onClick={() => handleEditClick(post)}
                                          type="button"
                                        >
                                          <Pencil className="w-5 h-5 text-gray-400 hover:text-blue-600" />
                                        </button>
                                        <button
                                          aria-label={t('mypage.post.deletePost')}
                                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                          onClick={() => setDeletePostId(post.id)}
                                          type="button"
                                        >
                                          <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'liked-posts' && (
                  <div className="w-full">
                    <div className="max-w-4xl mx-auto">
                      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg shadow-gray-200/60 border border-gray-100 p-4 sm:p-6 lg:p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('mypage.section.likedPosts')}</h2>
                        {/* [MCP] 좋아요한 포스트 리스트 로딩/에러/빈 상태 처리 */}
                        {likedPostsLoading && <div className="text-center py-8 text-gray-500">{t('common.loading')}</div>}
                        {likedPostsError && <div className="text-center py-8 text-red-500">{likedPostsError}</div>}
                        {!likedPostsLoading && !likedPostsError && likedPosts.length === 0 && (
                          <div className="text-center py-8 text-gray-400">{t('mypage.empty.likedPosts')}</div>
                        )}
                        <div className="space-y-8">
                          {likedPosts.map((post, index) => {
                            const categoryObj = postCategories.find(c => c.id === post.category);
                            const CategoryIcon = categoryObj?.icon;
                            return (
                              <div key={post.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
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
                                  <div className="prose prose-sm max-w-none text-gray-700 mb-4"
                                    dangerouslySetInnerHTML={{ __html: formatContentWithRoundedImages(post.content) }}
                                  />
                                  {/* 태그/액션 하단 고정 */}
                                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                    <div className="flex flex-wrap gap-2">
                                      {post.tags && post.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
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
                                            className={`w-4 h-4 cursor-pointer transition-colors text-red-500 fill-current`}
                                            aria-label={t('mypage.post.unlike')}
                                            onClick={() => handleUnlikeLikedPost(post.id)}
                                          />
                                          <span>{post.like_count || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <MessageCircle className="w-4 h-4 text-gray-400" />
                                          <span>{post.comments || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Eye className="w-4 h-4" />
                                          <span className="text-sm">{post.view_count || 0}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'liked-services' && (
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg shadow-gray-200/60 border border-gray-100 p-4 sm:p-6 lg:p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('mypage.section.likedServices')}</h2>
                    {/* [MCP] 좋아요한 서비스 리스트 로딩/에러/빈 상태 처리 */}
                    {likedServicesLoading && <div className="text-center py-8 text-gray-500">{t('common.loading')}</div>}
                    {likedServicesError && <div className="text-center py-8 text-red-500">{likedServicesError}</div>}
                    {!likedServicesLoading && !likedServicesError && likedServices.length === 0 && (
                      <div className="text-center py-8 text-gray-400">{t('mypage.empty.likedServices')}</div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6">
                      {likedServices.map((service) => (
                        <div key={service.id} className="mb-4 sm:mb-0">
                          <Card className="group cursor-pointer transition-all duration-500 hover:shadow-xl hover:-translate-y-1 shadow-lg border border-gray-200 rounded-2xl sm:rounded-3xl bg-white">
                            <div className="relative overflow-hidden">
                              {service.image_url ? (
                                <Image
                                  src={service.image_url}
                                  alt={service.title}
                                  width={400}
                                  height={320}
                                  className="w-full h-64 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  quality={75}
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-64 sm:h-80 bg-violet-50">
                                  <Sparkles className="w-10 h-10 text-violet-500 mb-2 mx-auto" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
                              <span className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-blue-50 text-blue-700 border border-gray-200 rounded-full px-3 py-1 flex items-center gap-2 shadow-sm font-medium text-xs sm:text-sm transition-colors duration-200 hover:bg-gray-100 hover:border-gray-300">
                                <Brain className="w-4 h-4" /> {t('mypage.service.aiService')}
                              </span>
                            </div>
                            <CardContent className="p-3 sm:p-4 lg:p-5 text-sm sm:text-base lg:text-base">
                              <div className="space-y-3 sm:space-y-4 lg:space-y-5">
                                <div>
                                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-violet-600 transition-colors truncate whitespace-nowrap overflow-hidden max-w-full">
                                    {service.title}
                                  </h3>
                                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed truncate whitespace-nowrap overflow-hidden max-w-full">
                                    {service.description}
                                  </p>
                                </div>
                                {/* [MCP] ai_tools 영역은 항상 렌더링, min-h로 높이 고정 */}
                                <div className="flex items-center gap-2 mt-2 flex-wrap min-h-[28px]">
                                  {Array.isArray(service.ai_tools) && service.ai_tools.length > 0 ? (
                                    <>
                                      <span className="inline-flex items-center text-xs text-violet-500 font-semibold mr-1">
                                        <Sparkles className="w-4 h-4 mr-1" />AI Tools
                                      </span>
                                      {service.ai_tools.map((tool: string, toolIdx: number) => (
                                        <span
                                          key={toolIdx}
                                          className="inline-flex items-center bg-white/80 border border-violet-100 text-violet-700 font-medium px-2.5 py-1 rounded-full shadow-sm hover:bg-violet-50 transition-colors text-xs gap-1"
                                        >
                                          <Zap className="w-3 h-3 mr-1 text-violet-400" />
                                          {tool}
                                        </span>
                                      ))}
                                    </>
                                  ) : null}
                                </div>
                                <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-100">
                                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                                    <span>{t('mypage.service.by')}</span>
                                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                                      {service.users?.avatar_url && (
                                        <Image
                                          src={service.users.avatar_url}
                                          alt={(service.users?.first_name || '') + (service.users?.last_name ? ' ' + service.users.last_name : '')}
                                          width={24}
                                          height={24}
                                          className="rounded-full object-cover border border-gray-200"
                                        />
                                      )}
                                      {service.users?.first_name || ''}{service.users?.last_name ? ' ' + service.users.last_name : ''}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-3 sm:space-x-4 text-gray-500 text-sm">
                                    <div className="flex items-center space-x-1">
                                      <Heart
                                        className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors cursor-pointer ${service.liked_by_user ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'}`}
                                        onClick={() => handleUnlikeService(service.id)}
                                      />
                                      <span className="font-medium">{service.like_count || 0}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                      <span className="font-medium">{service.views}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                      <span className="font-medium">{service.comments}</span>
                                    </div>
                                  </div>
                                </div>
                                {/* [MCP] 데모 URL 버튼은 항상 보이고, 값이 없으면 disabled */}
                                <div className="w-full mt-4">
                                  <Button
                                    className="w-full bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors font-semibold text-base py-3"
                                    onClick={() => {
                                      if (!service.demo_url) return;
                                      let url = service.demo_url;
                                      if (url && !/^https?:\/\//i.test(url)) {
                                        url = 'https://' + url;
                                      }
                                      window.open(url, '_blank', 'noopener,noreferrer,width=1200,height=800');
                                    }}
                                    disabled={!service.demo_url}
                                  >
                                    {t('mypage.service.tryDemo')}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'groups' && (
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg shadow-gray-200/60 border border-gray-100 p-4 sm:p-6 lg:p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('mypage.section.myGroups')}</h2>
                    {/* [MCP] 내 그룹 리스트 로딩/에러/빈 상태 처리 */}
                    {myGroupsLoading && <div className="text-center py-8 text-gray-500">{t('common.loading')}</div>}
                    {myGroupsError && <div className="text-center py-8 text-red-500">{myGroupsError}</div>}
                    {!myGroupsLoading && !myGroupsError && myGroups.length === 0 && (
                      <div className="text-center py-8 text-gray-400">{t('mypage.empty.myGroups')}</div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6">
                      {myGroups.map((group) => (
                        <div key={group.id} className="mb-4 sm:mb-0">
                          <Card className="group cursor-pointer transition-all duration-500 hover:shadow-xl hover:-translate-y-1 shadow-lg border border-gray-200 rounded-2xl sm:rounded-3xl bg-white">
                            <div className="relative overflow-hidden">
                              {group.image_url ? (
                                <Image
                                  src={group.image_url}
                                  alt={group.title}
                                  width={400}
                                  height={320}
                                  className="w-full h-64 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  quality={75}
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-64 sm:h-80 bg-violet-50">
                                  <Users className="w-10 h-10 text-violet-500 mb-2 mx-auto" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
                              <span className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-green-50 text-green-700 border border-gray-200 rounded-full px-3 py-1 flex items-center gap-2 shadow-sm font-medium text-xs sm:text-sm transition-colors duration-200 hover:bg-gray-100 hover:border-gray-300">
                                <Users className="w-4 h-4" /> {group.category || t('mypage.group.aiGroup')}
                              </span>
                            </div>
                            <CardContent className="p-3 sm:p-4 lg:p-5 text-sm sm:text-base lg:text-base">
                              <div className="space-y-3 sm:space-y-4 lg:space-y-5">
                                <div>
                                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-violet-600 transition-colors truncate whitespace-nowrap overflow-hidden max-w-full">
                                    {group.title}
                                  </h3>
                                  <div className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 overflow-hidden max-w-full"
                                    dangerouslySetInnerHTML={{ __html: formatContentWithRoundedImages(group.description || '') }}
                                  />
                                </div>
                                {/* [MCP] 그룹 정보 영역: 북마크 상태와 멤버 수를 한 줄에 좌우 배치 */}
                                <div className="flex items-center justify-between mt-2">
                                  {/* 내 역할 뱃지 (왼쪽) */}
                                  <span className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-3 py-1.5 rounded-full text-xs shadow-sm">
                                    {group.role === 'leader' ? (
                                      <Crown className="w-3 h-3 mr-1" />
                                    ) : (
                                      <User className="w-3 h-3 mr-1" />
                                    )}
                                    {group.role === 'leader' ? t('mypage.group.leader') : t('mypage.group.member')}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-100">
                                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                                    <span>{t('mypage.group.joinedAt')}</span>
                                    <span className="font-semibold text-gray-700">
                                      {formatDate(group.joined_at)}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-3 sm:space-x-4 text-gray-500 text-sm">
                                    <div className="flex items-center space-x-1">
                                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                                      <span className="font-medium">{groupMemberCounts[group.id] || 0}</span>
                                    </div>
                                  </div>
                                </div>
                                {/* [MCP] 그룹 입장 버튼 */}
                                <div className="w-full mt-4">
                                  <Button
                                    className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white rounded-2xl transition-all duration-300 font-bold text-base py-4 shadow-xl hover:shadow-2xl transform hover:scale-[1.03] flex items-center justify-center gap-3 border-2 border-blue-400/20"
                                    onClick={() => {
                                      openChatWithGroup(group.id);
                                    }}
                                  >
                                    <span className="text-lg">💬 {t('mypage.group.enterChat')}</span>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'bookmarked-groups' && (
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg shadow-gray-200/60 border border-gray-100 p-4 sm:p-6 lg:p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('mypage.section.bookmarkedGroups')}</h2>
                    {/* [MCP] 북마크한 그룹 리스트 로딩/에러/빈 상태 처리 */}
                    {bookmarkedGroupsLoading && <div className="text-center py-8 text-gray-500">{t('common.loading')}</div>}
                    {bookmarkedGroupsError && <div className="text-center py-8 text-red-500">{bookmarkedGroupsError}</div>}
                    {!bookmarkedGroupsLoading && !bookmarkedGroupsError && bookmarkedGroups.length === 0 && (
                      <div className="text-center py-8 text-gray-400">{t('mypage.empty.bookmarkedGroups')}</div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6">
                      {bookmarkedGroups.map((group) => (
                        <div key={group.id} className="mb-4 sm:mb-0">
                          <Card className="group cursor-pointer transition-all duration-500 hover:shadow-xl hover:-translate-y-1 shadow-lg border border-gray-200 rounded-2xl sm:rounded-3xl bg-white">
                            <div className="relative overflow-hidden">
                              {group.image_url ? (
                                <Image
                                  src={group.image_url}
                                  alt={group.title}
                                  width={400}
                                  height={320}
                                  className="w-full h-64 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  quality={75}
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-64 sm:h-80 bg-violet-50">
                                  <Users className="w-10 h-10 text-violet-500 mb-2 mx-auto" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
                              <span className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-violet-50 text-violet-700 border border-gray-200 rounded-full px-3 py-1 flex items-center gap-2 shadow-sm font-medium text-xs sm:text-sm transition-colors duration-200 hover:bg-gray-100 hover:border-gray-300">
                                <Bookmark className="w-4 h-4" /> {group.category || t('mypage.group.aiGroup')}
                              </span>
                              {/* [MCP] 북마크 해제 버튼 (우측 상단) */}
                              <button
                                className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-white/80 border border-gray-200 rounded-full p-2 shadow-sm hover:bg-red-50 hover:border-red-200 transition-colors z-10"
                                aria-label={t('mypage.group.unbookmark')}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnbookmarkGroup(group.id);
                                }}
                                type="button"
                              >
                                <Bookmark className="w-5 h-5 text-violet-500 fill-violet-500" />
                              </button>
                            </div>
                            <CardContent className="p-3 sm:p-4 lg:p-5 text-sm sm:text-base lg:text-base">
                              <div className="space-y-3 sm:space-y-4 lg:space-y-5">
                                <div>
                                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-violet-600 transition-colors truncate whitespace-nowrap overflow-hidden max-w-full">
                                    {group.title}
                                  </h3>
                                  <div className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 overflow-hidden max-w-full"
                                    dangerouslySetInnerHTML={{ __html: formatContentWithRoundedImages(group.description || '') }}
                                  />
                                </div>
                                {/* [MCP] 그룹 정보 영역: 역할과 멤버 수를 한 줄에 좌우 배치 */}
                                <div className="flex items-center justify-between mt-2">
                                  {/* 내 역할 뱃지 (왼쪽) */}
                                  <span className="inline-flex items-center bg-gradient-to-r from-violet-500 to-violet-600 text-white font-semibold px-3 py-1.5 rounded-full text-xs shadow-sm">
                                    {group.role === 'leader' ? (
                                      <Crown className="w-3 h-3 mr-1" />
                                    ) : (
                                      <User className="w-3 h-3 mr-1" />
                                    )}
                                    {group.role === 'leader' ? t('mypage.group.leader') : t('mypage.group.member')}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-100">
                                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                                    <span>{t('mypage.group.bookmarkedAt')}</span>
                                    <span className="font-semibold text-gray-700">
                                      {formatDate(group.bookmarked_at)}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-3 sm:space-x-4 text-gray-500 text-sm">
                                    <div className="flex items-center space-x-1">
                                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                                      <span className="font-medium">{groupMemberCounts[group.id] || 0}</span>
                                    </div>
                                  </div>
                                </div>
                                {/* [MCP] 그룹 입장 버튼 */}
                                <div className="w-full mt-4">
                                  <Button
                                    className="w-full bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors font-semibold text-base py-3"
                                    onClick={() => {
                                      router.push(`/match/groups/${group.id}`);
                                    }}
                                  >
                                    {t('mypage.group.viewDetails')}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      {/* [MCP] 서비스 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[2200] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full relative border border-gray-200 text-center">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => { setShowDeleteModal(false); setDeleteTargetId(null); }}
              aria-label="팝업 닫기"
            >
              ×
            </button>
            <Sparkles className="w-10 h-10 text-violet-500 mb-2 mx-auto" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">{t('mypage.delete.serviceTitle')}</h2>
            <p className="text-gray-600 text-base">{t('mypage.delete.serviceDesc')}</p>
            <div className="flex flex-col gap-2 mt-6">
              <button
                className="px-6 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-semibold text-base hover:scale-105 transition-all disabled:opacity-60"
                onClick={() => deleteTargetId && handleDeleteService(deleteTargetId)}
                disabled={deletingId === deleteTargetId}
              >
                {deletingId === deleteTargetId ? t('common.deleting') : t('common.delete')}
              </button>
              <button
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold text-base hover:bg-gray-200 transition-all"
                onClick={() => { setShowDeleteModal(false); setDeleteTargetId(null); }}
                disabled={deletingId === deleteTargetId}
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* [MCP] 포스트 삭제 팝업 - 서비스 삭제 팝업과 완전히 동일한 디자인 */}
      {deletePostId && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center">
          {/* 오버레이 */}
          <div className="fixed inset-0 bg-gray-900/60 pointer-events-auto z-[1100]" />
          {/* [MCP] 팝업 컨텐츠: flex 중앙정렬만 사용, fixed/translate 제거 */}
          <div className="relative z-[1110] bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-xs min-w-[320px] px-6 pt-8 pb-6 flex flex-col items-center">
            {/* 우상단 X 닫기 버튼 */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setDeletePostId(null)}
              disabled={deleteLoading}
              aria-label="닫기"
              type="button"
            >
              <X className="w-6 h-6" />
            </button>
            {/* 상단 Sparkles 아이콘 */}
            <Sparkles className="w-10 h-10 text-violet-400 mb-2" />
            {/* 제목 */}
            <div className="mb-2 text-lg font-bold text-gray-900 text-center">{t('mypage.delete.postTitle')}</div>
            {/* 부가설명 */}
            <div className="mb-4 text-gray-500 text-sm text-center">{t('mypage.delete.postDesc')}</div>
            {deleteError && <div className="mb-2 text-red-500 text-sm text-center">{deleteError}</div>}
            {/* 삭제/취소 버튼 (full width, 순서: 삭제-취소, 간격 넉넉) */}
            <button
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold text-base shadow-sm hover:from-violet-600 hover:to-blue-600 transition-colors disabled:opacity-60 mb-3"
              onClick={handleDeletePost}
              disabled={deleteLoading}
              type="button"
            >
              {deleteLoading ? t('common.deleting') : t('common.delete')}
            </button>
            <button
              className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold text-base shadow-sm hover:bg-gray-200 transition-colors"
              onClick={() => setDeletePostId(null)}
              disabled={deleteLoading}
              type="button"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}
      {/* [MCP] 포스트 수정 모달 (edit 모드) */}
      {editModalOpen && editPost && (
        <PostCreateModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          mode="edit"
          postId={editPost.id}
          initialContent={editPost.content}
          initialCategory={editPost.category}
          initialTags={editPost.tags || []}
          onPostUpdated={handlePostUpdated}
        />
      )}
    </div>
  );
};

// Suspense 래퍼 컴포넌트
function MyPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-[104px] sm:pt-32 py-12">
          <div className="text-center text-gray-500 py-8">로딩 중...</div>
        </div>
      </div>
    }>
      <MyPage />
    </Suspense>
  )
}

export default MyPageWrapper;