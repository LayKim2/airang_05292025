import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './components/theme-provider'
import { Header } from "./components/home/Header"
import ClientLayout from "@/app/components/ClientLayout"
import GoogleAnalytics from './components/GoogleAnalytics'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | AIrang',
    default: 'AIrang - AI Creator Community',
  },
  description: 'Connect with AI creators and collaborate on innovative projects',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkProvider>
          <GoogleAnalytics />
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
        </ClerkProvider>
      </body>
    </html>
  )
}
