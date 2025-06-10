"use client"

import { useTranslation } from "@/app/i18n/useTranslation"

export default function CookiesPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl sm:pt-[120px] pt-[160px]">
      <h1 className="text-3xl font-bold mb-8">{t('cookiesTitle')}</h1>
      
      <div className="space-y-8 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('cookiesSection1Title')}</h2>
          <p>{t('cookiesSection1Desc')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>{t('cookiesSection1Item1')}</li>
            <li>{t('cookiesSection1Item2')}</li>
            <li>{t('cookiesSection1Item3')}</li>
            <li>{t('cookiesSection1Item4')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('cookiesSection2Title')}</h2>
          <p>{t('cookiesSection2Desc')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>{t('cookiesSection2Item1')}</li>
            <li>{t('cookiesSection2Item2')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('cookiesSection3Title')}</h2>
          <p>{t('cookiesSection3Desc')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('cookiesSection4Title')}</h2>
          <p>{t('cookiesSection4Desc')}</p>
        </section>
      </div>
    </div>
  )
} 