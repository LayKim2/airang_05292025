"use client";
import { LanguageProvider } from "@/app/i18n/LanguageProvider";
import { useUserProfile } from "@/app/lib/useUserProfile";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useUserProfile();
  return <LanguageProvider>{children}</LanguageProvider>;
} 