"use client"

import { useState, ChangeEvent } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Loader2, ArrowRight } from 'lucide-react'

export function CreatorApplicationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceDescription: '',
    serviceImage: null as File | null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // 임시로 1초 후에 성공 메시지 표시
    setTimeout(() => {
      setIsLoading(false)
      alert('신청이 완료되었습니다!')
      setFormData({
        name: '',
        email: '',
        serviceDescription: '',
        serviceImage: null
      })
    }, 1000)
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
          이름
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleInputChange}
          className="bg-white/5 border-white/10 text-white"
          placeholder="홍길동"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          이메일 주소
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          className="bg-white/5 border-white/10 text-white"
          placeholder="example@email.com"
        />
      </div>

      <div>
        <label htmlFor="serviceDescription" className="block text-sm font-medium text-gray-300 mb-2">
          서비스 설명
        </label>
        <Textarea
          id="serviceDescription"
          name="serviceDescription"
          required
          value={formData.serviceDescription}
          onChange={handleInputChange}
          className="bg-white/5 border-white/10 text-white min-h-[120px]"
          placeholder="개발 중인 AI 서비스에 대해 설명해주세요"
        />
      </div>

      <div>
        <label htmlFor="serviceImage" className="block text-sm font-medium text-gray-300 mb-2">
          서비스 이미지
        </label>
        <Input
          id="serviceImage"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-medium px-8 py-6 rounded-xl transition-all duration-300 group shadow-lg hover:shadow-xl"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            처리 중...
          </>
        ) : (
          <>
            신청하기
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>
    </form>
  )
} 