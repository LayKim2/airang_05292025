"use client"
import { Suspense } from "react"
import ServiceRegisterForm from "./ServiceRegisterForm"

export default function ServiceRegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServiceRegisterForm />
    </Suspense>
  )
} 