import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })

export const metadata: Metadata = {
  title: 'Kamay Aral',
  description: 'Learn Filipino Sign Language — interactive lessons and activities.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Kamay Aral',
  },
}

export const viewport: Viewport = {
  themeColor: '#0BC2D7',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} h-full`} suppressHydrationWarning>
      <head>
        {/* Runs before hydration so a saved font-size preference applies
            immediately instead of flashing at the default size first. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var f=localStorage.getItem('fontSize');if(f)document.documentElement.setAttribute('data-font-size',f);}catch(e){}`,
          }}
        />
        {/* Runs before hydration so a saved dark-theme preference applies
            immediately instead of flashing light mode first. Light is the
            fixed default — the OS color scheme is intentionally ignored. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark');}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full bg-background font-sans antialiased">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
