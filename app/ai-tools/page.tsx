'use client'

import { useTranslation } from "@/app/i18n/useTranslation"
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Sparkles } from "lucide-react"

interface AITool {
  name: string
  icon: string
  description: string
  freeFeatures: string
  paidFeatures: string
  pricing: string
  url?: string
}

interface AIToolCategory {
  key: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  tools: AITool[];
}

const categories: AIToolCategory[] = [
  {
    key: 'writing',
    title: '글쓰기 및 콘텐츠 생성',
    icon: <span className="text-2xl">📝</span>,
    color: 'from-indigo-400 via-indigo-500 to-indigo-700',
    tools: [
      { 
        name: 'ChatGPT (OpenAI)', 
        icon: '🤖', 
        description: '대화형 AI로 다양한 글쓰기, 요약, 번역, 아이디어 생성에 활용',
        freeFeatures: 'GPT-3.5 기반, 기본 기능 제공, 피크 시간 제한',
        paidFeatures: 'GPT-4/4o, 더 빠른 응답, DALL·E 3 이미지 생성, 고급 기능',
        pricing: '무료/유료(월 $20)',
        url: 'https://chat.openai.com' 
      },
      { 
        name: 'Claude (Anthropic)', 
        icon: '🧑‍💼', 
        description: '자연스러운 글쓰기, 긴 문서 처리, 친근한 대화',
        freeFeatures: '기본 대화, 문서 분석, 요약 기능',
        paidFeatures: '고급 기능, 더 긴 컨텍스트, 우선 응답',
        pricing: '무료/유료',
        url: 'https://claude.ai' 
      },
      { 
        name: 'Grammarly', 
        icon: '🟢', 
        description: '맞춤법, 문장 교정, 톤 추천 등 글쓰기 품질 향상',
        freeFeatures: '기본 문법 검사, 맞춤법 교정',
        paidFeatures: '고급 교정, 스타일, 표절 검사, 톤 추천',
        pricing: '무료/유료',
        url: 'https://grammarly.com' 
      },
      { 
        name: 'QuillBot', 
        icon: '✏️', 
        description: '문장 다듬기, 요약, 번역 등 글쓰기 보조에 특화',
        freeFeatures: '기본 문장 재구성, 간단한 요약',
        paidFeatures: '고급 기능(확장, 다양한 모드), 고급 요약, 번역',
        pricing: '무료/유료',
        url: 'https://quillbot.com' 
      },
    ]
  },
  {
    key: 'image',
    title: '이미지 생성 및 편집',
    icon: <span className="text-2xl">🖼️</span>,
    color: 'from-purple-400 via-fuchsia-500 to-pink-500',
    tools: [
      { 
        name: 'Canva', 
        icon: '🎨', 
        description: '직관적 디자인, 다양한 템플릿, AI 이미지 생성 기능',
        freeFeatures: '기본 디자인 기능, 템플릿, 제한된 AI 기능',
        paidFeatures: '프리미엄 기능, 무제한 AI 생성, 브랜드 키트',
        pricing: '무료/유료(월 $15)',
        url: 'https://canva.com' 
      },
      { 
        name: 'Midjourney', 
        icon: '🌅', 
        description: '예술적이고 감성적인 이미지, 커뮤니티 기반',
        freeFeatures: '제한된 생성 횟수, 기본 기능',
        paidFeatures: '무제한 생성, 고급 기능, 우선 처리',
        pricing: '유료(월 $10~$60)',
        url: 'https://www.midjourney.com' 
      },
      { 
        name: 'DALL·E 3 (OpenAI)', 
        icon: '🖌️', 
        description: '프롬프트 해석력 우수, 사실적이고 다양한 이미지 생성',
        freeFeatures: 'ChatGPT Plus 구독 시 기본 기능',
        paidFeatures: '고급 기능, 더 빠른 생성, 우선 처리',
        pricing: '무료/유료',
        url: 'https://openai.com/dall-e-2' 
      },
      { 
        name: 'Adobe Firefly', 
        icon: '🔥', 
        description: 'Adobe 생태계와 연동, 스마트 이미지 생성 및 편집',
        freeFeatures: '제한된 생성 횟수, 기본 기능',
        paidFeatures: '무제한 생성, 고급 기능, Creative Cloud 통합',
        pricing: '무료/유료',
        url: 'https://firefly.adobe.com' 
      },
    ]
  },
  {
    key: 'video',
    title: '영상 생성 및 편집',
    icon: <span className="text-2xl">🎬</span>,
    color: 'from-pink-400 via-rose-400 to-orange-400',
    tools: [
      { 
        name: 'Synthesia', 
        icon: '🗣️', 
        description: 'AI 아바타 기반 영상, 마케팅·교육용 영상 제작',
        freeFeatures: '제한된 생성 횟수, 기본 아바타',
        paidFeatures: '230+ 아바타, 140+ 언어 지원, 무제한 생성',
        pricing: '유료',
        url: 'https://www.synthesia.io' 
      },
      { 
        name: 'Runway', 
        icon: '🎞️', 
        description: '프롬프트 기반 영상 생성, 다양한 편집 기능',
        freeFeatures: '제한된 사용량, 기본 기능',
        paidFeatures: '무제한 생성, 고급 편집 기능, 우선 처리',
        pricing: '무료/유료',
        url: 'https://runwayml.com' 
      },
      { 
        name: 'OpusClip', 
        icon: '✂️', 
        description: '영상 요약, 하이라이트 자동 생성',
        freeFeatures: '기본 편집 기능, 제한된 하이라이트',
        paidFeatures: '고급 편집, 무제한 하이라이트, 자동화',
        pricing: '무료/유료',
        url: 'https://www.opus.pro' 
      },
      { 
        name: 'Filmora', 
        icon: '🎥', 
        description: '직관적 인터페이스, 다양한 편집 기능',
        freeFeatures: '기본 편집 기능, 워터마크',
        paidFeatures: '고급 편집, 효과, 무제한 내보내기',
        pricing: '무료/유료',
        url: 'https://filmora.wondershare.com' 
      },
    ]
  },
  {
    key: 'data',
    title: '데이터 분석 및 자동화',
    icon: <span className="text-2xl">📊</span>,
    color: 'from-blue-400 via-cyan-400 to-teal-400',
    tools: [
      { 
        name: 'Zapier', 
        icon: '🔗', 
        description: '7,000+ 앱 연동, 워크플로 자동화',
        freeFeatures: '제한된 작업 수, 기본 자동화',
        paidFeatures: '무제한 작업, 고급 자동화, 우선 처리',
        pricing: '무료/유료',
        url: 'https://zapier.com' 
      },
      { 
        name: 'Google Sheets (AI 애드온)', 
        icon: '📈', 
        description: '스프레드시트 기반 데이터 분석, 다양한 AI 확장 기능',
        freeFeatures: '기본 스프레드시트 기능',
        paidFeatures: 'AI 애드온, 고급 분석, 자동화',
        pricing: '무료/유료',
        url: 'https://sheets.google.com' 
      },
      { 
        name: 'n8n', 
        icon: '🔄', 
        description: '노코드 자동화, 다양한 앱 연동',
        freeFeatures: '오픈소스 버전, 기본 기능',
        paidFeatures: '엔터프라이즈 기능, 우선 지원',
        pricing: '무료/유료',
        url: 'https://n8n.io' 
      },
      { 
        name: 'Albato', 
        icon: '🔌', 
        description: '간단한 설정, 다양한 앱 연동',
        freeFeatures: '제한된 연동 수, 기본 자동화',
        paidFeatures: '무제한 연동, 고급 자동화',
        pricing: '무료/유료',
        url: 'https://albato.com' 
      },
    ]
  },
  {
    key: 'meeting',
    title: '회의 및 생산성',
    icon: <span className="text-2xl">📅</span>,
    color: 'from-green-400 via-lime-400 to-yellow-300',
    tools: [
      { name: 'Notion AI', icon: '🗒️', pricing: '무료/유료', description: 'AI 기반 노트 작성, 요약, 문서 자동화', freeFeatures: '기본 노트 작성, 7일 버전 기록, 5MB 파일 업로드', paidFeatures: 'AI 무제한 사용, 30~90일 버전 기록, 무제한 업로드, 월 $10~', url: 'https://www.notion.so/product/ai' },
      { name: 'Otter.ai', icon: '🦦', pricing: '무료/유료', description: '회의 녹음, 실시간 AI 요약, 자동 전사', freeFeatures: '월 300분, 회의당 30분, 기본 협업', paidFeatures: '월 1,200~6,000분, 고급 검색/내보내기, 팀 관리, 월 $8.33~', url: 'https://otter.ai' },
      { name: 'Fathom', icon: '🎙️', pricing: '무료/유료', description: '회의 요약, 녹취록, 액션 아이템 추출', freeFeatures: '월 3회 회의 녹음, 기본 요약, 제한된 기능', paidFeatures: '무제한 녹음, 고급 요약, 액션 아이템 추출, 팀 기능, 월 $15~', url: 'https://fathom.video' },
      { name: 'ClickUp', icon: '✅', pricing: '무료/유료', description: '프로젝트 관리, AI 기반 업무 자동화', freeFeatures: '무제한 작업, 100MB 저장공간, 기본 협업', paidFeatures: '무제한 저장공간, 고급 권한, AI 기능, 월 $7~', url: 'https://clickup.com' },
    ]
  },
  {
    key: 'coding',
    title: '코딩 및 개발',
    icon: <span className="text-2xl">💻</span>,
    color: 'from-gray-700 via-gray-500 to-gray-400',
    tools: [
      { name: 'GitHub Copilot', icon: '🤖', pricing: '무료/유료', description: 'AI 코드 자동완성, 코드 리뷰, 채팅', freeFeatures: '월 2,000회 코드 완성, 50회 채팅', paidFeatures: '무제한 코드 완성, 고급 모델, 월 $10~', url: 'https://github.com/features/copilot' },
      { name: 'AskCodi', icon: '🤖', pricing: '무료/유료', description: '코드 생성, 리팩토링, 무료 크레딧 제공', freeFeatures: '월 100 크레딧, 기본 코드 생성', paidFeatures: '무제한 크레딧, 고급 기능, 팀 기능, 월 $10~', url: 'https://www.askcodi.com' },
      { name: 'DeepSeek', icon: '🧠', pricing: '무료', description: '코딩, 수학, 논리 문제 해결에 특화', freeFeatures: '무제한 사용, 기본 기능', paidFeatures: '현재 무료로 제공', url: 'https://deepseek.com' },
    ]
  },
  {
    key: 'voice',
    title: '음성 생성 및 편집',
    icon: <span className="text-2xl">🎤</span>,
    color: 'from-orange-400 via-amber-400 to-yellow-400',
    tools: [
      { name: 'ElevenLabs', icon: '🗣️', pricing: '무료/유료', description: '자연스러운 음성 합성, 무료 사용량 제한', freeFeatures: '월 10,000자, 기본 음성', paidFeatures: '월 100,000~2,000,000자, 고급 음성, API, 월 $5~', url: 'https://elevenlabs.io' },
      { name: 'Murf', icon: '🎙️', pricing: '무료/유료', description: '보이스오버 생성, 무료 체험 후 유료', freeFeatures: '10분 무료 체험, 기본 음성', paidFeatures: '월 60~300분, 고급 음성, 상업적 사용, 월 $13~', url: 'https://murf.ai' },
      { name: 'Descript', icon: '🔊', pricing: '무료/유료', description: '오디오/비디오 편집, AI 음성 제거, 무료 플랜 있음', freeFeatures: '3시간 오디오/비디오, 기본 편집', paidFeatures: '무제한 편집, 고급 기능, 팀 기능, 월 $12~', url: 'https://www.descript.com' },
    ]
  },
  {
    key: 'customer',
    title: '고객 서비스',
    icon: <span className="text-2xl">💬</span>,
    color: 'from-green-400 via-emerald-400 to-teal-400',
    tools: [
      { 
        name: 'Intercom', 
        icon: '💬', 
        description: 'AI 기반 고객 지원, 챗봇 자동화',
        freeFeatures: '제한된 메시지 수, 기본 챗봇',
        paidFeatures: '무제한 메시지, 고급 AI 기능, 우선 지원',
        pricing: '무료/유료',
        url: 'https://www.intercom.com' 
      },
      { 
        name: 'Zendesk', 
        icon: '🎫', 
        description: '고객 지원 티켓 관리, AI 자동화',
        freeFeatures: '제한된 티켓 수, 기본 기능',
        paidFeatures: '무제한 티켓, 고급 자동화, 분석',
        pricing: '무료/유료',
        url: 'https://www.zendesk.com' 
      },
      { 
        name: 'Drift', 
        icon: '🤖', 
        description: '실시간 채팅, AI 챗봇',
        freeFeatures: '기본 채팅 기능, 제한된 봇',
        paidFeatures: '고급 봇, 무제한 대화, 분석',
        pricing: '무료/유료',
        url: 'https://www.drift.com' 
      },
      { 
        name: 'Freshdesk', 
        icon: '📞', 
        description: '고객 지원 플랫폼, 티켓 관리',
        freeFeatures: '제한된 티켓, 기본 기능',
        paidFeatures: '무제한 티켓, 고급 자동화, 보고서',
        pricing: '무료/유료',
        url: 'https://freshdesk.com' 
      },
    ]
  },
  {
    key: 'marketing',
    title: '마케팅',
    icon: <span className="text-2xl">📢</span>,
    color: 'from-purple-400 via-fuchsia-400 to-pink-400',
    tools: [
      { 
        name: 'Jasper', 
        icon: '✍️', 
        description: 'AI 마케팅 콘텐츠 생성, 브랜드 음성',
        freeFeatures: '제한된 생성 수, 기본 템플릿',
        paidFeatures: '무제한 생성, 브랜드 음성, 팀 협업',
        pricing: '무료/유료',
        url: 'https://www.jasper.ai' 
      },
      { 
        name: 'Copy.ai', 
        icon: '📝', 
        description: '마케팅 카피, 소셜 미디어 콘텐츠',
        freeFeatures: '제한된 생성 수, 기본 기능',
        paidFeatures: '무제한 생성, 고급 기능, API',
        pricing: '무료/유료',
        url: 'https://www.copy.ai' 
      },
      { 
        name: 'Lately', 
        icon: '📊', 
        description: '소셜 미디어 콘텐츠 생성, 분석',
        freeFeatures: '제한된 포스트, 기본 분석',
        paidFeatures: '무제한 포스트, 고급 분석, 자동화',
        pricing: '무료/유료',
        url: 'https://www.lately.ai' 
      },
      { 
        name: 'Phrasee', 
        icon: '🎯', 
        description: '이메일 마케팅 최적화, AI 카피라이팅',
        freeFeatures: '제한된 최적화, 기본 기능',
        paidFeatures: '무제한 최적화, 고급 분석, API',
        pricing: '무료/유료',
        url: 'https://phrasee.co' 
      },
    ]
  },
  {
    key: 'education',
    title: '교육',
    icon: <span className="text-2xl">📚</span>,
    color: 'from-blue-400 via-indigo-400 to-violet-400',
    tools: [
      { 
        name: 'Duolingo', 
        icon: '🦉', 
        description: 'AI 기반 언어 학습, 개인화된 학습 경험',
        freeFeatures: '기본 학습 기능, 광고 포함',
        paidFeatures: '무제한 학습, 오프라인 모드, 광고 제거',
        pricing: '무료/유료',
        url: 'https://www.duolingo.com' 
      },
      { 
        name: 'Coursera', 
        icon: '🎓', 
        description: 'AI 강좌, 인증 프로그램',
        freeFeatures: '제한된 강좌 접근, 기본 기능',
        paidFeatures: '전체 강좌 접근, 인증서, 과제',
        pricing: '무료/유료',
        url: 'https://www.coursera.org' 
      },
      { 
        name: 'Khan Academy', 
        icon: '📖', 
        description: '무료 교육 콘텐츠, AI 기반 학습',
        freeFeatures: '전체 콘텐츠 접근, 기본 기능',
        paidFeatures: '추가 기능, 우선 지원',
        pricing: '무료/유료',
        url: 'https://www.khanacademy.org' 
      },
      { 
        name: 'Quizlet', 
        icon: '✏️', 
        description: 'AI 기반 학습 도구, 플래시카드',
        freeFeatures: '기본 학습 도구, 제한된 기능',
        paidFeatures: '고급 학습 도구, 오프라인 모드',
        pricing: '무료/유료',
        url: 'https://quizlet.com' 
      },
    ]
  },
  {
    key: 'research',
    title: '연구 및 학술',
    icon: <span className="text-2xl">🔬</span>,
    color: 'from-amber-400 via-orange-400 to-red-400',
    tools: [
      { 
        name: 'Elicit', 
        icon: '📊', 
        description: '논문 분석, 연구 데이터 추출',
        freeFeatures: '제한된 분석, 기본 기능',
        paidFeatures: '무제한 분석, 고급 기능, API',
        pricing: '무료/유료',
        url: 'https://elicit.org' 
      },
      { 
        name: 'Consensus', 
        icon: '🤝', 
        description: '연구 합의 도구, 데이터 분석',
        freeFeatures: '제한된 분석, 기본 기능',
        paidFeatures: '무제한 분석, 고급 기능, API',
        pricing: '무료/유료',
        url: 'https://consensus.app' 
      },
      { 
        name: 'SciSpace', 
        icon: '🔍', 
        description: '논문 검색, AI 분석',
        freeFeatures: '제한된 검색, 기본 분석',
        paidFeatures: '무제한 검색, 고급 분석, API',
        pricing: '무료/유료',
        url: 'https://typeset.io' 
      },
      { 
        name: 'Research Rabbit', 
        icon: '🐰', 
        description: '논문 추천, 연구 네트워크',
        freeFeatures: '제한된 추천, 기본 기능',
        paidFeatures: '무제한 추천, 고급 기능, API',
        pricing: '무료/유료',
        url: 'https://www.researchrabbit.ai' 
      },
    ]
  },
  {
    key: '3d',
    title: '3D 모델링 및 디자인',
    icon: <span className="text-2xl">🧊</span>,
    color: 'from-blue-400 via-indigo-400 to-purple-400',
    tools: [
      { name: 'Spline AI', icon: '🌀', pricing: '무료/유료', description: '3D 디자인, AI 기반 오브젝트 생성', freeFeatures: '기본 3D 디자인, 제한된 AI 생성', paidFeatures: '고급 AI 생성, 팀 기능, API, 월 $15~', url: 'https://spline.design/ai' },
      { name: 'Blockade Labs (Skybox AI)', icon: '🌌', pricing: '무료/유료', description: '360도 배경 생성, 무료 사용 제한', freeFeatures: '월 5개 생성, 기본 해상도', paidFeatures: '월 100~500개 생성, 고해상도, API, 월 $10~', url: 'https://skybox.blockadelabs.com' },
      { name: 'Bubble', icon: '💻', pricing: '무료/유료', description: '웹/앱 디자인, 노코드', freeFeatures: '기본 디자인 기능, 제한된 기능', paidFeatures: '고급 기능, 팀 기능, API, 월 $25~', url: 'https://bubble.io' },
      { name: 'Luma AI', icon: '✨', pricing: '무료/유료', description: 'AI 기반 3D 모델 생성, 텍스트/이미지 프롬프트', freeFeatures: '월 10개 생성, 기본 해상도', paidFeatures: '월 100~500개 생성, 고해상도, API, 월 $10~', url: 'https://lumalabs.ai' },
      { name: 'Leonardo AI', icon: '🎨', pricing: '무료/유료', description: 'AI 기반 3D 에셋 생성, 텍스처 생성', freeFeatures: '월 150 크레딧, 기본 기능', paidFeatures: '월 1,500~5,000 크레딧, 고급 기능, API, 월 $10~', url: 'https://leonardo.ai' },
    ]
  },
  {
    key: 'music',
    title: '음악 생성',
    icon: <span className="text-2xl">🎵</span>,
    color: 'from-pink-400 via-purple-400 to-indigo-400',
    tools: [
      { name: 'Suno', icon: '🎶', pricing: '무료/유료', description: 'AI 작곡, 음악 생성.', freeFeatures: '하루 최대 10곡(50크레딧), 비상업적 사용', paidFeatures: '월 500곡(2,500크레딧), 상업적 사용, 우선 처리, 월 $10~', url: 'https://suno.ai' },
      { name: 'Udio', icon: '🎼', pricing: '무료/유료', description: 'AI 작곡, 음악 생성.', freeFeatures: '하루 10곡 무료, 비상업적 사용', paidFeatures: '월 1,200곡, 상업적 사용, 빠른 처리, 월 $10~', url: 'https://www.udio.com' },
      { name: 'AIVA', icon: '🎻', pricing: '무료/유료', description: '오리지널 음악 작곡, 무료 사용 제한.', freeFeatures: '월 3곡, 3분 제한, 비상업적, AIVA 표시 필요', paidFeatures: '월 15~300곡, 상업적 사용, 고음질 다운로드, 저작권 소유, 월 €11~', url: 'https://www.aiva.ai' },
      { name: 'Soundraw', icon: '🎧', pricing: '무료/유료', description: '음악 생성, 무료 체험 후 유료.', freeFeatures: '무제한 생성, 월 1곡 다운로드, 개인/비상업적 사용', paidFeatures: '월 100~400곡 다운로드, 상업적 사용, 스템 다운로드, 월 $5~', url: 'https://soundraw.io' },
    ]
  },
  {
    key: 'codeopt',
    title: '코드 개발 및 최적화',
    icon: <span className="text-2xl">🧑‍💻</span>,
    color: 'from-gray-400 via-gray-500 to-gray-700',
    tools: [
      { name: 'Tabnine', icon: '🤖', pricing: '무료/유료', description: 'AI 코드 자동 완성, 다양한 언어 지원', freeFeatures: '기본 코드 완성, 제한된 기능', paidFeatures: '고급 코드 완성, 팀 기능, API, 월 $12~', url: 'https://www.tabnine.com' },
      { name: 'Replit (Ghostwriter)', icon: '🌐', pricing: '무료/유료', description: '웹 기반 IDE, AI 코드 생성 및 자동화', freeFeatures: '기본 IDE 기능, 제한된 AI 기능', paidFeatures: '고급 AI 기능, 팀 기능, API, 월 $7~', url: 'https://replit.com' },
      { name: 'Cursor', icon: '⌨️', pricing: '무료/유료', description: 'AI 기반 코드 에디터, 자동 완성, 디버깅', freeFeatures: '기본 코드 완성, 제한된 AI 기능', paidFeatures: '고급 AI 기능, 무제한 사용, 팀 기능, 월 $20~', url: 'https://www.cursor.so' },
      { name: 'Windsurf', icon: '🏄', pricing: '무료/유료', description: 'AI 기반 코드 리뷰, 품질 개선, 자동화', freeFeatures: '기본 코드 리뷰, 제한된 기능', paidFeatures: '고급 리뷰, 팀 기능, API, 월 $15~', url: 'https://windsurf.ai' },
    ]
  },
  {
    key: 'assistant',
    title: '개인 비서 및 생산성',
    icon: <span className="text-2xl">🤖</span>,
    color: 'from-emerald-400 via-teal-400 to-cyan-400',
    tools: [
      { name: 'ChatGPT', icon: '🤖', pricing: '무료/유료', description: '정보 검색, 글쓰기, 아이디어 생성.', freeFeatures: 'GPT-3.5 기반, 기본 기능, 피크 시간 제한', paidFeatures: 'GPT-4/4o, 더 빠른 응답, DALL·E 3 이미지 생성, 고급 기능, 월 $20', url: 'https://chat.openai.com' },
      { name: 'Google Gemini (formerly Bard)', icon: '🔎', pricing: '무료/유료', description: '정보 검색, 글쓰기, 다양한 언어.', freeFeatures: '기본 모델, 제한된 기능', paidFeatures: '고급 모델, 더 빠른 응답, 우선 처리, 월 $20', url: 'https://gemini.google.com' },
      { name: 'Claude', icon: '🧑‍💼', pricing: '무료/유료', description: '대화형 AI, 문서 요약, 친근한 응답.', freeFeatures: '기본 대화, 문서 분석, 요약 기능', paidFeatures: '고급 기능, 더 긴 컨텍스트, 우선 응답, 월 $20', url: 'https://claude.ai' },
      { name: 'Grok', icon: '🐦', pricing: '무료/유료', description: '실시간 정보, 소셜 연동.', freeFeatures: '기본 기능, 제한된 응답', paidFeatures: '고급 기능, 우선 처리, API 접근, 월 $16', url: 'https://grok.x.ai' },
    ]
  },
  {
    key: 'schedule',
    title: '스케줄링 및 일정 관리',
    icon: <span className="text-2xl">⏰</span>,
    color: 'from-yellow-400 via-orange-400 to-pink-400',
    tools: [
      { name: 'Calendly', icon: '📅', pricing: '무료/유료', description: '일정 예약, 자동화된 미팅 스케줄링', freeFeatures: '1개 이벤트 유형, 1개 캘린더 연결, 무제한 미팅', paidFeatures: '무제한 이벤트, 다중 캘린더, 자동 알림, 팀 기능, 월 $10~', url: 'https://calendly.com' },
      { name: 'Reclaim', icon: '🔄', pricing: '무료/유료', description: 'AI 기반 일정 관리, 자동화.', freeFeatures: '기본 일정 관리, 제한된 자동화', paidFeatures: '고급 자동화, 팀 기능, API, 월 $8~', url: 'https://reclaim.ai' },
      { name: 'Clockwise', icon: '🕒', pricing: '무료/유료', description: 'AI 기반 일정 관리, 자동화.', freeFeatures: '기본 일정 관리, 제한된 기능', paidFeatures: '고급 자동화, 팀 기능, API, 월 $6.75~', url: 'https://www.getclockwise.com' },
    ]
  },
  {
    key: 'resume',
    title: '이력서 및 채용',
    icon: <span className="text-2xl">📄</span>,
    color: 'from-blue-400 via-sky-400 to-indigo-400',
    tools: [
      { name: 'Teal', icon: '🦚', pricing: '무료/유료', description: 'AI 이력서 생성, 맞춤 분석, 취업 지원', freeFeatures: '기본 이력서 생성, 1회 내보내기, 기본 분석', paidFeatures: '무제한 이력서, 고급 분석, AI 커버레터, 월 $29~', url: 'https://www.tealhq.com' },
      { name: 'Kickresume', icon: '📄', pricing: '무료/유료', description: '이력서 작성, 채용 지원 관리.', freeFeatures: '기본 템플릿, 제한된 내보내기', paidFeatures: '프리미엄 템플릿, 무제한 내보내기, AI 기능, 월 $15~', url: 'https://www.kickresume.com' },
      { name: 'Skillroads', icon: '🛣️', pricing: '무료/유료', description: '이력서, 채용 공고, 지원서 최적화.', freeFeatures: '기본 이력서 작성, 제한된 기능', paidFeatures: '고급 기능, AI 최적화, 팀 기능, 월 $20~', url: 'https://skillroads.com' },
      { name: 'Textio', icon: '🔤', pricing: '무료/유료', description: '이력서, 채용 공고, 지원서 최적화.', freeFeatures: '기본 분석, 제한된 기능', paidFeatures: '고급 분석, AI 최적화, 팀 기능, 월 $25~', url: 'https://textio.com' },
    ]
  },
  {
    key: 'email',
    title: '이메일 및 커뮤니케이션',
    icon: <span className="text-2xl">✉️</span>,
    color: 'from-pink-400 via-red-400 to-yellow-400',
    tools: [
      { name: 'Hubspot Email Writer', icon: '📧', pricing: '무료/유료', description: '이메일 작성, 분류, 자동화.', freeFeatures: '기본 이메일 작성, 제한된 기능', paidFeatures: '고급 기능, AI 최적화, 팀 기능, 월 $45~', url: 'https://www.hubspot.com/products/marketing/email' },
      { name: 'SaneBox', icon: '📥', pricing: '무료/유료', description: '이메일 작성, 분류, 자동화.', freeFeatures: '기본 분류, 제한된 기능', paidFeatures: '고급 분류, 자동화, 팀 기능, 월 $7~', url: 'https://www.sanebox.com' },
      { name: 'Shortwave', icon: '📨', pricing: '무료/유료', description: '이메일 작성, 분류, 자동화.', freeFeatures: '기본 기능, 제한된 저장공간', paidFeatures: '고급 기능, 무제한 저장공간, 팀 기능, 월 $9~', url: 'https://www.shortwave.com' },
    ]
  },
  {
    key: 'presentation',
    title: '프레젠테이션',
    icon: <span className="text-2xl">📊</span>,
    color: 'from-violet-400 via-fuchsia-400 to-pink-400',
    tools: [
      { name: 'Gamma', icon: '📈', pricing: '무료/유료', description: 'AI 기반 프레젠테이션 생성.', freeFeatures: '기본 템플릿, 제한된 기능', paidFeatures: '고급 템플릿, AI 기능, 팀 기능, 월 $10~', url: 'https://gamma.app' },
      { name: 'Presentations.ai', icon: '🖥️', pricing: '무료/유료', description: 'AI 기반 프레젠테이션 생성.', freeFeatures: '기본 기능, 제한된 생성', paidFeatures: '고급 기능, 무제한 생성, 팀 기능, 월 $15~', url: 'https://www.presentations.ai' },
    ]
  },
  {
    key: 'law',
    title: '법률 및 전문 분야',
    icon: <span className="text-2xl">⚖️</span>,
    color: 'from-gray-700 via-gray-500 to-gray-300',
    tools: [
      { name: 'Harvey', icon: '⚖️', pricing: '유료', description: '법률 문서 생성, 분석.', freeFeatures: '', paidFeatures: '', url: 'https://www.harvey.ai' },
    ]
  },
];

function PricingBadge({ pricing }: { pricing: string }) {
  const color = pricing.includes('무료') && pricing.includes('유료')
    ? 'bg-yellow-100 text-yellow-700'
    : pricing.includes('유료')
    ? 'bg-red-100 text-red-700'
    : 'bg-green-100 text-green-700';
  return (
    <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${color}`}>
      {pricing}
    </span>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.05, type: 'spring', stiffness: 100, damping: 20 }
  })
};

const toolVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, type: 'spring', stiffness: 100, damping: 20 }
  })
};

const shortCategoryKeys = [
  'all', 'writing', 'image', 'video', 'data', 'meeting', 'coding', 'voice', 'customer', 'marketing', 'education', 'research', '3d', 'music', 'codeopt', 'assistant', 'schedule', 'resume', 'email', 'presentation', 'law'
];

export default function AIToolsPage() {
  const { t } = useTranslation();
  const [expandedTools, setExpandedTools] = useState<{ [key: string]: boolean }>({});
  const [selectedCategory, setSelectedCategory] = useState('all');

  const toggleExpand = (toolName: string) => {
    setExpandedTools(prev => ({
      ...prev,
      [toolName]: !prev[toolName]
    }));
  };

  // Animated orb configs (from match/page.tsx)
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
      ease: "easeInOut"
    }
  };
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
      ease: "easeInOut"
    }
  };

  return (
    <main className="min-h-screen pt-[112px] sm:pt-16 bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section Background (from match/page.tsx) */}
      <section className="relative py-8 md:py-12 lg:py-16">
        {/* Animated Gradient Orbs */}
        <motion.div className="absolute top-32 left-32 w-64 h-64 bg-gradient-to-r from-violet-200/20 to-purple-200/20 rounded-full blur-3xl" {...orbAnimation} />
        <motion.div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl" {...orb2Animation} />
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
        {/* Radial Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.05),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.05),transparent_50%)]" />
        {/* Main Content */}
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
              <span className="bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700 border-0 px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 text-base sm:text-lg font-semibold rounded inline-flex items-center justify-center shadow">
                🧠 {t('aiTools.header')}
              </span>
            </motion.div>
          </motion.div>

          {/* Category Filter Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {shortCategoryKeys.map(key => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 font-medium text-sm sm:text-base ${
                    selectedCategory === key
                      ? "bg-violet-600 text-white shadow-lg"
                      : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-violet-50"
                  }`}
                >
                  <span>{t(`aiTools.category.${key}`)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Tools Category/List Section (filtered) */}
          {selectedCategory !== 'all' ? (
            <>
              {/* Desktop (md+): single category header, then grid of tools */}
              <section className="hidden md:block">
                {(() => {
                  const cat = categories.find(c => c.key === selectedCategory);
                  if (!cat) return null;
                  return (
                    <>
                      <div className={`flex items-center gap-2 px-6 py-5 mb-6 bg-gradient-to-r ${cat.color} animate-gradient-x rounded-2xl`}>
                        <span className="drop-shadow-lg scale-110">{cat.icon}</span>
                        <h2 className="text-lg md:text-xl font-bold text-white tracking-tight drop-shadow-lg">{cat.title}</h2>
                      </div>
                      <div className="grid grid-cols-2 gap-10">
                        {cat.tools.map((tool, idx) => (
                          <motion.div
                            key={tool.name}
                            className="rounded-2xl shadow-2xl border border-gray-100 bg-white flex flex-col overflow-hidden hover:scale-[1.025] hover:shadow-3xl transition-all duration-300 group"
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1, margin: '100px' }}
                            custom={idx}
                            whileHover={{
                              scale: 1.02,
                              transition: { type: 'spring', stiffness: 300, damping: 20 }
                            }}
                          >
                            <div className="flex-1 flex flex-col justify-between p-6">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-xl mt-1 flex-shrink-0">{tool.icon}</span>
                                <span className="font-semibold text-gray-900 truncate block max-w-[180px] md:max-w-[240px] group-hover/item:text-indigo-600 transition-colors duration-300">{tool.name}</span>
                                <PricingBadge pricing={tool.pricing} />
                              </div>
                              <div className="text-gray-700 text-sm space-y-1 mb-2">
                                <div className={`leading-relaxed`}>
                                  <p>{tool.description}</p>
                                  {tool.freeFeatures && tool.freeFeatures.trim() !== '' && tool.freeFeatures !== '-' && (
                                    <p className="text-gray-600 group-hover/item:text-gray-800 transition-colors duration-300">{t('aiTools.label.free')}: {tool.freeFeatures}</p>
                                  )}
                                  {tool.paidFeatures && tool.paidFeatures.trim() !== '' && tool.paidFeatures !== '-' && (
                                    <p className="text-gray-600 group-hover/item:text-gray-800 transition-colors duration-300">{t('aiTools.label.paid')}: {tool.paidFeatures}</p>
                                  )}
                                </div>
                              </div>
                              <a
                                href={tool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-block px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 shadow hover:from-indigo-200 hover:to-indigo-300 hover:text-indigo-900 transition-all duration-300 self-end whitespace-nowrap"
                              >
                                {t('aiTools.button.visit')}
                              </a>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </section>
              {/* Mobile: show as before (single card) */}
              <section className="md:hidden grid grid-cols-1 gap-10">
                {categories.filter(c => c.key === selectedCategory).map((cat, catIdx) => (
                  <motion.div
                    key={cat.key}
                    className="rounded-2xl shadow-2xl border border-gray-100 bg-white flex flex-col overflow-hidden hover:scale-[1.025] hover:shadow-3xl transition-all duration-300 group"
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1, margin: '100px' }}
                    custom={catIdx}
                    whileHover={{
                      scale: 1.02,
                      transition: { type: 'spring', stiffness: 300, damping: 20 }
                    }}
                  >
                    <motion.div
                      className={`flex items-center gap-2 px-6 py-5 bg-gradient-to-r ${cat.color} animate-gradient-x`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: catIdx * 0.05 }}
                      whileHover={{
                        scale: 1.02,
                        transition: { type: 'spring', stiffness: 300, damping: 20 }
                      }}
                    >
                      <motion.span
                        className="drop-shadow-lg scale-110"
                        whileHover={{
                          rotate: [0, -10, 10, -10, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        {cat.icon}
                      </motion.span>
                      <h2 className="text-lg md:text-xl font-bold text-white tracking-tight drop-shadow-lg">{cat.title}</h2>
                    </motion.div>
                    <ul className="flex-1 divide-y divide-gray-100">
                      {cat.tools.map((tool, idx) => (
                        <motion.li
                          key={tool.name}
                          className="flex flex-col sm:flex-row items-start gap-3 px-6 py-5 bg-white/80 hover:bg-gray-50/90 transition-all duration-300 rounded-xl group/item"
                          variants={toolVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.1, margin: '50px' }}
                          custom={idx}
                          whileHover={{
                            x: 5,
                            transition: { type: 'spring', stiffness: 300, damping: 20 }
                          }}
                        >
                          <div className="flex items-start gap-3 w-full sm:w-auto sm:flex-1">
                            <motion.span
                              className="text-xl mt-1 flex-shrink-0"
                              whileHover={{
                                scale: 1.2,
                                transition: { type: 'spring', stiffness: 300, damping: 20 }
                              }}
                            >
                              {tool.icon}
                            </motion.span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-gray-900 truncate block max-w-[180px] md:max-w-[240px] group-hover/item:text-indigo-600 transition-colors duration-300">{tool.name}</span>
                                <PricingBadge pricing={tool.pricing} />
                              </div>
                              <div className="text-gray-700 text-sm space-y-1">
                                <div className={`leading-relaxed ${!expandedTools[tool.name] ? 'line-clamp-3 sm:line-clamp-none' : ''}`}> 
                                  <p>{tool.description}</p>
                                  {tool.freeFeatures && tool.freeFeatures.trim() !== '' && tool.freeFeatures !== '-' && (
                                    <p className="text-gray-600 group-hover/item:text-gray-800 transition-colors duration-300">{t('aiTools.label.free')}: {tool.freeFeatures}</p>
                                  )}
                                  {tool.paidFeatures && tool.paidFeatures.trim() !== '' && tool.paidFeatures !== '-' && (
                                    <p className="text-gray-600 group-hover/item:text-gray-800 transition-colors duration-300">{t('aiTools.label.paid')}: {tool.paidFeatures}</p>
                                  )}
                                </div>
                                {!expandedTools[tool.name] && (
                                  <button
                                    onClick={() => toggleExpand(tool.name)}
                                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors duration-300 sm:hidden"
                                  >
                                    {t('aiTools.button.more')}
                                  </button>
                                )}
                                {expandedTools[tool.name] && (
                                  <button
                                    onClick={() => toggleExpand(tool.name)}
                                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors duration-300 sm:hidden"
                                  >
                                    {t('aiTools.button.less')}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          <motion.a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sm:ml-auto mt-3 sm:mt-1 inline-block px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 shadow hover:from-indigo-200 hover:to-indigo-300 hover:text-indigo-900 transition-all duration-300 self-end sm:self-center whitespace-nowrap"
                            whileHover={{
                              scale: 1.05,
                              transition: { type: 'spring', stiffness: 300, damping: 20 }
                            }}
                          >
                            {t('aiTools.button.visit')}
                          </motion.a>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </section>
            </>
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {categories.map((cat, catIdx) => (
                <motion.div
                  key={cat.key}
                  className="rounded-2xl shadow-2xl border border-gray-100 bg-white flex flex-col overflow-hidden hover:scale-[1.025] hover:shadow-3xl transition-all duration-300 group"
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1, margin: '100px' }}
                  custom={catIdx}
                  whileHover={{
                    scale: 1.02,
                    transition: { type: 'spring', stiffness: 300, damping: 20 }
                  }}
                >
                  <motion.div
                    className={`flex items-center gap-2 px-6 py-5 bg-gradient-to-r ${cat.color} animate-gradient-x`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: catIdx * 0.05 }}
                    whileHover={{
                      scale: 1.02,
                      transition: { type: 'spring', stiffness: 300, damping: 20 }
                    }}
                  >
                    <motion.span
                      className="drop-shadow-lg scale-110"
                      whileHover={{
                        rotate: [0, -10, 10, -10, 0],
                        transition: { duration: 0.5 }
                      }}
                    >
                      {cat.icon}
                    </motion.span>
                    <h2 className="text-lg md:text-xl font-bold text-white tracking-tight drop-shadow-lg">{cat.title}</h2>
                  </motion.div>
                  <ul className="flex-1 divide-y divide-gray-100">
                    {cat.tools.map((tool, idx) => (
                      <motion.li
                        key={tool.name}
                        className="flex flex-col sm:flex-row items-start gap-3 px-6 py-5 bg-white/80 hover:bg-gray-50/90 transition-all duration-300 rounded-xl group/item"
                        variants={toolVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1, margin: '50px' }}
                        custom={idx}
                        whileHover={{
                          x: 5,
                          transition: { type: 'spring', stiffness: 300, damping: 20 }
                        }}
                      >
                        <div className="flex items-start gap-3 w-full sm:w-auto sm:flex-1">
                          <motion.span
                            className="text-xl mt-1 flex-shrink-0"
                            whileHover={{
                              scale: 1.2,
                              transition: { type: 'spring', stiffness: 300, damping: 20 }
                            }}
                          >
                            {tool.icon}
                          </motion.span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-gray-900 truncate block max-w-[180px] md:max-w-[240px] group-hover/item:text-indigo-600 transition-colors duration-300">{tool.name}</span>
                              <PricingBadge pricing={tool.pricing} />
                            </div>
                            <div className="text-gray-700 text-sm space-y-1">
                              <div className={`leading-relaxed ${!expandedTools[tool.name] ? 'line-clamp-3 sm:line-clamp-none' : ''}`}> 
                                <p>{tool.description}</p>
                                {tool.freeFeatures && tool.freeFeatures.trim() !== '' && tool.freeFeatures !== '-' && (
                                  <p className="text-gray-600 group-hover/item:text-gray-800 transition-colors duration-300">{t('aiTools.label.free')}: {tool.freeFeatures}</p>
                                )}
                                {tool.paidFeatures && tool.paidFeatures.trim() !== '' && tool.paidFeatures !== '-' && (
                                  <p className="text-gray-600 group-hover/item:text-gray-800 transition-colors duration-300">{t('aiTools.label.paid')}: {tool.paidFeatures}</p>
                                )}
                              </div>
                              {!expandedTools[tool.name] && (
                                <button
                                  onClick={() => toggleExpand(tool.name)}
                                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors duration-300 sm:hidden"
                                >
                                  {t('aiTools.button.more')}
                                </button>
                              )}
                              {expandedTools[tool.name] && (
                                <button
                                  onClick={() => toggleExpand(tool.name)}
                                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors duration-300 sm:hidden"
                                >
                                  {t('aiTools.button.less')}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <motion.a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sm:ml-auto mt-3 sm:mt-1 inline-block px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 shadow hover:from-indigo-200 hover:to-indigo-300 hover:text-indigo-900 transition-all duration-300 self-end sm:self-center whitespace-nowrap"
                          whileHover={{
                            scale: 1.05,
                            transition: { type: 'spring', stiffness: 300, damping: 20 }
                          }}
                        >
                          {t('aiTools.button.visit')}
                        </motion.a>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </section>
          )}
        </div>
      </section>
    </main>
  );
} 