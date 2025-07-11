"use client"
import Link from 'next/link'
import { useTranslation } from '@/app/i18n/useTranslation'

export default function NotFound() {
  const { t } = useTranslation()
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">{t('notFound.title')}</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">{t('notFound.subtitle')}</h2>
          <p className="text-gray-500 mb-8">
            {t('notFound.description')}
          </p>
        </div>
        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          {t('notFound.backHome')}
        </Link>
      </div>
    </div>
  )
} 