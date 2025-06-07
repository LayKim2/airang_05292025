"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "./button"
import { useTranslation } from "@/app/i18n/useTranslation"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export function Modal({ isOpen, onClose }: ModalProps) {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="bg-gradient-to-br from-violet-500/20 to-blue-500/20 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl w-[320px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{t('modalTitle')}</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-300 mb-6">
                {t('modalDesc')}
                <br />
                <span className="text-violet-400 font-semibold mt-2 block">
                  {t('modalHighlight')}
                </span>
              </p>
              <div className="flex justify-end">
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300"
                >
                  {t('modalConfirm')}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 