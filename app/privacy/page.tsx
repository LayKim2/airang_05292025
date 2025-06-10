"use client"

import { useTranslation } from "@/app/i18n/useTranslation"

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl sm:pt-[120px] pt-[160px]">
      <h1 className="text-3xl font-bold mb-8">{t('privacyTitle')}</h1>
      
      <div className="space-y-8 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('privacySection1Title')}</h2>
          <p>
            {t('privacySection1Desc')}
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>{t('privacySection1Required')}</li>
            <li>{t('privacySection1Optional')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('privacySection2Title')}</h2>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>{t('privacySection2Item1')}</li>
            <li>{t('privacySection2Item2')}</li>
            <li>{t('privacySection2Item3')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('privacySection3Title')}</h2>
          <p>
            {t('privacySection3Desc')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('privacySection4Title')}</h2>
          <p>
            {t('privacySection4Desc')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('privacySection5Title')}</h2>
          <p>
            {t('privacySection5Desc')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('privacySection6Title')}</h2>
          <p>
            {t('privacySection6Desc')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('privacySection7Title')}</h2>
          <p>
            {t('privacySection7Desc')}
          </p>
        </section>
      </div>
    </div>
  )
} 