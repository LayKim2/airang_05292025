"use client";
import { useState, useEffect } from "react"
import { useTranslation } from "@/app/i18n/useTranslation"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { ArrowLeft, Plus, X } from "lucide-react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useUserProfile } from "@/app/lib/useUserProfile"

export default function ServiceRegisterForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const { user, loading: userLoading } = useUserProfile()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('id')

  // Category options
  const categories = [
    { id: "image", name: t("categoryImage") },
    { id: "text", name: t("categoryText") },
    { id: "video", name: t("categoryVideo") },
    { id: "webapp", name: t("categoryWebApp") },
    { id: "social", name: t("categorySocial") },
    { id: "voice", name: t("categoryVoice") },
    { id: "3d", name: t("category3D") },
    { id: "automation", name: t("categoryAutomation") },
    { id: "etc", name: t("categoryEtc") },
  ]

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [demoUrl, setDemoUrl] = useState("")
  const [aiTools, setAiTools] = useState<string[]>([])
  const [aiToolsInput, setAiToolsInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fetching, setFetching] = useState(false)

  // [MCP] 수정 모드: 서비스 데이터 fetch 및 form state set
  useEffect(() => {
    if (!serviceId) return;
    const fetchServiceData = async () => {
      setFetching(true);
      try {
        const { data, error } = await supabase.from('services').select('*').eq('id', serviceId).single();
        if (error || !data) {
          setError('서비스 정보를 불러오지 못했습니다.');
          return;
        }
        setTitle(data.title || '');
        setDescription(data.description || '');
        setCategory(data.category || '');
        setDemoUrl(data.demo_url || '');
        setAiTools(Array.isArray(data.ai_tools) ? data.ai_tools : []);
        setImagePreview(data.image_url || null);
      } catch (err) {
        setError('서비스 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setFetching(false);
      }
    };
    fetchServiceData();
  }, [serviceId]);

  // Image upload preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // AI tool addition/removal
  const handleAddAiTool = () => {
    if (aiToolsInput && aiTools.length < 10 && !aiTools.includes(aiToolsInput)) {
      setAiTools([...aiTools, aiToolsInput])
      setAiToolsInput("")
    }
  }
  const handleRemoveAiTool = (tool: string) => {
    setAiTools(aiTools.filter(t => t !== tool))
  }

  // Representative image upload function (Supabase Storage, folder structure: ai-services/{user.id}/)
  const uploadImage = async (file: File) => {
    if (!user?.id) throw new Error(t('loginRequired'))
    const fileExt = file.name.split('.').pop()
    const filePath = `ai-services/${user.id}/${Date.now()}.${fileExt}`
    const { data, error } = await supabase.storage.from('service-images').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })
    if (error) throw new Error(t('imageUploadFailed: ') + error.message)
    // publicUrl creation
    const { data: publicUrlData } = supabase.storage.from('service-images').getPublicUrl(filePath)
    return publicUrlData?.publicUrl || ''
  }

  // [MCP] 등록/수정 핸들러
  const handleRegister = async () => {
    setError(null)
    if (userLoading) return
    if (!user?.id) { setError(t('loginRequired')); return }
    if (!title || !description || !category) { setError(t('requiredFieldsError')); return }
    if (aiTools.length === 0) { setError('AI Tools는 최소 1개 입력해야 합니다.'); return }
    if (aiTools.length > 5) { setError('AI Tools는 최대 5개까지만 입력할 수 있습니다.'); return }
    setLoading(true)
    try {
      let imageUrl = imagePreview || ''
      if (image) {
        imageUrl = await uploadImage(image)
      }
      if (serviceId) {
        // [MCP] 수정 모드: update
        const { error: updateError } = await supabase
          .from('services')
          .update({
            title,
            description,
            category,
            image_url: imageUrl,
            demo_url: demoUrl,
            ai_tools: aiTools,
          })
          .eq('id', serviceId)
        if (updateError) throw new Error(updateError.message || '서비스 수정에 실패했습니다.')
        router.push('/services')
      } else {
        // [MCP] 신규 등록
        const { data, error: insertError } = await supabase
          .from('services')
          .insert({
            author_id: user.id,
            title,
            description,
            category,
            image_url: imageUrl,
            demo_url: demoUrl,
            ai_tools: aiTools,
          })
          .select()
          .single()
        if (insertError) throw new Error(insertError.message || t('registerFailed'))
        router.push('/services')
      }
    } catch (e: any) {
      setError(e.message || t('registerError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32 py-12">
      {/* Top navigation */}
      <div className="w-full max-w-2xl mx-auto flex items-center mb-8">
        {/* [MCP] 수정/등록 모드에 따라 타이틀 변경 */}
        <h1 className="flex-1 text-center text-2xl font-bold text-gray-900">{serviceId ? 'AI 서비스 수정' : t("serviceRegisterTitle")}</h1>
      </div>
      <form className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-8 border border-gray-100">
        {/* [MCP] 수정 모드 로딩 */}
        {fetching && <div className="text-center text-gray-500 py-8">서비스 정보를 불러오는 중...</div>}
        {/* Service name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("serviceName")}</label>
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={t("serviceNamePlaceholder")}
            required
            maxLength={100}
          />
        </div>
        {/* Detailed description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("serviceDescriptionLabel")}</label>
          <Textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={t("serviceDescriptionPlaceholder")}
            required
            maxLength={500}
            className="min-h-[120px]"
          />
          <div className="text-xs text-gray-400 text-right mt-1">{description.length}/500</div>
        </div>
        {/* Category selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("categoryLabel")}</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categories.map(cat => (
              <button
                type="button"
                key={cat.id}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors duration-200 ${category === cat.id ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-700 border-gray-200 hover:bg-violet-50"}`}
                onClick={() => setCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        {/* Representative image/screenshot */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("imageLabel")}</label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <div className="mt-3">
              <Image src={imagePreview} alt={t('preview')} width={320} height={180} className="rounded-lg border object-cover" />
            </div>
          )}
        </div>
        {/* Demo URL */}
        <div>
          <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-700 mb-2">{t("demoUrlLabel")}</label>
          <Input
            id="demoUrl"
            value={demoUrl}
            onChange={e => setDemoUrl(e.target.value)}
            placeholder={t("demoUrlPlaceholder")}
            type="url"
            maxLength={200}
          />
        </div>
        {/* Used AI tools/models */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("aiToolsLabel")} (최대 5개, 필수)</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={aiToolsInput}
              onChange={e => setAiToolsInput(e.target.value)}
              placeholder={t('aiToolsPlaceholder')}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddAiTool(); } }}
              maxLength={40}
              className="flex-1"
            />
            <Button type="button" onClick={handleAddAiTool} disabled={!aiToolsInput || aiTools.length >= 5} variant="secondary">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {aiTools.map(tool => (
              <Badge key={tool} className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {tool}
                <button type="button" onClick={() => handleRemoveAiTool(tool)} className="ml-1 text-blue-400 hover:text-blue-700">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
        {/* Register button */}
        <div className="flex justify-end">
          <Button type="button" onClick={handleRegister} disabled={loading || userLoading || fetching} className="bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold px-8 py-3 rounded-xl">
            {loading ? t("registering") : (serviceId ? '수정' : t("register"))}
          </Button>
        </div>
        {error && <div className="text-red-500 text-sm text-right mt-2">{error}</div>}
      </form>
    </div>
  )
} 