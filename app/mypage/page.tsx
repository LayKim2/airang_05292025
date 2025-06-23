// /mypage 라우트: 로그인된 사용자의 프로필(이름, 이메일, 이미지 등)을 보여주는 페이지
"use client";
import { useUser } from "@clerk/nextjs";

export default function MyPageRoute() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>로그인이 필요합니다.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md flex flex-col items-center">
      <img
        src={user.imageUrl}
        alt="프로필 이미지"
        className="w-24 h-24 rounded-full mb-4 border-2 border-violet-400"
      />
      <h2 className="text-2xl font-bold mb-2">{user.fullName || user.username || "이름 없음"}</h2>
      <p className="text-gray-600 mb-1">{user.primaryEmailAddress?.emailAddress || "이메일 없음"}</p>
      <p className="text-gray-400 text-sm">User ID: {user.id}</p>
    </div>
  );
} 