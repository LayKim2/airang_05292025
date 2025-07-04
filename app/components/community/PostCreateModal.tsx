import { useState, useRef } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { useTranslation } from "@/app/i18n/useTranslation";
import { Plus, Share2, BookText, MessageCircleQuestion, Archive, Image as ImageUploadIcon, Loader2 } from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { supabase } from '@/lib/supabase';
import { useUserProfile } from '@/app/lib/useUserProfile';

// [MCP] create/edit 겸용 모달을 위한 prop 확장
interface PostCreateModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onPostCreated?: () => void;
  // [MCP] edit 모드용 prop
  mode?: 'create' | 'edit';
  postId?: number;
  initialContent?: string;
  initialCategory?: string;
  initialTags?: string[];
  onPostUpdated?: () => void;
}

export default function PostCreateModal({
  open,
  onOpenChange,
  onPostCreated,
  mode = 'create',
  postId,
  initialContent = '',
  initialCategory,
  initialTags = [],
  onPostUpdated,
}: PostCreateModalProps) {
  const { t } = useTranslation();
  
  const categories = [
    { id: "PromptSharing", label: t('community.categories.promptSharing'), icon: Share2 },
    { id: "TipsAndKnowHow", label: t('community.categories.tipsAndKnowHow'), icon: BookText },
    { id: "QAndAAndFeedback", label: t('community.categories.qAndAAndFeedback'), icon: MessageCircleQuestion },
    { id: "General", label: t('community.categories.general'), icon: Archive },
  ];

  // [MCP] edit 모드일 때 초기값 적용
  const [category, setCategory] = useState(initialCategory || categories[0].id);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Blob 이미지 파일을 저장할 Ref
  const blobImagesRef = useRef<{ [blobUrl: string]: File }>({});

  // Clerk 인증 유저 정보 연동
  const { user, profile } = useUserProfile();
  
  // [MCP] edit 모드일 때 초기 content 적용
  const editor = useEditor({
    extensions: [StarterKit, Image, Link, TextStyle, Color, FontFamily],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'w-full bg-gray-50 border-0 text-lg resize-none focus:ring-0 min-h-[120px] placeholder:text-gray-400 rounded-xl p-3',
        spellCheck: 'true',
      },
    },
    autofocus: false,
  });

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  // 태그 칩 추가/삭제 핸들러
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
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
    blobImagesRef.current = {};
    const blobUrl = URL.createObjectURL(file);
    editor.chain().focus().setImage({ src: blobUrl }).run();
    blobImagesRef.current[blobUrl] = file;
  };

  // [MCP] Post 등록/수정(Submit) 시 Blob URL 이미지를 Storage에 업로드 후 content 내 URL 교체
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor || editor.isEmpty || isSubmitting) {
      if (!isSubmitting) alert(t('community.form.contentPlaceholder'));
      return;
    }

    setIsSubmitting(true);
    try {
      let html = editor.getHTML();

      // Blob URL이 있으면 submit 시 Storage에 업로드 후 publicUrl로 교체
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
          }
        }
      }

      if (mode === 'edit' && postId) {
        // [MCP] edit 모드: update 쿼리
        await supabase.from('posts').update({
          content: html,
          category,
          tags,
        }).eq('id', postId);
        if (onOpenChange) onOpenChange(false);
        if (onPostUpdated) onPostUpdated();
      } else {
        // [MCP] create 모드: insert 쿼리
        await supabase.from('posts').insert({
          content: html,
          category,
          tags,
          author_id: profile?.clerk_user_id || user?.id || null,
        });
        // 초기화
        editor.commands.clearContent();
        setTagInput("");
        setTags([]);
        blobImagesRef.current = {};
        if (onOpenChange) onOpenChange(false);
        if (onPostCreated) onPostCreated();
      }
    } catch (error) {
      console.error("Error creating/updating post:", error);
      // 사용자에게 에러 알림 (예: toast 메시지)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* [MCP] 외부에서 버튼 제어, DialogTrigger 제거 */}
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
            </div>
          </div>
          {/* 카테고리 선택 드롭다운 */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-gray-50 border-gray-200 w-auto whitespace-nowrap text-xs h-8">
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
          <div className="mb-4 flex-1 min-h-0 flex flex-col overflow-y-auto">
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
            <div className="flex items-center gap-2">
              <Input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={t('community.form.tagPlaceholder')}
                className="bg-gray-50 border-gray-200 text-xs flex-1"
              />
              <Button type="button" onClick={handleAddTag} variant="outline" size="sm" className="flex-shrink-0">
                {t('common.add')}
              </Button>
            </div>
          </div>
          {/* 하단 버튼 영역도 flex-shrink-0으로 고정 */}
          <div className="flex justify-end gap-2 pt-6 border-t bg-gray-50 -mx-6 px-6 mt-6 flex-shrink-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>{t('common.cancel')}</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t('common.submit')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 