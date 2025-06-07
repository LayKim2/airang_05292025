"use client"

import { useState, ChangeEvent } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Loader2, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useTranslation } from '@/app/i18n/useTranslation'

export function CreatorApplicationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceDescription: '',
    serviceImage: null as File | null
  })
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      let imageUrl = null
      
      // 이미지가 있는 경우 Storage에 업로드
      if (formData.serviceImage) {
        const file = formData.serviceImage
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        
        const { data: imageData, error: imageError } = await supabase.storage
          .from('service-images')
          .upload(fileName, file)
        
        if (imageError) throw imageError
        
        // 업로드된 이미지의 public URL 가져오기
        const { data: { publicUrl } } = supabase.storage
          .from('service-images')
          .getPublicUrl(fileName)
        
        imageUrl = publicUrl
      }
      
      // 데이터베이스에 저장
      const { data, error } = await supabase
        .from('creator_applications')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            service_description: formData.serviceDescription,
            service_image_url: imageUrl
          }
        ])
      
      if (error) throw error
      
      alert(t('formSuccess'))
      setFormData({
        name: '',
        email: '',
        serviceDescription: '',
        serviceImage: null
      })
    } catch (error) {
      console.error('Error:', error)
      alert(t('formError'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, serviceImage: file }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          {t('formName')}
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleInputChange}
          className="bg-white/5 border-white/10 text-white"
          placeholder={t('formName')}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          {t('formEmail')}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          className="bg-white/5 border-white/10 text-white"
          placeholder={t('formEmail')}
        />
      </div>

      <div>
        <label htmlFor="serviceDescription" className="block text-sm font-medium text-gray-300 mb-2">
          {t('formServiceDescription')}
        </label>
        <Textarea
          id="serviceDescription"
          name="serviceDescription"
          required
          value={formData.serviceDescription}
          onChange={handleInputChange}
          className="bg-white/5 border-white/10 text-white min-h-[120px]"
          placeholder={t('formServiceDescription')}
        />
      </div>

      <div>
        <label htmlFor="serviceImage" className="block text-sm font-medium text-gray-300 mb-2">
          {t('formServiceImage')}
        </label>
        <Input
          id="serviceImage"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      <p className="text-xs text-gray-400 mt-2">
        {t('formNotice')}
      </p>

      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full max-w-xs bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-medium px-8 py-6 rounded-xl transition-all duration-300 group shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t('formSubmitting')}
            </>
          ) : (
            <>
              {t('formSubmit')}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </div>
    </form>
  )
} 