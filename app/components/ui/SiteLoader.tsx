import { Sparkles } from "lucide-react";

export default function SiteLoader({ text = "로딩 중..." }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 z-[2000]">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* 트랜디한 그라데이션 스피너 */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="block w-full h-full rounded-full animate-spin"
            style={{
              borderWidth: '3px',
              borderStyle: 'solid',
              borderImage: 'conic-gradient(from 0deg, #8b5cf6 0deg, #3b82f6 120deg, transparent 120deg, transparent 360deg) 1',
              boxShadow: '0 0 16px 2px #a5b4fc66',
            }}
          />
        </span>
        {/* 중앙 아이콘 */}
        <Sparkles className="w-10 h-10 text-violet-600 z-10 drop-shadow-lg" />
      </div>
      <div className="mt-6 text-lg font-semibold text-violet-700">{text}</div>
    </div>
  );
} 