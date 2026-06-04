import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Inter } from 'next/font/google'
import './globals.css'
import XPToast from '@/components/XPToast'
import ServiceWorker from '@/components/ServiceWorker'
import InstallPrompt from '@/components/InstallPrompt'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'CyberAcademy',
  description: 'Learn cybersecurity from scratch — fundamentals, defense, secure coding.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CyberAcademy',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased bg-[#000000] text-[#c8ffc8]">
        {/* Global scan line sweep */}
        <div className="scan-line" aria-hidden />
        {children}
        <XPToast />
        <ServiceWorker />
        <InstallPrompt />
      </body>
    </html>
  )
}