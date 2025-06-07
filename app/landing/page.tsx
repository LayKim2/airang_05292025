"use client"

import { motion } from 'framer-motion'
import { Button } from '@/app/components/ui/button'
import { Sparkles, Users, Gift, ArrowRight, CheckCircle2, Eye } from 'lucide-react'
import Link from 'next/link'
import { CreatorApplicationForm } from '@/app/components/landing/CreatorApplicationForm'
import { Modal } from '@/app/components/ui/modal'
import { useEffect, useState, useContext } from 'react'
import { useTranslation } from "@/app/i18n/useTranslation";
import { LanguageContext } from "@/app/i18n/LanguageProvider";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false)
  const { t } = useTranslation();
  const { setLanguage } = useContext(LanguageContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'en' | 'ko'>('en');

  useEffect(() => {
    // 페이지 로드 시 모달 표시
    setShowModal(true)
  }, [])

  useEffect(() => {
    // 컴포넌트 마운트 시 localStorage에서 언어 값 읽기
    const storedLang = typeof window !== 'undefined' ? localStorage.getItem('selectedLang') : null;
    if (storedLang === 'ko' || storedLang === 'en') {
      setSelectedLang(storedLang);
      setLanguage(storedLang);
    }
  }, [setLanguage]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} />


      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-32 left-32 w-64 h-64 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div 
            className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -20, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-end mb-4">
            <div className="relative inline-block text-left">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                id="language-menu"
                aria-haspopup="true"
                aria-expanded="false"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                {selectedLang === 'en' ? 'English' : '한국어'} ▼
              </button>
              {showDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="language-menu">
                    <button
                      onClick={() => {
                        setLanguage('ko');
                        setSelectedLang('ko');
                        setShowDropdown(false);
                        if (typeof window !== 'undefined') localStorage.setItem('selectedLang', 'ko');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-violet-100 hover:text-violet-900"
                      role="menuitem"
                    >
                      Korean
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('en');
                        setSelectedLang('en');
                        setShowDropdown(false);
                        if (typeof window !== 'undefined') localStorage.setItem('selectedLang', 'en');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-900"
                      role="menuitem"
                    >
                      English
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  {t('heroTitle')}
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  {t('heroDesc')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-medium px-8 py-6 rounded-xl transition-all duration-300 group shadow-lg hover:shadow-xl"
                    onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Sparkles className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    {t('applyButton')}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white font-medium px-8 py-6 rounded-xl transition-all duration-300 group shadow-lg hover:shadow-xl"
                    onClick={() => window.location.href = '/'}
                  >
                    <Eye className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    {t('previewButton')}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              {t('featuresTitle')}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10"
              >
                <Users className="w-12 h-12 text-violet-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{t('featureCommunity')}</h3>
                <p className="text-gray-400">
                  {t('featureCommunityDesc')}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10"
              >
                <Sparkles className="w-12 h-12 text-violet-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{t('featurePromotion')}</h3>
                <p className="text-gray-400">
                  {t('featurePromotionDesc')}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10"
              >
                <Gift className="w-12 h-12 text-violet-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{t('featureMatching')}</h3>
                <p className="text-gray-400">
                  {t('featureMatchingDesc')}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Giveaway Section */}
      <section id="application-form" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-violet-500/20 to-blue-500/20 backdrop-blur-sm p-8 rounded-3xl border border-white/10">
            <div className="text-center mb-8">
              <Gift className="w-16 h-16 text-violet-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">
                {t('giveawayTitle')}
              </h2>
              <p className="text-xl text-gray-300">
                {t('giveawayDesc')}
              </p>
              <p className="text-lg text-violet-400 font-semibold mt-4">
                {t('giveawayHighlight')}
              </p>
            </div>
            
            <CreatorApplicationForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-white">AIrang</span>
              </div>
            </Link>
            <p className="text-gray-400">
              {t('footerCopyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}