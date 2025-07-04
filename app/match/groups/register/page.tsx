"use client"
import { useState } from "react";
import { GROUP_CATEGORIES } from "@/app/types";
import { Plus, Upload, Sparkles, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { supabase } from '@/lib/supabase';
import { useUserProfile } from '@/app/lib/useUserProfile';
import { useRouter } from "next/navigation";
import React, { forwardRef } from "react";
import { useTranslation } from "@/app/i18n/useTranslation";

// DatePicker용 커스텀 인풋
const CustomDateInput = forwardRef<HTMLButtonElement, { value?: string, onClick?: () => void, placeholder?: string }>(
  ({ value, onClick, placeholder }, ref) => (
    <button
      type="button"
      className="flex items-center w-full h-12 px-4 pr-10 bg-gray-50 border rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all text-left relative"
      onClick={onClick}
      ref={ref}
    >
      <span className={`flex-1 ${!value ? 'text-gray-400' : ''}`}>{value || placeholder}</span>
      <Calendar className="w-5 h-5 text-gray-400 absolute right-3" />
    </button>
  )
);

// [AI 모임 등록] 실제 서비스/리스트에 맞는 필드로 확장
export default function GroupRegisterPage() {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(GROUP_CATEGORIES[0].id);
  const [description, setDescription] = useState("");
  const [recruitCount, setRecruitCount] = useState("10");
  const [image, setImage] = useState<File|null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [aiTools, setAiTools] = useState<string[]>([]);
  const [aiToolInput, setAiToolInput] = useState("");
  const { profile } = useUserProfile();
  const [cost, setCost] = useState("0");
  const [currency, setCurrency] = useState("KRW");
  const [location, setLocation] = useState("");
  const [locationType, setLocationType] = useState("offline"); // offline, online, both
  const [meetingType, setMeetingType] = useState("one_time"); // one_time, recurring
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // deadline의 초기값: 현재 달의 마지막 날
  const getDefaultMeetingDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
  };
  const [meetingDate, setMeetingDate] = useState<Date|null>(getDefaultMeetingDate());

  // 태그/스택/포지션 추가/삭제
  const handleAddAiTool = () => { if (aiToolInput && !aiTools.includes(aiToolInput)) { setAiTools([...aiTools, aiToolInput]); setAiToolInput(""); } };
  const handleRemoveAiTool = (tool: string) => setAiTools(aiTools.filter(t => t !== tool));

  // 대표 이미지 업로드 핸들러(미리보기, 최대 1MB 제한)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1 * 1024 * 1024) { // 1MB 제한
        alert(t('groups.register.imageSizeError'));
        return;
      }
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  // 상세 소개 에디터 상태
  const editor = useEditor({
    extensions: [StarterKit, Image, Underline],
    content: description,
    editorProps: {
      attributes: {
        class: 'w-full bg-gray-50 border border-gray-200 text-base min-h-[220px] rounded-xl p-4 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all',
        spellCheck: 'true',
      },
    },
    autofocus: false,
    onUpdate: ({ editor }) => setDescription(editor.getHTML()),
  });

  // 이미지 업로드 핸들러 (에디터에 미리보기, 최대 1MB 제한)
  const handleEditorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    if (file.size > 1 * 1024 * 1024) { // 1MB 제한
      alert(t('groups.register.editorImageSizeError'));
      return;
    }
    const blobUrl = URL.createObjectURL(file);
    editor.chain().focus().setImage({ src: blobUrl }).run();
  };

  // 등록 submit 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.clerk_user_id) {
      alert(t('groups.register.loginRequired'));
      return;
    }
    if (!title || !category || !description || !meetingType || !meetingDate) {
      alert(t('groups.register.requiredFieldsError'));
      return;
    }
    // 대표이미지 업로드(실제 서비스에서는 storage 업로드 필요, 여기선 임시로 File URL)
    let image_url = imageUrl;
    if (image) {
      try {
        const fileExt = image.name.split('.').pop();
        const filePath = `groups/${profile.clerk_user_id}/${Date.now()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage.from('service-images').upload(filePath, image, {
          cacheControl: '3600',
          upsert: false,
        });
        if (uploadError) throw new Error(t('groups.register.imageUploadError') + uploadError.message);
        const { data: publicUrlData } = supabase.storage.from('service-images').getPublicUrl(filePath);
        image_url = publicUrlData?.publicUrl || '';
      } catch (err: any) {
        alert(err.message);
        return;
      }
    }
    // meetingDate 포맷 변환
    let meetingDateStr = meetingDate ? meetingDate.toISOString().slice(0, 10) : null;
    const { data: groupInsertData, error: groupInsertError } = await supabase.from('groups').insert({
      user_id: profile.clerk_user_id,
      title,
      category,
      ai_tools: aiTools,
      meeting_type: meetingType,
      meeting_date: meetingDateStr,
      recruit_count: recruitCount ? Number(recruitCount) : null,
      description,
      image_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'recruiting',
      current_count: 1,
      cost: cost ? Number(cost) : null,
      currency,
      location,
      location_type: locationType,
    }).select('id'); // id 반환
    if (groupInsertError) {
      alert(t('groups.register.registrationError') + groupInsertError.message);
    } else {
      // group_members에 leader로 본인 추가
      const groupId = groupInsertData && groupInsertData[0]?.id;
      if (groupId) {
        await supabase.from('group_members').insert({
          group_id: groupId,
          user_id: profile.clerk_user_id,
          role: 'leader',
        });
      }
      setShowSuccessModal(true);
      // 폼 초기화
      setTitle("");
      setCategory(GROUP_CATEGORIES[0].id);
      setAiTools([]);
      setMeetingDate(null);
      setRecruitCount("");
      setDescription("");
      setImage(null);
      setImageUrl("");
      if (editor) editor.commands.clearContent();
      setCost("");
      setCurrency("KRW");
      setLocation("");
      setLocationType("offline");
      setMeetingType("one_time");
    }
  };

  // 성공 팝업 닫기 핸들러
  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    router.push('/match/groups');
  };

  return (
    <main className="mt-16 min-h-screen pt-14 sm:pt-16 bg-gray-100">
      <form className="w-full max-w-3xl mx-auto bg-white border border-gray-200 shadow-sm px-0 sm:px-8 py-10 flex flex-col gap-8" onSubmit={handleSubmit}>
        {/* 타이틀 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2 px-8">{t('groups.register.title')}</h1>
        {/* 대표 이미지 업로드 */}
        <div className="px-8 flex flex-col gap-2">
          <label className="text-base font-semibold mb-1">{t('groups.register.imageLabel')}</label>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-violet-600 w-fit">
              <Upload className="w-5 h-5" />
              <span>{t('groups.register.uploadImage')}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
            {/* 대표 이미지 미리보기: w-full, max-h-64, object-cover, rounded-xl, border, bg-gray-100 */}
            {imageUrl && (
              <div className="w-full">
                <img src={imageUrl} alt={t('groups.register.preview')} className="w-full max-h-64 object-cover rounded-xl border bg-gray-100" />
              </div>
            )}
          </div>
        </div>
        {/* 제목 */}
        <div className="px-8 border-b border-gray-100 pb-6 flex flex-col gap-2">
          <label className="text-base font-semibold">{t('groups.register.groupName')}</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)}
            className={`h-12 px-4 bg-gray-50 border rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all ${!title ? 'border-red-500' : 'border-gray-200'}`} placeholder={t('groups.register.groupNamePlaceholder')} />
        </div>
        {/* 카테고리/모집인원/모임유형/모임일자 */}
        <div className="px-8 border-b border-gray-100 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-base font-semibold">{t('groups.register.category')}</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className={`h-12 px-4 bg-gray-50 border rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all ${!category ? 'border-red-500' : 'border-gray-200'}`}>
              {GROUP_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{t(`groups.category.${cat.id}`)}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-base font-semibold">{t('groups.register.recruitCount')}</label>
            <input type="number" min={1} value={recruitCount} onChange={e => setRecruitCount(e.target.value)}
              className={`h-12 px-4 bg-gray-50 border rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all ${!recruitCount ? 'border-red-500' : 'border-gray-200'}`} placeholder={t('groups.register.recruitCountPlaceholder')} />
          </div>
          {/* 모임 유형 선택 */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-semibold">{t('groups.register.meetingType')}</label>
            <select value={meetingType} onChange={e => setMeetingType(e.target.value)}
              className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all">
              <option value="one_time">{t('groups.register.meetingTypeOneTime')}</option>
              <option value="recurring">{t('groups.register.meetingTypeRecurring')}</option>
            </select>
          </div>
          {/* 모임 일자/시작일 (조건부) */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-semibold">
              {meetingType === 'one_time' ? t('groups.register.meetingDate') : t('groups.register.startDate')}
            </label>
            <DatePicker
              selected={meetingDate}
              onChange={(date: Date | null) => setMeetingDate(date)}
              dateFormat="yyyy-MM-dd"
              customInput={<CustomDateInput placeholder={meetingType === 'one_time' ? t('groups.register.selectMeetingDate') : t('groups.register.selectStartDate')} />}
            />
          </div>
          {/* 장소유형/비용/화폐단위 한 줄 */}
          <div className="grid grid-cols-6 gap-4 col-span-2">
            <div className="flex flex-col gap-2 col-span-3">
              <label className="text-base font-semibold">{t('groups.register.locationType')}</label>
              <select value={locationType} onChange={e => setLocationType(e.target.value)}
                className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all">
                <option value="offline">{t('groups.register.locationTypeOffline')}</option>
                <option value="online">{t('groups.register.locationTypeOnline')}</option>
                <option value="both">{t('groups.register.locationTypeBoth')}</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <label className="text-base font-semibold">{t('groups.register.cost')}</label>
              <input type="number" min={0} value={cost} onChange={e => setCost(e.target.value)}
                className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all" placeholder={t('groups.register.costPlaceholder')} />
            </div>
            <div className="flex flex-col gap-2 col-span-1">
              <label className="text-base font-semibold">{t('groups.register.currency')}</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)}
                className="h-12 px-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all">
                <option value="KRW">₩</option>
                <option value="USD">$</option>
                <option value="JPY">¥</option>
                <option value="CNY">¥</option>
                <option value="EUR">€</option>
              </select>
            </div>
          </div>
          {/* 장소 입력란 */}
          <div className="flex flex-col gap-2 col-span-2">
            <label className="text-base font-semibold">{t('groups.register.location')}</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)}
              className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all" placeholder={t('groups.register.locationPlaceholder')} />
          </div>
        </div>
        {/* 태그/AI 도구/모델 */}
        <div className="px-8 border-b border-gray-100 pb-6 flex flex-col gap-4">
          {/* 관련 AI 도구/모델 한 줄 */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-semibold">{t('groups.register.aiTools')}</label>
            <div className="flex gap-2">
              <input type="text" value={aiToolInput} onChange={e => setAiToolInput(e.target.value)}
                className="flex-1 h-12 px-4 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder={t('groups.register.aiToolsPlaceholder')} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddAiTool(); }}} />
              <button type="button" onClick={handleAddAiTool} className="px-4 h-12 rounded-md bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all"><Plus className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {aiTools.map(tool => (
                <span key={tool} className="px-3 py-1 rounded-full bg-blue-100 text-sm text-blue-700 font-semibold flex items-center gap-1">{tool} <button type="button" onClick={() => handleRemoveAiTool(tool)} className="ml-1 text-blue-400 hover:text-red-400">×</button></span>
              ))}
            </div>
          </div>
        </div>
        {/* 상세 소개 */}
        <div className="px-8 flex flex-col gap-2">
          <label className="text-base font-semibold">{t('groups.register.description')}</label>
          {/* tiptap HTML 에디터 툴바 */}
          {editor && (
            <div className="flex gap-2 mb-2 items-center flex-wrap">
              <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded text-sm font-bold ${editor.isActive('bold') ? 'bg-violet-100 text-violet-700' : 'text-gray-500 hover:bg-gray-100'}`}>B</button>
              <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded text-sm italic ${editor.isActive('italic') ? 'bg-violet-100 text-violet-700' : 'text-gray-500 hover:bg-gray-100'}`}>I</button>
              <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`px-2 py-1 rounded text-sm underline ${editor.isActive('underline') ? 'bg-violet-100 text-violet-700' : 'text-gray-500 hover:bg-gray-100'}`}>U</button>
              {/* 이미지 업로드 버튼 */}
              <label className="px-2 py-1 rounded text-sm text-gray-500 hover:bg-gray-100 cursor-pointer">
                {t('groups.register.image')}
                <input type="file" accept="image/*" className="hidden" onChange={handleEditorImageUpload} />
              </label>
            </div>
          )}
          <EditorContent editor={editor} />
          {/* 상세소개가 비어있으면 빨간 테두리 */}
          {!description && <div className="mt-1 text-xs text-red-500">{t('groups.register.descriptionRequired')}</div>}
        </div>
        {/* 등록 버튼 */}
        <div className="flex justify-end px-8">
          <button type="submit" className="px-10 py-4 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white font-extrabold text-lg shadow hover:from-violet-700 hover:to-blue-700 transition-all">{t('groups.register.submitButton')}</button>
        </div>
        {/* 등록 성공 팝업 */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative border border-gray-200">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
                onClick={handleCloseSuccess}
                aria-label={t('groups.register.closeModal')}
              >
                ×
              </button>
              <div className="flex flex-col items-center gap-4">
                <Sparkles className="w-10 h-10 text-violet-500 mb-2" />
                <h2 className="text-xl font-bold text-gray-900 text-center">{t('groups.register.successMessage')}</h2>
                <button
                  className="mt-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-semibold text-base hover:scale-105 transition-all"
                  onClick={handleCloseSuccess}
                >
                  {t('groups.register.confirm')}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </main>
  );
} 