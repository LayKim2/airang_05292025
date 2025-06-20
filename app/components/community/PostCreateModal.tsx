import { useState, useRef } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { useTranslation } from "@/app/i18n/useTranslation";
import { Plus, Sparkles, Code, Image as ImageIcon, Lightbulb, MessageCircle, Image as ImageUploadIcon } from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { supabase } from '@/lib/supabase';
import { useUserProfile } from '@/app/lib/useUserProfile';

const categories = [
  { id: "AI", label: "AI", icon: Sparkles },
  { id: "Development", label: "Development", icon: Code },
  { id: "Design", label: "Design", icon: ImageIcon },
  { id: "Ideas", label: "Ideas", icon: Lightbulb },
  { id: "Questions", label: "Questions", icon: MessageCircle },
];

export default function PostCreateModal() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(categories[0].id);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  // Blob 이미지 파일을 저장할 Ref
  const blobImagesRef = useRef<{ [blobUrl: string]: File }>({});

  // Clerk 인증 유저 정보 연동
  const { user, profile } = useUserProfile();
  const selectedCategory = categories.find(c => c.id === category);

  // tiptap 에디터 인스턴스 생성
  const editor = useEditor({
    extensions: [StarterKit, Image, Link, TextStyle, Color, FontFamily],
    content: '',
    editorProps: {
      attributes: {
        class: 'w-full bg-gray-50 border-0 text-lg resize-none focus:ring-0 min-h-[120px] placeholder:text-gray-400 rounded-xl p-3',
        spellCheck: 'true',
      },
    },
    autofocus: false,
  });

  // 태그 칩 추가/삭제 핸들러
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };
  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  // 이미지 업로드 핸들러: Blob URL로만 미리보기, 파일은 Ref에 저장(이미지는 하나만)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    // 기존 이미지 모두 제거
    blobImagesRef.current = {};
    const blobUrl = URL.createObjectURL(file);
    editor.chain().focus().setImage({ src: blobUrl }).run();
    blobImagesRef.current[blobUrl] = file;
  };

  // Post 등록(Submit) 시 Blob URL 이미지를 Storage에 업로드 후 content 내 URL 교체
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;
    let content = editor.getText();
    let html = editor.getHTML();
    // Blob URL이 있으면 submit 시 Storage에 업로드 후 publicUrl로 교체
    let imageUrl = null;
    const blobUrls = Object.keys(blobImagesRef.current);
    for (const blobUrl of blobUrls) {
      if (html.includes(blobUrl)) {
        const file = blobImagesRef.current[blobUrl];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).slice(2,8)}.${fileExt}`;
        const { data, error } = await supabase.storage.from('service-images').upload(fileName, file, { upsert: true });
        if (error) continue;
        const { data: urlData } = supabase.storage.from('service-images').getPublicUrl(fileName);
        const publicUrl = urlData?.publicUrl;
        if (publicUrl) {
          html = html.replaceAll(blobUrl, publicUrl);
          imageUrl = publicUrl;
        }
      }
    }
    // posts 테이블에 저장 (content는 getText, image_url은 publicUrl)
    await supabase.from('posts').insert({
      content,
      category,
      tags,
      author_id: profile?.clerk_user_id || user?.id || null,
      image_url: imageUrl
    });
    // 초기화
    editor.commands.clearContent();
    setTagInput("");
    blobImagesRef.current = {};
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
          <Plus className="w-5 h-5 mr-2" />
          {t('community.writeButton')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg w-full p-0 overflow-hidden rounded-2xl shadow-2xl h-[80vh] max-h-[80vh] overflow-y-auto">
        {/* 접근성: DialogTitle을 visually hidden으로 추가 */}
        <DialogTitle className="sr-only">{t('community.modalTitle')}</DialogTitle>
        {/* SNS 스타일 상단: 유저/카테고리/날짜 */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-base">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" className="rounded-full w-8 h-8 object-cover" />
            ) : user?.firstName ? user.firstName[0] : '닉'}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 text-sm">
              {profile?.first_name || user?.firstName || ''}
              {profile?.last_name || user?.lastName || ''}
            </div>
            <div className="text-xs text-gray-400 flex gap-2 items-center">
              {/* 날짜/카테고리 등 필요시 추가 */}
            </div>
          </div>
          {/* 카테고리 선택 드롭다운 */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-gray-50 border-gray-200 w-24 text-xs h-8">
              <SelectValue placeholder={t('community.form.categoryPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id} className="flex items-center gap-2">
                  {cat.icon && <cat.icon className="w-4 h-4 text-violet-500 mr-2 inline-block" />} {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* tiptap 에디터 본문 입력란 + 이미지 업로드 버튼 */}
        <form className="px-6 pt-2 pb-6 flex flex-col h-full min-h-0 flex-1" onSubmit={handleSubmit}>
          {/* 툴바: 이미지 첨부 버튼만 남김 */}
          {editor && (
            <div className="flex gap-2 mb-2 items-center">
              <label htmlFor="image-upload" className="cursor-pointer flex items-center gap-1 text-violet-600 hover:text-violet-800 text-xs font-semibold px-2 py-1">
                <ImageUploadIcon className="w-4 h-4" />
                {t('community.form.imageUpload')}
              </label>
              <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
          )}
          {/* EditorContent 영역이 팝업 내에서 최대한 늘어나도록 flex-1 구조 적용 */}
          <div className="mb-4 flex-1 min-h-0 flex flex-col">
            <EditorContent editor={editor} className="tiptap tiptap-plain flex-1 min-h-0 h-auto" />
          </div>
          {/* 태그 칩/입력 영역은 flex-shrink-0으로 고정 */}
          <div className="mt-4 flex-shrink-0">
            <label className="block text-xs font-semibold mb-1 text-gray-700">{t('community.form.tags')}</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span key={tag} className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                  #{tag}
                  <button type="button" className="ml-1 text-violet-400 hover:text-violet-700" onClick={() => removeTag(tag)}>&times;</button>
                </span>
              ))}
            </div>
            <Input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={t('community.form.tagPlaceholder')}
              className="bg-gray-50 border-gray-200 text-xs"
            />
          </div>
          {/* 하단 버튼 영역도 flex-shrink-0으로 고정 */}
          <div className="flex justify-end gap-2 pt-6 border-t bg-gray-50 -mx-6 px-6 mt-6 flex-shrink-0">
            <DialogClose asChild>
              <Button type="button" variant="outline">{t('common.cancel')}</Button>
            </DialogClose>
            <Button type="submit">{t('common.submit')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 