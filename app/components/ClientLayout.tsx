"use client";
import { LanguageProvider } from "@/app/i18n/LanguageProvider";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
} 