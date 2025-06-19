import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { useTranslation } from "@/app/i18n/useTranslation";
import { Plus } from "lucide-react";

const categories = [
  { id: "AI", label: "AI" },
  { id: "Development", label: "Development" },
  { id: "Design", label: "Design" },
  { id: "Ideas", label: "Ideas" },
  { id: "Questions", label: "Questions" },
];

export default function PostCreateModal() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(categories[0].id);
  const [tags, setTags] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
          <Plus className="w-5 h-5 mr-2" />
          {t('community.writeButton')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg w-full">
        <DialogTitle>{t('community.modalTitle')}</DialogTitle>
        <DialogDescription>{t('community.modalDesc')}</DialogDescription>
        <form className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('community.form.title')}</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder={t('community.form.titlePlaceholder')} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('community.form.content')}</label>
            <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder={t('community.form.contentPlaceholder')} rows={5} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('community.form.category')}</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t('community.form.categoryPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('community.form.tags')}</label>
            <Input value={tags} onChange={e => setTags(e.target.value)} placeholder={t('community.form.tagsPlaceholder')} />
            <p className="text-xs text-gray-400 mt-1">{t('community.form.tagsHelp')}</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">{t('common.cancel')}</Button>
            </DialogClose>
            <Button type="submit" disabled>{t('common.submit')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 