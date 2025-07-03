"use client"
import { useState } from "react";
import { GROUP_CATEGORIES } from "@/app/types";
import { Plus, Upload } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { supabase } from '@/lib/supabase';
import { useUserProfile } from '@/app/lib/useUserProfile';

// [AI 모임 등록] 실제 서비스/리스트에 맞는 필드로 확장
export default function GroupRegisterPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(GROUP_CATEGORIES[0].id);
  const [status, setStatus] = useState("recruiting");
  const [deadline, setDeadline] = useState<Date|null>(null);
  const [description, setDescription] = useState("");
  const [recruitCount, setRecruitCount] = useState("");
  const [image, setImage] = useState<File|null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [aiTools, setAiTools] = useState<string[]>([]);
  const [aiToolInput, setAiToolInput] = useState("");
  const { profile } = useUserProfile();

  // 태그/스택/포지션 추가/삭제
  const handleAddAiTool = () => { if (aiToolInput && !aiTools.includes(aiToolInput)) { setAiTools([...aiTools, aiToolInput]); setAiToolInput(""); } };
  const handleRemoveAiTool = (tool: string) => setAiTools(aiTools.filter(t => t !== tool));

  // 대표 이미지 업로드 핸들러(미리보기, 최대 1MB 제한)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1 * 1024 * 1024) { // 1MB 제한
        alert('대표 이미지는 최대 1MB까지만 업로드할 수 있습니다.');
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
      alert('이미지 파일은 최대 1MB까지만 업로드할 수 있습니다.');
      return;
    }
    const blobUrl = URL.createObjectURL(file);
    editor.chain().focus().setImage({ src: blobUrl }).run();
  };

  // 등록 submit 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.clerk_user_id) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!title || !category || !description) {
      alert('필수 항목을 입력해 주세요.');
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
        if (uploadError) throw new Error('이미지 업로드 실패: ' + uploadError.message);
        const { data: publicUrlData } = supabase.storage.from('service-images').getPublicUrl(filePath);
        image_url = publicUrlData?.publicUrl || '';
      } catch (err: any) {
        alert(err.message);
        return;
      }
    }
    // deadline 포맷 변환
    let deadlineStr = deadline ? deadline.toISOString().slice(0, 10) : null;
    const { data: groupInsertData, error: groupInsertError } = await supabase.from('groups').insert({
      user_id: profile.clerk_user_id,
      title,
      category,
      ai_tools: aiTools,
      deadline: deadlineStr,
      recruit_count: recruitCount ? Number(recruitCount) : null,
      description,
      image_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status,
      current_count: 1,
    }).select('id'); // id 반환
    if (groupInsertError) {
      alert('등록에 실패했습니다: ' + groupInsertError.message);
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
      alert('모임이 성공적으로 등록되었습니다!');
      // 폼 초기화
      setTitle("");
      setCategory(GROUP_CATEGORIES[0].id);
      setAiTools([]);
      setDeadline(null);
      setRecruitCount("");
      setDescription("");
      setImage(null);
      setImageUrl("");
      if (editor) editor.commands.clearContent();
    }
  };

  return (
    <main className="min-h-screen pt-14 sm:pt-16 bg-gray-100">
      <form className="w-full max-w-3xl mx-auto bg-white border border-gray-200 shadow-sm px-0 sm:px-8 py-10 flex flex-col gap-8" onSubmit={handleSubmit}>
        {/* 타이틀 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2 px-8">AI 크리에이터 모임 등록</h1>
        {/* 대표 이미지 업로드 */}
        <div className="px-8 flex flex-col gap-2">
          <label className="text-base font-semibold mb-1">대표 이미지 (선택)</label>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-violet-600 w-fit">
              <Upload className="w-5 h-5" />
              <span>이미지 업로드</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
            {/* 대표 이미지 미리보기: w-full, max-h-64, object-cover, rounded-xl, border, bg-gray-100 */}
            {imageUrl && (
              <div className="w-full">
                <img src={imageUrl} alt="미리보기" className="w-full max-h-64 object-cover rounded-xl border bg-gray-100" />
              </div>
            )}
          </div>
        </div>
        {/* 제목 */}
        <div className="px-8 border-b border-gray-100 pb-6 flex flex-col gap-2">
          <label className="text-base font-semibold">모임명</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)}
            className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all" placeholder="모임명을 입력하세요" />
        </div>
        {/* 카테고리/상태/모집인원/마감일 */}
        <div className="px-8 border-b border-gray-100 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-base font-semibold">카테고리</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all">
              {GROUP_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-base font-semibold">모집 상태</label>
            <select value={status} onChange={e => setStatus(e.target.value)}
              className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all">
              <option value="recruiting">모집중</option>
              <option value="recruited">모집완료</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-base font-semibold">모집 인원</label>
            <input type="number" min={1} value={recruitCount} onChange={e => setRecruitCount(e.target.value)}
              className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all" placeholder="예: 5" />
          </div>
          {/* 모집 마감일: calendar UI 적용 */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-semibold">모집 마감일</label>
            <DatePicker
              selected={deadline}
              onChange={(date: Date | null) => setDeadline(date)}
              dateFormat="yyyy-MM-dd"
              className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all w-full"
              placeholderText="마감일을 선택하세요"
              calendarClassName="rounded-xl border border-gray-200 shadow-lg"
              popperPlacement="bottom"
              minDate={new Date()}
              showPopperArrow={false}
            />
          </div>
        </div>
        {/* 태그/AI 도구/모델 */}
        <div className="px-8 border-b border-gray-100 pb-6 flex flex-col gap-4">
          {/* 관련 AI 도구/모델 한 줄 */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-semibold">관련 AI 도구/모델</label>
            <div className="flex gap-2">
              <input type="text" value={aiToolInput} onChange={e => setAiToolInput(e.target.value)}
                className="flex-1 h-12 px-4 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="예: ChatGPT, Stable Diffusion, Gemini 등, 입력 후 Enter" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddAiTool(); }}} />
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
          <label className="text-base font-semibold">상세 소개</label>
          {/* tiptap HTML 에디터 툴바 */}
          {editor && (
            <div className="flex gap-2 mb-2 items-center flex-wrap">
              <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded text-sm font-bold ${editor.isActive('bold') ? 'bg-violet-100 text-violet-700' : 'text-gray-500 hover:bg-gray-100'}`}>B</button>
              <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded text-sm italic ${editor.isActive('italic') ? 'bg-violet-100 text-violet-700' : 'text-gray-500 hover:bg-gray-100'}`}>I</button>
              <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`px-2 py-1 rounded text-sm underline ${editor.isActive('underline') ? 'bg-violet-100 text-violet-700' : 'text-gray-500 hover:bg-gray-100'}`}>U</button>
              {/* 이미지 업로드 버튼 */}
              <label className="px-2 py-1 rounded text-sm text-gray-500 hover:bg-gray-100 cursor-pointer">
                이미지
                <input type="file" accept="image/*" className="hidden" onChange={handleEditorImageUpload} />
              </label>
            </div>
          )}
          <EditorContent editor={editor} />
        </div>
        {/* 등록 버튼 */}
        <div className="flex justify-end px-8">
          <button type="submit" className="px-10 py-4 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white font-extrabold text-lg shadow hover:from-violet-700 hover:to-blue-700 transition-all">모임 등록</button>
        </div>
      </form>
    </main>
  );
} 