"use client"

import { useTranslation } from "@/app/i18n/useTranslation"

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl sm:pt-[120px] pt-[160px]">
      <h1 className="text-3xl font-bold mb-8">{t('termsTitle')}</h1>
      
      <div className="space-y-8 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('termsSection1Title')}</h2>
          <p>{t('termsSection1Desc')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('termsSection2Title')}</h2>
          <p>{t('termsSection2Desc')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>{t('termsSection2Item1')}</li>
            <li>{t('termsSection2Item2')}</li>
            <li>{t('termsSection2Item3')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('termsSection3Title')}</h2>
          <p>{t('termsSection3Desc')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('termsSection4Title')}</h2>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>{t('termsSection4Item1')}</li>
            <li>{t('termsSection4Item2')}</li>
            <li>{t('termsSection4Item3')}</li>
            <li>{t('termsSection4Item4')}</li>
            <li>{t('termsSection4Item5')}</li>
          </ul>
        </section>
      </div>
    </div>
  )
} 