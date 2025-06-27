"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "@/app/i18n/useTranslation"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { ArrowLeft, Plus, X, Grid, Image as ImageIcon, FileText, Video, Globe, Users, Mic, Box, Zap, Sparkles, Github, Linkedin } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useUserProfile } from "@/app/lib/useUserProfile"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select"

// [전문가 등록 페이지]
// - AI 서비스 등록 후 전문가로 활동하기 위한 추가 정보 입력
// - 강의/의뢰 수신을 위한 프로필 및 전문 분야 설정
export default function ExpertRegisterPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { user, loading: userLoading } = useUserProfile()

  // Form state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 전문가 신청 폼 state
  const [job, setJob] = useState("") // 직무
  const [category, setCategory] = useState("") // 전문분야
  const [bio, setBio] = useState("") // 한줄 소개
  const [aiTools, setAiTools] = useState<string[]>([])
  const [aiToolsInput, setAiToolsInput] = useState("")

  // URL 동적 필드 [{type, url}]로 변경
  type UrlType = 'github' | 'linkedin' | 'portfolio' | 'etc'
  const urlTypeOptions = [
    { value: 'github', label: 'GitHub', icon: <Github className="w-4 h-4" /> },
    { value: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" /> },
    { value: 'portfolio', label: '포트폴리오', icon: <Globe className="w-4 h-4" /> },
    { value: 'etc', label: '기타', icon: <Sparkles className="w-4 h-4" /> },
  ]
  const [urls, setUrls] = useState<{type: UrlType, url: string}[]>([{type: 'github', url: ''}])

  // 카테고리 옵션 (서비스와 동일)
  const categories = [
    { id: "all", name: t("categoryAll"), icon: <Grid className="w-4 h-4" /> },
    { id: "image", name: t("categoryImage"), icon: <ImageIcon className="w-4 h-4" /> },
    { id: "text", name: t("categoryText"), icon: <FileText className="w-4 h-4" /> },
    { id: "video", name: t("categoryVideo"), icon: <Video className="w-4 h-4" /> },
    { id: "webapp", name: t("categoryWebApp"), icon: <Globe className="w-4 h-4" /> },
    { id: "social", name: t("categorySocial"), icon: <Users className="w-4 h-4" /> },
    { id: "voice", name: t("categoryVoice"), icon: <Mic className="w-4 h-4" /> },
    { id: "3d", name: t("category3D"), icon: <Box className="w-4 h-4" /> },
    { id: "automation", name: t("categoryAutomation"), icon: <Zap className="w-4 h-4" /> },
    { id: "etc", name: t("categoryEtc"), icon: <Sparkles className="w-4 h-4" /> },
  ]

  // AI 도구 추가/삭제
  const handleAddAiTool = () => {
    const value = aiToolsInput.trim()
    if (value && aiTools.length < 5 && !aiTools.includes(value)) {
      setAiTools([...aiTools, value])
      setAiToolsInput("")
    }
  }
  const handleRemoveAiTool = (tool: string) => {
    setAiTools(aiTools.filter(t => t !== tool))
  }

  // URL 동적 필드 추가/삭제/변경
  const handleAddUrl = () => {
    if (urls.length < 5) setUrls([...urls, {type: 'github', url: ''}])
  }
  const handleRemoveUrl = (idx: number) => {
    if (urls.length > 1) setUrls(urls.filter((_, i) => i !== idx))
  }
  const handleUrlChange = (idx: number, value: string) => {
    setUrls(urls.map((u, i) => i === idx ? {...u, url: value} : u))
  }
  const handleUrlTypeChange = (idx: number, type: UrlType) => {
    setUrls(urls.map((u, i) => i === idx ? {...u, type} : u))
  }

  // [전문가 등록 핸들러]
  const handleExpertRegister = async () => {
    setError(null)
    if (userLoading) return
    if (!user?.id) { setError('로그인이 필요합니다'); return }
    if (!job.trim()) { setError('직무를 입력해 주세요'); return }
    if (!category) { setError('전문분야를 선택해 주세요'); return }
    if (!bio.trim()) { setError('한줄 소개를 입력해 주세요'); return }
    setLoading(true)
    try {
      // [MCP] 전문가 등록: 입력값을 직접 supabase로 전송 (성능 비교용)
      const urlMap = urls.reduce((acc, cur) => {
        acc[cur.type] = cur.url;
        return acc;
      }, {} as Record<string, string>);
      // [직접 호출] supabase insert
      const { data, error: insertError } = await supabase
        .from('expert_applications')
        .insert({
          user_id: user.id,
          name: user.firstName || '',
          job_title: job,
          ai_category: category,
          bio,
          ai_tools: aiTools,
          portfolio_url: urlMap['portfolio'] || '',
          github_url: urlMap['github'] || '',
          linkedin_url: urlMap['linkedin'] || '',
          etc_url: urlMap['etc'] || '',
          status: 'pending',
        })
        .select()
        .single();
      if (insertError) throw new Error(insertError.message || '전문가 등록에 실패했습니다');
      // 3. 성공 시 안내 및 마이페이지 이동
      alert('전문가 등록 신청이 완료되었습니다! 검토 후 승인 처리됩니다.');
      router.push('/mypage');
    } catch (e: any) {
      setError(e.message || '전문가 등록에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-[180px] sm:pt-32 py-12">
      {/* [MCP] 전문가 등록 폼 - 상단 타이틀 */}
      <div className="w-full max-w-2xl mx-auto flex items-center mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="flex-1 text-center text-2xl font-bold text-gray-900">{t('expertRegisterTitle')}</h1>
        <div className="w-9"></div>
      </div>

      <form className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-8 border border-gray-100">
        {/* [MCP] 이름/닉네임 라벨 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('expertRegisterNameLabel')} *</label>
          <Input value={user?.firstName || ""} disabled placeholder="구글/클럭 연동" />
        </div>
        {/* [MCP] 직무 라벨/placeholder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('expertRegisterJobLabel')} *</label>
          <Input value={job} onChange={e => setJob(e.target.value)} placeholder={t('expertRegisterJobPlaceholder')} maxLength={40} required />
        </div>
        {/* [MCP] AI 전문분야 라벨/placeholder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('expertRegisterCategoryLabel')} *</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder={t('expertRegisterCategoryPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {categories.filter(opt => opt.id !== "all").map(opt => (
                <SelectItem key={opt.id} value={opt.id}>
                  <span className="flex items-center gap-2">{opt.icon}{opt.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* [MCP] 한줄 소개 라벨/placeholder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('expertRegisterBioLabel')} *</label>
          <Input value={bio} onChange={e => setBio(e.target.value)} placeholder={t('expertRegisterBioPlaceholder')} maxLength={40} required />
          <div className="text-xs text-gray-400 text-right mt-1">{bio.length}/40</div>
        </div>
        {/* [MCP] AI 도구/모델 라벨/placeholder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('expertRegisterAiToolsLabel')}</label>
          <div className="flex gap-2 mb-2">
            <Input value={aiToolsInput} onChange={e => setAiToolsInput(e.target.value)} placeholder={t('expertRegisterAiToolsPlaceholder')} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddAiTool(); } }} maxLength={40} className="flex-1" />
            <Button type="button" onClick={handleAddAiTool} disabled={!aiToolsInput || aiTools.length >= 5} variant="secondary"><Plus className="w-4 h-4" /></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {aiTools.map(tool => (
              <Badge key={tool} className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {tool}
                <button type="button" onClick={() => handleRemoveAiTool(tool)} className="ml-1 text-blue-400 hover:text-blue-700"><X className="w-3 h-3" /></button>
              </Badge>
            ))}
          </div>
        </div>
        {/* [MCP] 외부 프로필/포트폴리오 라벨 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('expertRegisterUrlsLabel')}</label>
          {urls.map((item, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <Select value={item.type} onValueChange={v => handleUrlTypeChange(idx, v as UrlType)}>
                <SelectTrigger className="w-32">
                  <SelectValue>
                    <span className="flex items-center gap-2">
                      {urlTypeOptions.find(opt => opt.value === item.type)?.icon}
                      {urlTypeOptions.find(opt => opt.value === item.type)?.label}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {urlTypeOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value} disabled={urls.some(u => u.type === opt.value && u !== item)}>
                      <span className="flex items-center gap-2">{opt.icon}{opt.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* [MCP] URL 입력 placeholder 다국어 처리 */}
              <Input value={item.url} onChange={e => handleUrlChange(idx, e.target.value)} placeholder={t('expertRegisterUrlPlaceholder')} type="url" maxLength={200} className="flex-1" />
              {urls.length > 1 && <Button type="button" onClick={() => handleRemoveUrl(idx)} variant="secondary">{t('expertRegisterRemoveButton')}<X className="w-4 h-4 ml-1" /></Button>}
            </div>
          ))}
          {/* +버튼: 추가 가능한 유형이 남아있을 때만 활성화 */}
          <Button type="button" onClick={() => {
            const nextType = urlTypeOptions.find(opt => !urls.some(u => u.type === opt.value))?.value as UrlType
            if (nextType) setUrls([...urls, {type: nextType, url: ''}])
          }} variant="secondary"><Plus className="w-4 h-4 mr-1" />{t('expertRegisterAddButton')}</Button>
        </div>
        {/* [MCP] 등록 버튼 및 상태 */}
        <div className="flex justify-end">
          <Button 
            type="button" 
            onClick={handleExpertRegister} 
            disabled={loading || userLoading} 
            className="bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold px-8 py-3 rounded-xl"
          >
            {loading ? t('expertRegisterSubmitting') : t('expertRegisterButton')}
          </Button>
        </div>
        {/* [MCP] 에러 메시지 */}
        {error && <div className="text-red-500 text-sm text-right mt-2">{error}</div>}
      </form>
    </div>
  )
} 