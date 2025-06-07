import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './components/theme-provider'
import { Header } from "./components/home/Header"
import ClientLayout from "@/app/components/ClientLayout"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AIrang - AI 크리에이터 커뮤니티',
  description: 'AI 기술을 활용한 혁신적인 서비스들을 만나보세요',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
          </ThemeProvider>
        </ClientLayout>
      </body>
    </html>
  )
}
