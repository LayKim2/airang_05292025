// /mypage 라우트: 로그인된 사용자의 프로필(이름, 이메일, 이미지 등)을 보여주는 페이지
"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Award, Star, CheckCircle, Clock, X, FileText, Bot, Heart, ChevronRight, User } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const MyPage = () => {
  // [MCP] 데모용 역할/탭 상태
  const [userRole, setUserRole] = useState<'creator' | 'expert'>('expert');
  const [activeTab, setActiveTab] = useState('profile');
  const { user, isLoaded } = useUser();

  // [MCP] 더미 데이터 (실제 fetch로 대체 예정)
  const userData = {
    name: user?.fullName || user?.username || "이름 없음",
    profileImage: user?.imageUrl || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    role: userRole,
    joinDate: "2024.03.15",
    phone: "미등록" // [MCP] 핸드폰번호 추가, 실제 데이터 없으므로 미등록
  };
  const expertApplication = {
    status: userRole === 'expert' ? 'approved' : 'pending',
    appliedDate: "2024.05.20",
    approvedDate: userRole === 'expert' ? "2024.05.25" : null,
    field: "AI/머신러닝"
  };
  const myPosts = [
    { id: 1, title: "ChatGPT 활용한 콘텐츠 제작 팁", likes: 24, date: "2024.06.20", category: "AI 활용" },
    { id: 2, title: "프롬프트 엔지니어링 기초 가이드", likes: 18, date: "2024.06.15", category: "프롬프트" },
    { id: 3, title: "AI 도구로 업무 효율성 높이기", likes: 31, date: "2024.06.10", category: "생산성" }
  ];
  const myAIServices = [
    { id: 1, name: "스마트 텍스트 요약기", users: 156, rating: 4.8, date: "2024.06.18" },
    { id: 2, name: "이미지 자동 태깅 도구", users: 89, rating: 4.6, date: "2024.06.12" }
  ];
  const likedPosts = [
    { id: 1, title: "AI 윤리에 대한 생각", author: "박민수", likes: 45, date: "2024.06.22" },
    { id: 2, title: "미드저니 고급 활용법", author: "이영희", likes: 67, date: "2024.06.20" }
  ];
  const likedServices = [
    { id: 1, name: "코딩 어시스턴트 AI", author: "개발팀", rating: 4.9, users: 234 },
    { id: 2, name: "언어 번역 도구", author: "언어연구소", rating: 4.7, users: 189 }
  ];

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
  // [MCP] 사이드 메뉴 항목
  const menuItems = [
    { id: 'profile', label: '기본정보', icon: User },
    { id: 'expert-status', label: '전문가 신청', icon: Award },
    { id: 'posts', label: '내 포스트', icon: FileText },
    { id: 'services', label: '내 AI 서비스', icon: Bot },
    { id: 'liked-posts', label: '좋아요한 포스트', icon: Heart },
    { id: 'liked-services', label: '좋아요한 AI 서비스', icon: Star }
  ];
  const MenuItem = ({ item, isActive, onClick }: any) => (
    <button
      onClick={() => onClick(item.id)}
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

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>로그인이 필요합니다.</div>;

  return (
    // [MYPAGE][MCP] 전체 배경 그라데이션, 카드 soft shadow+border+hover, 사이드 메뉴 blur/투명도 등으로 세련된 느낌 강화
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20">
      {/* [MCP] 왼쪽 고정 사이드 메뉴: blur/투명도 효과 추가, 모바일에서는 숨김 */}
      <aside className="hidden sm:flex w-80 bg-white/90 backdrop-blur-md shadow-xl flex-col p-6 gap-8 border-r border-gray-100 min-h-screen">
        {/* [MCP] 마이페이지 타이틀+아이콘 */}
        <div className="flex items-center gap-2 mb-6">
          <User className="w-6 h-6 text-blue-500" />
          <span className="text-lg font-bold text-gray-800">마이페이지</span>
        </div>
        {/* 네비게이션 메뉴 (유지) */}
        <nav className="space-y-2">
          {menuItems.map(item => (
            <MenuItem 
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              onClick={setActiveTab}
            />
          ))}
        </nav>
        {/* 데모 역할 토글 - 카드 스타일, 버튼 soft shadow/hover/active 강조 [MCP] */}
        <div className="mt-8 bg-white/80 border border-blue-100 rounded-xl shadow-sm p-4">
          <p className="text-sm text-blue-700 mb-3 font-medium">데모용 역할 변경:</p>
          <div className="flex gap-2">
            <button 
              onClick={() => setUserRole('creator')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md border border-blue-200 ${
                userRole === 'creator' ? 'bg-blue-500 text-white scale-105 ring-2 ring-blue-300' : 'bg-white text-blue-500 hover:bg-blue-50'
              }`}
            >
              Creator
            </button>
            <button 
              onClick={() => setUserRole('expert')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md border border-blue-200 ${
                userRole === 'expert' ? 'bg-blue-500 text-white scale-105 ring-2 ring-blue-300' : 'bg-white text-blue-500 hover:bg-blue-50'
              }`}
            >
              Expert
            </button>
          </div>
        </div>
      </aside>
      {/* [MCP] 오른쪽 컨텐츠 영역: width 제한(max-w-3xl 등) 제거, w-full max-w-none로 카드가 화면 전체를 쓰게 함 */}
      <main className="flex-1 flex flex-col items-start justify-start w-full max-w-none pl-16 pr-8 pt-16 pb-8 bg-transparent">
        {/* [MCP] 마이페이지 서브헤더 */}

        <div className="w-full">
          {/* [MCP] activeTab === 'profile'일 때 기본정보: 정보(이메일, 가입일, 핸드폰번호)를 오른쪽 정렬로 배치 */}
          {activeTab === 'profile' && (
            <section className="w-full mb-8">
              <div className="backdrop-blur-md bg-white/70 border border-gray-200 shadow-lg rounded-3xl w-full flex flex-row items-center px-0 py-10 relative">
                {/* 왼쪽: 프로필/이름/역할명/메달 이미지를 row(가로)로, 메달 이미지는 최대한 크게 명확하게 */}
                <div className="flex items-center gap-8 pl-10 flex-1 min-w-0">
                  <img 
                    src={userData.profileImage} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-200 bg-white shadow-md"
                  />
                  <div className="flex flex-col gap-2 min-w-0">
                    <span className="text-2xl font-bold text-gray-900 truncate">{userData.name}</span>
                    <span className="text-base font-semibold text-blue-500">{userData.role === 'expert' ? 'Expert' : 'Creator'}</span>
                  </div>
                </div>
                
                {/* 오른쪽: 정보(이메일, 가입일, 핸드폰번호) */}
                <div className="flex flex-col gap-3 min-w-[300px] pl-10 pr-10 text-left">
                  <div>
                    <span className="text-gray-500 font-medium mr-2">이메일</span>
                    <span className="text-gray-800">{user?.primaryEmailAddress?.emailAddress || '이메일 없음'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium mr-2">가입일</span>
                    <span className="text-gray-800">{userData.joinDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium mr-2">핸드폰번호</span>
                    <span className="text-gray-800">{userData.phone}</span>
                  </div>
                </div>
                
                <div>
                  {/* [MCP] Expert면 메달 이미지를 카드 전체 높이에 맞춰 오른쪽에 절대 배치 */}
                  {userData.role === 'expert' && (
                    <img src="/images/role/expert.png" alt="Expert Medal" className="absolute right-10 top-0 bottom-0 my-auto h-full max-h-[calc(100%-4rem)] w-auto object-contain" />
                  )}
                  {userData.role === 'creator' && (
                    <img src="/images/role/creator2.png" alt="Expert Medal" className="absolute right-10 top-0 bottom-0 my-auto h-full max-h-[calc(100%-4rem)] w-auto object-contain" />
                  )}
                </div>
                
              </div>
            </section>
          )}
          {/* 전문가 신청 현황 */}
          {activeTab === 'expert-status' && (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg shadow-gray-200/60 border border-gray-100 p-8 transition hover:scale-[1.02] hover:shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">전문가 신청 현황</h2>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-gray-700">분야: {expertApplication.field}</span>
                    {getStatusBadge(expertApplication.status)}
                  </div>
                </div>
                <div className="text-gray-600 space-y-2">
                  <p>신청일: {expertApplication.appliedDate}</p>
                  {expertApplication.approvedDate && (
                    <p>승인일: {expertApplication.approvedDate}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* 내가 작성한 포스트 */}
          {activeTab === 'posts' && (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg shadow-gray-200/60 border border-gray-100 p-8 transition hover:scale-[1.02] hover:shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">내가 작성한 포스트</h2>
              <div className="space-y-4">
                {myPosts.map(post => (
                  <div key={post.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{post.category}</span>
                        <span>{post.date}</span>
                        <span className="flex items-center gap-1">
                          <Heart size={14} className="text-red-400" />
                          {post.likes}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* 내가 올린 AI 서비스 */}
          {activeTab === 'services' && (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg shadow-gray-200/60 border border-gray-100 p-8 transition hover:scale-[1.02] hover:shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">내가 올린 AI 서비스</h2>
              <div className="space-y-4">
                {myAIServices.map(service => (
                  <div key={service.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{service.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full">사용자 {service.users}명</span>
                        <span className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-400" />
                          {service.rating}
                        </span>
                        <span>{service.date}</span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* 좋아요한 포스트 */}
          {activeTab === 'liked-posts' && (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg shadow-gray-200/60 border border-gray-100 p-8 transition hover:scale-[1.02] hover:shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">좋아요한 포스트</h2>
              <div className="space-y-4">
                {likedPosts.map(post => (
                  <div key={post.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>by {post.author}</span>
                        <span>{post.date}</span>
                        <span className="flex items-center gap-1">
                          <Heart size={14} className="text-red-400" />
                          {post.likes}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* 좋아요한 AI 서비스 */}
          {activeTab === 'liked-services' && (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg shadow-gray-200/60 border border-gray-100 p-8 transition hover:scale-[1.02] hover:shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">좋아요한 AI 서비스</h2>
              <div className="space-y-4">
                {likedServices.map(service => (
                  <div key={service.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{service.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>by {service.author}</span>
                        <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full">사용자 {service.users}명</span>
                        <span className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-400" />
                          {service.rating}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyPage; 