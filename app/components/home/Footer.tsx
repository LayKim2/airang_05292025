"use client"

import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Sparkles, Github, Twitter, Mail } from "lucide-react"
import { useTranslation } from "@/app/i18n/useTranslation"

export function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-600">
                AIrang
              </span>
            </Link>
            <p className="text-gray-600 mb-4">
              {t('footerDescription')}
              <br />
              {t('footerDescription2')}
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="mailto:contact@airang.com" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{t('footerQuickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-gray-600 hover:text-violet-600 transition-colors">
                  {t('footerServices')}
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-600 hover:text-violet-600 transition-colors">
                  {t('footerCommunity')}
                </Link>
              </li>
              <li>
                <Link href="/match" className="text-gray-600 hover:text-violet-600 transition-colors">
                  {t('footerMatch')}
                </Link>
              </li>
              <li>
                <Link href="/trends" className="text-gray-600 hover:text-violet-600 transition-colors">
                  {t('footerTrends')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{t('footerLegal')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-violet-600 transition-colors">
                  {t('footerTerms')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-violet-600 transition-colors">
                  {t('footerPrivacy')}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 hover:text-violet-600 transition-colors">
                  {t('footerCookies')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>{t('footerCopyright')}</p>
        </div>
      </div>
    </footer>
  )
} 