import { Metadata } from "next"

// SEO Metadata
const metaByLang: Record<string, { title: string; description: string }> = {
  ko: {
    title: '커뮤니티',
    description: 'AI 크리에이터들과 소통하고 협업하세요.'
  },
  en: {
    title: 'Community',
    description: 'Connect with AI creators and collaborate on innovative projects'
  },
  ja: {
    title: 'コミュニティ',
    description: 'AIクリエイターとつながり、革新的なプロジェクトで協力しましょう。'
  },
  zh: {
    title: '社区',
    description: '与AI创作者联系并协作创新项目。'
  }
}

export async function generateMetadata({ params }: { params: { lang?: string } }): Promise<Metadata> {
  const lang = params?.lang || 'en';
  const meta = metaByLang[lang] || metaByLang['en'];
  return {
    title: meta.title,
    description: meta.description,
  }
} 